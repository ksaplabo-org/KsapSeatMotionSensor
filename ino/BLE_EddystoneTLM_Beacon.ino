#include "sys/time.h"

#include <Arduino.h>
#include <string>

#include "BLEDevice.h"
#include "BLEUtils.h"
#include "BLEBeacon.h"
#include "BLEAdvertising.h"
#include "BLEEddystoneURL.h"

#include "esp_sleep.h"

#define GPIO_DEEP_SLEEP_DURATION 10     // sleep x seconds and then wake up
RTC_DATA_ATTR static time_t last;    // remember last boot in RTC Memory
RTC_DATA_ATTR static uint32_t bootcount; // remember number of boots in RTC Memory

// See the following for generating UUIDs:
// https://www.uuidgenerator.net/
BLEAdvertising *pAdvertising;
struct timeval nowTimeStruct;

time_t lastTenth;

const int vol_pin = 14;//圧力センサ用アナログピン

#define BEACON_UUID "8ec76ea3-6668-48da-9866-75be8bc86f4d" // UUID 1 128-Bit (may use linux tool uuidgen or random numbers via https://www.uuidgenerator.net/)

void setBeacon()
{
  uint16_t beconUUID = 0xFEAA;

  BLEAdvertisementData oAdvertisementData = BLEAdvertisementData();
  BLEAdvertisementData oScanResponseData = BLEAdvertisementData();
  
  oScanResponseData.setFlags(0x06); // GENERAL_DISC_MODE 0x02 | BR_EDR_NOT_SUPPORTED 0x04
  oScanResponseData.setCompleteServices(BLEUUID(beconUUID));
  
  char state;
  state = StateRead();

  oScanResponseData.setServiceData(BLEUUID(beconUUID), &state);
  oAdvertisementData.setName("TLMBeacon");
  pAdvertising->setAdvertisementData(oAdvertisementData);
  pAdvertising->setScanResponseData(oScanResponseData);
}

void setup()
{

  Serial.begin(115200);
  gettimeofday(&nowTimeStruct, NULL);

  Serial.printf("start ESP32 %d\n", bootcount++);

  Serial.printf("deep sleep (%lds since last reset, %lds since last boot)\n", nowTimeStruct.tv_sec, nowTimeStruct.tv_sec - last);

  last = nowTimeStruct.tv_sec;
  lastTenth = nowTimeStruct.tv_sec * 10; // Time since last reset as 0.1 second resolution counter

  // Create the BLE Device
  BLEDevice::init("TLMBeacon");

  BLEDevice::setPower(ESP_PWR_LVL_N12);

  pAdvertising = BLEDevice::getAdvertising();

}

//感圧センサの状態を読み取り、状態をreturnする
char StateRead() {
  // アナログピンの入力値を読み込み。
  int sensorValue = analogRead(vol_pin);

  // ある程度圧力が加わった場合
  if (sensorValue < 2000) {
    Serial.println("high");
    return '1';
  }
  else {
    Serial.println("low");
    return '0';
  }
}


void loop()
{
  setBeacon();
  // Start advertising
  pAdvertising->start();
  delay(3000);
}

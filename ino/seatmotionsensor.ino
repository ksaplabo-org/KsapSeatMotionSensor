#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>


BLEServer *pServer;
BLEService *pService;
BLECharacteristic *pCharacteristic;

bool deviceConnected = false;
uint8_t value = 0;

// PIN number
#define GPIOINPUT 27
#define GPIOOUTPUT 25

// See the following for generating UUIDs:
// https://www.uuidgenerator.net/

#define SERVICE_UUID        "D5875408-FA51-4763-A75D-7D33CECEBC31"
#define CHARACTERISTIC_UUID "A4F01D8C-A037-43B6-9050-1876A8C23584"

class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      Serial.println("Connected!");
      deviceConnected = true;
    };

    void onDisconnect(BLEServer* pServer) {
      Serial.println("DisConnected!");
      deviceConnected = false;
      // Start advertising
      pServer->getAdvertising()->start();
      Serial.println("Waiting a client connection to notify...");      
    }
};

void doInitialize() {
  Serial.begin(115200);
  //人感センサの入力ピン
  pinMode(GPIOINPUT, INPUT);  
}

void setup() {

  //初期処理
  doInitialize();
  
  // Create the BLE Device
  BLEDevice::init("ESP32_Local_Device");

  // Create the BLE Server
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Create the BLE Service
  pService = pServer->createService(SERVICE_UUID);

  // Create a BLE Characteristic
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ   |
                      BLECharacteristic::PROPERTY_WRITE  |
                      BLECharacteristic::PROPERTY_NOTIFY |
                      BLECharacteristic::PROPERTY_INDICATE
                    );

  // https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.descriptor.gatt.client_characteristic_configuration.xml
  // Create a BLE Descriptor
  pCharacteristic->addDescriptor(new BLE2902());

  // Start the service
  pService->start();

  // Start advertising
  pServer->getAdvertising()->start();
  Serial.println("Waiting a client connection to notify...");
}

void loop() {

  if (deviceConnected) {
    
    //人感センサの読み取り値が１
    if (digitalRead(GPIOINPUT) == 1){
      pCharacteristic->setValue("1");
      pCharacteristic->notify();
      Serial.println(1);
    }else{
      pCharacteristic->setValue("0");
      pCharacteristic->notify();
      Serial.println(0);
    }
    
  } 
  delay(1000);
}

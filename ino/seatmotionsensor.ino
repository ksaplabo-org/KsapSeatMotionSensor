#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// BLE characteristic
#define SERVICE_UUID           "28b0883b-7ec3-4b46-8f64-8559ae036e4e"
#define CHARACTERISTIC_UUID_TX "2049779d-88a9-403a-9c59-c7df79e1dd7c"

// BLE Device name
#define DEVICENAME "ESP32"

// serial speed
#define SPI_SPEED 115200

// PIN number
#define GPIOINPUT 27
#define GPIOOUTPUT 25

bool is_seatsettings[29];
int count_motion_sensor = 0;

// characteristic valueable
BLECharacteristic *pCharacteristicTX;
bool deviceConnected = false;

// send data
int send_cnt = 0;

// Server Callbacks of Connection
class funcServerCallbacks: public BLEServerCallbacks{
    void onConnect(BLEServer* pServer){
        deviceConnected = true;
    }
    void onDisconnect(BLEServer* pServer){
        deviceConnected = false;
    }
};

// Characteristic
void doPrepare(BLEService *pService){
    // Create Characteristic of Notify
    pCharacteristicTX = pService->createCharacteristic(
                      CHARACTERISTIC_UUID_TX,
                      BLECharacteristic::PROPERTY_NOTIFY
                    );
    pCharacteristicTX->addDescriptor(new BLE2902());
}

void doInitialize() {
  Serial.begin(SPI_SPEED);
  //人感センサの入力ピン
  pinMode(GPIOINPUT, INPUT);
  //LEDの出力ピン
  pinMode(GPIOOUTPUT, OUTPUT);
  
}

void setup() {
  // Initialize the pinMode
  doInitialize();

  // Initialize the BLE environment
  BLEDevice::init(DEVICENAME);
  
  // Create the server
  BLEServer *pServer = BLEDevice::createServer();

  // Callback the server
  pServer->setCallbacks(new funcServerCallbacks);
  
  // Create the service
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Create the characteristic
  doPrepare(pService);
  
  // Start the service
  pService->start();
  
  BLEAdvertising *pAdvertising = pServer->getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->start();

  // Wait Connect
  Serial.println("Waiting to connect...");
  while(!deviceConnected){delay(100);}

  // Connection  
  Serial.println("Connection!");

  delay(100);
}

void loop() {

  //人感センサの入力値を読み取り
  int btnState = digitalRead(GPIOINPUT);
  //入力値をシリアルボードに出力
  Serial.println(btnState);

  //人感センサからの入力があればフラグをTrue
  if (btnState == 1){
    is_seatsettings[count_motion_sensor] = true;
  }else{ 
    is_seatsettings[count_motion_sensor] = false;
  }

  //30秒立ったら
  if (count_motion_sensor == 29){

    int ret = 0;
    
    //配列の中にTureがあることを確認する
    for(int i = 0; i<30; i++){
      
      //Trueがあれば
      if (is_seatsettings[i] == true){
        ret = ret + 1;
      }
    }

    //動いたと判断したら
    if (ret > 0){
      pCharacteristicTX->setValue("sit");
      pCharacteristicTX->notify();
      digitalWrite(GPIOOUTPUT, HIGH);
    //動いていなかったら
    }else{
      pCharacteristicTX->setValue("stand");
      pCharacteristicTX->notify();
      digitalWrite(GPIOOUTPUT, LOW);
    }

    //カウンターのリセット
    count_motion_sensor = 0;
    
  }else{
    //約30秒カウントする 
    count_motion_sensor = count_motion_sensor + 1;  
  }

  //1秒でループする
  delay(1000);
}

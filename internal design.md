# 内部設計  

## IoTデバイス
|デバイス名|役割|
|---|---|
|Raspberry Pi 4 model B|ESP32からの受信を行い、データをMQTTでパブリッシュする|
|ESP32|センサと接続し、取得したデータをBLEBeaconでRaspberry Piに向け送信する|
|感圧センサ(ALPHA-MF02-N-221-A01)|椅子に圧力がかかっているかを検知する|

## AWS周辺  

### DynamoDB  

|DynamoDB名|パーテンションキー|DBの役割|
|---|---|---|
|ksap-seatingstate-tbl|SeatName|各人の着席状態を保持|
|ksap-seatingstatehistory-tbl|GetDatetime|ESPからのデータを保持|
|ksap-seatingmaster-tbl|EspMacAddress|ESPのMACアドレスに対応した座席名を保持|  

### Lambda  

|関数名|役割|
|---|---|
|updateSeatingStateHistoryTableFunc|MQTTの受信をトリガに、データをksap-seatingstate-tblにupdateする<br>また、受信したESPのMACアドレスをキーにksap-seatingmaster-tblへ接続し、座席名を取得する|
|getSeatingStateTableFunc|リクエストで起動し、ksap-seatingstate-tblの値をscanし返却する|  

### Api Gateway  

|API名|役割|
|---|---|
|SeatMotionAPI|Web画面とLambdaの架け橋となり、リクエストを受けたらLambdaにリクエストを行う|  

### S3  

Webページの公開はHTTPSで行う  




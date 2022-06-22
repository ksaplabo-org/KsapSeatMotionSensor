# 内部設計  

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
|updateSeatingStateHistoryTableFunc|MQTTの受信をトリガに、データをksap-seatingstate-tblにupdateする<br>また、受信したESPのMACアドレスをキーに、ksap-seatingmaster-tblへ接続し、座席名を取得する|
|getSeatingStateTableFunc|GetDatetime|




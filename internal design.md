# 内部設計  

## AWS周辺  

### DynamoDB  

|DynamoDB名|パーテンションキー|DBの役割|
|---|---|---|
|ksap-seatingstate-tbl|SeatName|各人の着席状態を保持|
|ksap-seatingstatehistory-tbl|GetDatetime|ESPからのデータを保持|
|ksap-seatingmaster-tbl|EspMacAddress|ESPの電源が入っていることを確認してください。|  




# SeatMotionSensor

## 目次  
- [全体概要](#content1)  
- [ESP32で人感センサの操作](#content2)  
- [Raspberry Piでデータ送受信](#content3)  
- [データ受信して、DynamoDBへ登録するまでの流れ](#content4)  


<h2 id="content1">全体概要</h2>  

![全景](./img/全体概要.png)  

支店管理部の在籍情報をリアルタイムで知ることができるシステムの開発  

・システム説明  
図の左半分：管理部の座席足元に人感センサを設置して、1秒単位で席にいるかどうかをESP32でキャッチ  
           それを30秒間続けて、30秒に1回着席情報をRaspberry Piへ送信  
           それを受け取ったRaspberry PiがIoT Coreへパブリッシュする  

図の右半分：IoT Coreの受信をトリガーに、DynamoDBへ日時をキーとしてデータ登録  
           このデータ登録をトリガーとして、もう一つのDynamoDBに座席名をキーとしてデータ登録  
           S3の静的ホスティングサービスを使い、公開されたURLに利用者はアクセスする。  
           S3に保存してある、JavaScriptからAPIGateway、Lambdaを介して在籍情報を取得  
           データを成形して、ブラウザ上に表示する  

文章での説目では分かりずらいので、それぞれの機能実装手順を以下にしてしていく  


<h2 id="content2">ESP32で人感センサの操作</h2>  

人感センサの仕組みについては[こちら](./%E6%8A%80%E8%A1%93%E8%AA%BF%E6%9F%BB.md)を参照  

ESP32と人感センサの配線は以下のように組む  
※配線図用意  

ソースは以下のようになる
※ソース説明  


<h2 id="content3">Raspberry Piでデータ送受信</h2>  

Raspberry Piのセットアップは[こちら](https://github.com/ksaplabo-org/Raspi-Setup)を参照  

※ソースは検討中  

<h2 id="content4">データ受信して、DynamoDBへ登録するまでの流れ</h2>  
 
- Iot Coreで「モノ」の作成  
  作成方法については[こちら](https://github.com/ksaplabo-org/aircondition#awsiot-core%E3%81%A7%E3%83%A2%E3%83%8E%E6%83%85%E5%A0%B1%E3%82%92%E4%BD%9C%E6%88%90)を参照  
  モノの名前は任意で作成  

  MQTTテストクライアントで受信するとこを確認出来たら、DynamoDBの作成を行う  

- DynamoDBの作成  
  今回はDynamoDBを2つ用意する。  
  1.受信したデータを全て登録するDynamoDB  
  2.座席名ごとに着席情報を管理するDynamoDB  
  
  1.受信したデータを全て登録するDynamoDB  

  DynamoDBを作成方法は[こちら](https://github.com/ksaplabo-org/aircondition#aws%E5%8F%97%E4%BF%A1%E3%81%97%E3%81%9F%E3%83%87%E3%83%BC%E3%82%BF%E3%82%92dynamodb%E3%81%AB%E7%99%BB%E9%8C%B2%E3%81%99%E3%82%8B)を参照  
  今回作成するDynamoDB名は以下の通り ※名前は任意  
  DynamoDB名：ksap-seatingstatehistory-tbl  
  
  DynamoDBのコンソール画面から「テーブル」＞「項目の探索」を選択し  
  作成したDynamoDBを選択  
  「項目の作成」を選択して、以下のテストデータを作成  

  ![1DynamoDB](./img/1DynamoDB.png)  

  項目名は任意だが、この後のソースでこの名前を使用するため後で迷わないように  

  2.座席名ごとに着席情報を管理するDynamoDB  

  1と同様の手順でテストデータまで作成  
  DynamoDB名：ksap-seatingstate-tbl  

  ![2-1DynamoDB](./img/2-1DynamoDB.png)  
  ![2-2DynamoDB](./img/2-2DynamoDB.png)  

- Lambdaの作成  

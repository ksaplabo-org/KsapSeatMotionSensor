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
作成方法については[こちら]()を参照  

- Iot Coreで「モノ」の作成  
  作成方法については[こちら]()を参照  
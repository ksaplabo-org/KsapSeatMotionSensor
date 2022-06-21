##MQTTの受信をトリガーにし、受け取った値をSeatingStateTableにupdateする
import json
import boto3

def lambda_handler(event, context):
    
    print(event)
    #SeatingStateTableに送信したいデータを取得
    for record in event['Records']:
        
        try:
            state_data = record['dynamodb']['NewImage']['State']['S']
            mac_address = record['dynamodb']['NewImage']['EspMacAddress']['S']
        except Exception as e:
            print(1)
            print(e)
            continue
    
        try:        
            #マスタDB接続処理
            master_dynamodb = boto3.resource('dynamodb')
            master_table = master_dynamodb.Table('ksap-seatingmaster-tbl')
        
            #マスターテーブルのMACアドレスから名前を取得
            res = master_table.get_item(
                Key={
                    'EspMacAddress': mac_address
                }
            )
        
            item = res['Item']
            
            #DynamoDB接続処理
            dynamodb = boto3.resource('dynamodb')
            table = dynamodb.Table('ksap-seatingstate-tbl')
            
            #状態がテレワークの場合、状態の更新はしない
            res2 = table.get_item(
                Key={
                    'SeatName':item['SeatName']
                }
            )
            
            #状態がテレワーク
            if res2['Item']['State'] == "Telework":
                #何もしない
                pass
            else:
                #SeatNameをキーに値を状態を更新
                ret = table.put_item(
                    Item={
                        'SeatName': item['SeatName'],
                        'SeatNameJP':item['SeatNameJP'],
                        'State':state_data
                    }
                )
        except Exception as e:
            print(e)
            print(2)
            continue
            
    return{
        'statusCode':200,
        'body': "Success!!!"
    }
    
##MQTTの受信をトリガーにし、受け取った値をSeatingStateTableにupdateする
import json
import boto3

def lambda_handler(event, context):
    
    print(event)
    #SeatingStateTableに送信したいデータを取得
    for record in event['Records']:
        
        try:
            print(record['dynamodb'])
            #key_data = record['dynamodb']['NweImage']['GetDateTime']['S']
            name_data = record['dynamodb']['NewImage']['SeatName']['S']
            state_data = record['dynamodb']['NewImage']['State']['S']
        except Exception as e:
            print(e)
            continue
    
        print(name_data)
        print(state_data)
        
        #DynamoDB接続処理
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('ksap-seatingstate-tbl')
        
        #SeatNameをキーに値を状態を更新
        ret = table.put_item(
            Item={
                'SeatName': name_data,
                'State':state_data
            }
        )
    return{
        'statusCode':200,
        'body': "Success!!!"
    }
    
import json
import boto3

from boto3.dynamodb.conditions import Key               #Keyオブジェクトを利用できるようにする

dynamodb = boto3.resource('dynamodb')                   #Dynamodbアクセスのためのオブジェクト取得
table = dynamodb.Table("ksap-seatmotionsensor-tbl")     #指定テーブルのアクセスオブジェクト取得

# テーブルスキャン
def operation_scan():
    scanData = table.scan()	                            #scan()メソッドでテーブル内をscan。一覧を取得
    items=scanData['Items']	                            #応答からレコード一覧を抽出
    print(items)	                                    #レコード一覧を表示
    return scanData

# レコード検索
def operation_query(partitionKey, sortKey):
    queryData = table.query(                                                                    #query()メソッドでテーブル内を検索
        KeyConditionExpression = Key("DeviceID").eq(partitionKey) & Key("SensorID").eq(sortKey)	#検索キー(DeviceIDとSensorID)を設定
    )
    items=queryData['Items']    #応答から取得レコードを抽出
    print(items)    #取得レコードを表示
    return queryData

def lambda_handler(event, context):	                        #Lambdaから最初に呼びされるハンドラ関数

    print("Received event: " + json.dumps(event))	        #引数：eventの内容を表示
    OperationType = event['OperationType']	                #引数から操作タイプを取得
    
    try:
        if OperationType == 'SCAN':	                        #OperationTypeが'SCAN'か判定
            return operation_scan()
            
        PartitionKey = event['Keys']['DeviceID']	        #引数からDeviceIDの値を取得
        SortKey = event['Keys']['SensorID']	                #引数からSensorIDの値を取得
        
        if OperationType == 'QUERY':	                    #OperationTypeが'QUERY'か判定
            return operation_query(PartitionKey, SortKey)
            
    except Exception as e:
        print("Error Exception.")
        print(e)
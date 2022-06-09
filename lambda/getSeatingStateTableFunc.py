import json
import boto3

from boto3.dynamodb.conditions import Key               #Keyオブジェクトを利用できるようにする

dynamodb = boto3.resource('dynamodb')                   #Dynamodbアクセスのためのオブジェクト取得
table = dynamodb.Table("ksap-seatingstate-tbl")         #指定テーブルのアクセスオブジェクト取得


def lambda_handler(event, context):	                        #Lambdaから最初に呼びされるハンドラ関数

    #print("Received event: " + json.dumps(event))	        #引数：eventの内容を表示
    #OperationType = event['OperationType']	                #引数から操作タイプを取得
    
    try:
        scanData = table.scan()	                            #scan()メソッドでテーブル内をscan。一覧を取得
        items=scanData['Items']	                            #応答からレコード一覧を抽出
        print(items)	                                    #レコード一覧を表示
        return scanData
    
            
    except Exception as e:
        print("Error Exception.")
        print(e)
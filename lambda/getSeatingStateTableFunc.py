import json
import boto3

dynamodb = boto3.resource('dynamodb')                   #Dynamodbアクセスのためのオブジェクト取得
table = dynamodb.Table("ksap-seatingstate-tbl")         #指定テーブルのアクセスオブジェクト取得

def lambda_handler(event, context):	                        #Lambdaから最初に呼びされるハンドラ関数

    try:
        scanData = table.scan()	                            #scan()メソッドでテーブル内をscan。一覧を取得
        items=scanData['Items']	                            #応答からレコード一覧を抽出
        print(items)	                                    #レコード一覧を表示
        return scanData
    
    except Exception as e:
        print("Error Exception.")
        print(e)
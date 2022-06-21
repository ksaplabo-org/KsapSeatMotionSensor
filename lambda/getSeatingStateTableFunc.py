import json
import boto3

dynamodb = boto3.resource('dynamodb')                   #Dynamodbアクセスのためのオブジェクト取得
table = dynamodb.Table("ksap-seatingstate-tbl")         #指定テーブルのアクセスオブジェクト取得

def lambda_handler(event, context):	                        #Lambdaから最初に呼びされるハンドラ関数
        
    seat_name = event["SeatName"]

    #allの場合、テーブルレコード全取得
    if seat_name == 'all':
        
        try:
            scanData = table.scan()	                            #scan()メソッドでテーブル内をscan。一覧を取得
            items=scanData['Items']	                            #応答からレコード一覧を抽出
            print(items)	                                    #レコード一覧を表示
            return scanData
                
        except Exception as e:
            print("Error Exception.")
            print(e)

    #引数に値がある場合、テレワークボタンからの呼び出し
    else:
        #seat_nameから状態を取得
        res = table.get_item(
            Key={
                'SeatName': seat_name
            }
        )
        state = res['Item']['State']

        #状態がTelework→Stand
        #Sit or Stand→Teleworkに変更
        if state == 'Telework':
            state = 'Stand'
        else:
            state = 'Telework'
        
        #変更した状態を更新する
        response = table.put_item(
            Item={
                'SeatName':seat_name,
                'SeatNameJP':res['Item']['SeatNameJP'],
                'State':state
            }
        )
        
        #状態を更新し、返却する
        res['Item']['State'] = state
        return res

posturl = "https://ogqmzmiqhf.execute-api.ap-northeast-1.amazonaws.com/APIseatstage/seatmotionresource";
var jsondata = "";

//キャッシュ用データ
var cacheData = "";

//main処理
$.ajax({
    dataType : "json",
    data : JSON.stringify(jsondata),
    type : "POST",
    url : posturl,
    success: function(data){
        //データキャッシュ
        cacheData = data;

        for (i = 0; i < data.Count; i++){

            createNewPlate(data.Items[i].State, data.Items[i].SeatName);
        }
    }
});

//30秒後に状態更新する関数を呼び出す
//setTimeout(updateState(),30000);

function createNewPlate(getState, getSeatName){
    //着席状態の確認
    state = checkSeatingState(getState);
        
    //ローマ字の名前から日本語に変換
    japaneseName = changeJapaneseName(getSeatName);

    //スケルトンから項目を作成
    newElement = createPlateTag(state, getSeatName, japaneseName);

    //作成した項目を配置
    const contentElement = document.getElementById("content");
    contentElement.appendChild(newElement);
}

function updateState(){
    //content下の子要素の数を取得
    contenEelement = document.getElementById("content");
    contentChildElementCount = contenEelement.childElementCount;

    //APIGateWayにリクエスト
    $.ajax({
        dataType : "json",
        data : JSON.stringify(jsondata),
        type : "POST",
        url : posturl,
        success: function(getData){
            //取得データ分ループする
            for (getDataCount = 0; getDataCount < getData.Count; getDataCount++){
                
                //キャッシュ情報の有無をフラグ管理
                is_cache = false;

                //キャッシュデータ分ループする
                for (cacheDataCount =0; cacheDataCount < cacheData.Count; cacheDataCount++){
                    
                    //キャッシュデータに存在するかを確認
                    if (cacheData.Items[cacheDataCount].SeatName == getData.Items[getDataCount].SeatName){
                        //キャッシュにある場合、前情報に関わらず、更新する
                        changeStateImg(cacheData.Items[cacheDataCount].SeatName, getData.Items[getDataCount].State);

                        //キャッシュ情報があったことをフラグに持つ
                        is_cache = true;
                    }
                }
                if (!is_cache){
                    //キャッシュ情報にない場合、新たに項目作成
                    createNewPlate(getData.Items[getDataCount].State, getData.Items[getDataCount].SeatName);
                }
                
            }
            //キャッシュデータを更新
            cacheData = getData;
        }
    });
}

//状態を変更する
function changeStateImg(getName, getState){

    //着席状態の確認
    state = checkSeatingState(getState);

    //更新対象を取得
    plateElement = document.getElementById(getName);

    //文字設定
    plateElement.children[1].children[0].children[0].innerHTML = state;

    //画像変更
    plateElement.children[1].children[0].children[1].children[0].src = "./assets/img/" + state + ".png";


}
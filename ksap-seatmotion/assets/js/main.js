posturl = "https://n2vcdsv6gd.execute-api.ap-northeast-1.amazonaws.com/APIseatstage/seatmotionresource";
param = {'SeatName' : 'all'}

$(document).ready(function(){

    //URLのパラメータを取得  
    //var param = document.location.search.length;
    //alert(document.location.search.substring(1));

    updateSeat(param);

    //3秒に1回着席情報を更新する
    setInterval("updateSeat(param)",3000);
})

function updateSeat(jsondata){
    
    //APIGateWayにリクエスト
    $.ajax({
        dataType : "json",
        data : JSON.stringify(jsondata),
        type : "POST",
        url : posturl,
        success: function(data){
            //レコード全取得の場合
            if (jsondata['SeatName'] == 'all'){
                //取得データ分ループする
                //for (getDataCount = 0; getDataCount < getData.Count; getDataCount++){
                data.Items.forEach(function(seat){
                    if(document.getElementById(seat.SeatName) == null){
                        createPlate(seat.SeatName, seat.State, seat.SeatNameJP);    
                    }else{
                        updateState(seat.SeatName, seat.State);
                    }
                });
            }else{
                //状態更新を行う
                updateState(data.Item.SeatName, data.Item.State);
            }
        }
    });
}

//管理者用テレワーク更新ボタンクリックイベント
$(document).on("click",".telework-btn",function(){
    
    //buttonのid名からseatnameを取得
    id = $(this).context.getAttribute("id");
    seat_name = id.substring(0, id.length - 4);

    //状態を更新
    updateSeat({'SeatName':seat_name});
});
          
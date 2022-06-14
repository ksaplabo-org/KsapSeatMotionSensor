posturl = "APIゲートウェイのURL";
var jsondata = "";

$(document).ready(function(){

    updateSeat();

    //3秒に1回着席情報を更新する
    setInterval(updateSeat,3000);
})

function updateSeat(){
    
    //APIGateWayにリクエスト
    $.ajax({
        dataType : "json",
        data : JSON.stringify(jsondata),
        type : "POST",
        url : posturl,
        success: function(data){
            //取得データ分ループする
            //for (getDataCount = 0; getDataCount < getData.Count; getDataCount++){
            data.Items.forEach(function(seat){
                if(document.getElementById(seat.SeatName) == null){
                    createPlate(seat.SeatName, seat.State, seat.SeatNameJP);    
                }else{
                    updateState(seat.SeatName, seat.State);
                }
            });
        }
    });
}

                
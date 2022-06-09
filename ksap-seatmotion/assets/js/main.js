posturl = "https://ogqmzmiqhf.execute-api.ap-northeast-1.amazonaws.com/APIseatstage/seatmotionresource";
var jsondata = "";

$(document).ready(function(){
    updateSeat();

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

                
//在籍情報の確認
function getStateStr(data){
    if (data == "Sit"){
      return "着席";
    }else{
      return "外出";
    }
}

//plateタグの作成
function createPlateTag(seatName, state, seatNameJP){

    // スケルトンの取得
    const skeletonElement = document.getElementById('skeleton');
    //コピーして新たに作成
    var copyElement = skeletonElement.cloneNode(true);

    //名前を設定
    copyElement.children[0].innerHTML = seatNameJP;
    //「着席」「外出」の文字を設定
    copyElement.children[1].children[0].children[0].innerHTML = state;
    //id名設定
    copyElement.children[1].children[0].children[1].id = "mark-frame-" + seatName;

    // 新しいHTML要素の作成
    const newElement = document.createElement("img");
    newElement.src = "./assets/img/" + state + ".png";
    newElement.className = "mark";
    //画像挿入
    copyElement.children[1].children[0].children[1].appendChild(newElement);

    //id属性を削除する
    copyElement.removeAttribute("id");

    //名前に対応したid名に変更する
    copyElement.setAttribute("id", seatName);

    return copyElement;
}

function createPlate(seatName, state, seatNameJP){
    //スケルトンから項目を作成
    newElement = createPlateTag(seatName, getStateStr(state), seatNameJP);

    //作成した項目を配置
    const contentElement = document.getElementById("content");
    contentElement.appendChild(newElement);
}

//状態を変更する
function updateState(name, state){

    //着席状態の確認
    stateStr = getStateStr(state);

    //更新対象を取得
    plateElement = document.getElementById(name);

    //文字設定
    plateElement.children[1].children[0].children[0].innerHTML = stateStr;

    //画像変更
    plateElement.children[1].children[0].children[1].children[0].src = "./assets/img/" + stateStr + ".png";


}
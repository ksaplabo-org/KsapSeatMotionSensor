//在籍情報の確認
function getStateStr(data){
    if (data == "Sit"){
      return "着席";
    }else if(data == "Stand"){
      return "外出";
    }else if(data == "Telework"){
      return "テレワーク";
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

    //挿入先の要素を取得
    contentElement = document.getElementById("content");

    //スケルトンから項目を作成
    newElement = createPlateTag(seatName, getStateStr(state), seatNameJP);

    // スケルトンの取得
    const copyElement = document.getElementById('frame-skeleton');
    //親plantの作成
    var plantFrameElement = copyElement.cloneNode(false);
    //中身を挿入 
    plantFrameElement.appendChild(newElement);

    //テレワークボタンの作成
    const btnElement = document.createElement("button");
    btnElement.type = "button";
    btnElement.className = "telework-btn";
    btnElement.textContent = "テレワーク";
    btnElement.id = seatName + "-btn";

    //管理画面の場合、テレワークボタンを表示する
    if (document.location.search.substring(1) == "management"){
      btnElement.style.display = "";
    }else{
      btnElement.style.display = "none";
    }

    //中身を挿入
    plantFrameElement.appendChild(btnElement);

    //作成した項目を配置
    contentElement.appendChild(plantFrameElement);

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

    
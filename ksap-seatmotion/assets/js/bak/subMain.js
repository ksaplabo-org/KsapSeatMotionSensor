//在籍情報の確認
function checkSeatingState(data){
    if (data == "Sit"){
      return "着席";
    }else{
      return "外出";
    }
}

//ローマ字名前から日本語名前に変換
function changeJapaneseName(romajiName){
    if (romajiName == "Oosawa"){
        return "大澤";
    }else if(romajiName == "Nakaya"){
        return "中谷";
    }
}

//plateタグの作成
function createPlateTag(state, romajiName, japaneseName){

    // スケルトンの取得
    const skeletonElement = document.getElementById('skeleton');
    //コピーして新たに作成
    var copyElement = skeletonElement.cloneNode(true);

    //名前を設定
    copyElement.children[0].innerHTML = "管理）" + japaneseName;
    //「着席」「外出」の文字を設定
    copyElement.children[1].children[0].children[0].innerHTML = state;
    //id名設定
    copyElement.children[1].children[0].children[1].id = "mark-frame-" + romajiName;

    // 新しいHTML要素の作成
    const newElement = document.createElement("img");
    newElement.src = "./assets/img/" + state + ".png";
    newElement.className = "mark";
    //画像挿入
    copyElement.children[1].children[0].children[1].appendChild(newElement);

    //id属性を削除する
    copyElement.removeAttribute("id");

    //名前に対応したid名に変更する
    copyElement.setAttribute("id", romajiName);

    return copyElement;
}
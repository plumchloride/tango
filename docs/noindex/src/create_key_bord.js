const KEYBORD_LIST = [["ワ","ラ","ヤ","マ","ハ","ナ","タ","サ","カ","ア"],
                      ["ヲ","リ","　","ミ","ヒ","ニ","チ","シ","キ","イ"],
                      ["ン","ル","ユ","ム","フ","ヌ","ツ","ス","ク","ウ"],
                      ["　","レ","　","メ","ヘ","ネ","テ","セ","ケ","エ"],
                      ["　","ロ","ヨ","モ","ホ","ノ","ト","ソ","コ","オ"],
                      ["ガ","ギ","グ","ゲ","ゴ","ザ","ジ","ズ","ゼ","ゾ"],
                      ["ダ","ヂ","ヅ","デ","ド","バ","ビ","ブ","ベ","ボ"],
                      ["パ","ピ","プ","ペ","ポ","ァ","ィ","ゥ","ェ","ォ"],
                      ["ッ","ャ","ュ","ョ","ー","　","　","←","→","del"]]

const CreateKeybord = ()=>{
  $keybord = document.getElementById("keybord");
  element_array = [];
  for(let i = 0;i<9;i++){
    // <hr>を入れた後
    if(i >= 5){
      if(i == 5)element_array.push(document.createElement("hr"));
      element_array.push(document.createElement("div"));
      element_array[i+1].setAttribute("class","row");
      for(let z = 0;z<10;z++){
        element_array[i+1].appendChild(document.createElement("button"));
        element_array[i+1].childNodes[z].setAttribute("data-key",KEYBORD_LIST[i][z]);
        element_array[i+1].childNodes[z].innerText = KEYBORD_LIST[i][z];
        if(KEYBORD_LIST[i][z] == "　"){
          element_array[i+1].childNodes[z].setAttribute("class","space_bt");
          element_array[i+1].childNodes[z].setAttribute("disabled","True");
        }else if(["←","→","del"].includes(KEYBORD_LIST[i][z])){
          element_array[i+1].childNodes[z].setAttribute("class","func_bt");
        }else{
          element_array[i+1].childNodes[z].setAttribute("class","key_bt");
          element_array[i+1].childNodes[z].setAttribute("id","btn_"+KEYBORD_LIST[i][z]);
        }
      };
      // 入れる前
    }else{
      element_array.push(document.createElement("div"));
      element_array[i].setAttribute("class","row");
      for(let z = 0;z<10;z++){
        element_array[i].appendChild(document.createElement("button"));
        element_array[i].childNodes[z].setAttribute("data-key",KEYBORD_LIST[i][z]);
        element_array[i].childNodes[z].innerText = KEYBORD_LIST[i][z];
        if(KEYBORD_LIST[i][z] == "　"){
          element_array[i].childNodes[z].setAttribute("class","space_bt");
          element_array[i].childNodes[z].setAttribute("disabled","True");
        }else{
          element_array[i].childNodes[z].setAttribute("class","key_bt");
          element_array[i].childNodes[z].setAttribute("id","btn_"+KEYBORD_LIST[i][z]);
        }
      };
    }
  };
  element_array.forEach((element)=>{
    $keybord.appendChild(element);
  })

  wake_up_progress["createKeybord"] = true;
  Progress();
};
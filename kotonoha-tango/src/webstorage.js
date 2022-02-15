const experienceCheck = ()=>{
  // ゲームの経験者かつ30日以内にプレイしている場合
  if(localStorage.getItem("experience")){
    if((pass_day-localStorage.getItem("pass_day")) >30){
      return;
    }
    allNonVisi();
    Object.keys(img_show).forEach((key) => {
    img_show[key] = false;
    $img_btn[key].setAttribute("src",src[key]);
  });

    $div.body.classList.remove("non_visi");
  }
}

const beforeDataCheck = ()=>{
  // ゲームのプレイ歴がない場合はデータを作成し、ある場合は取得する
  if(localStorage.getItem("history_of_game") == null){
    localStorage.setItem("history_of_game", JSON.stringify(history_of_game));
    showHistory(history_of_game);
  }else{
    history_of_game = JSON.parse(localStorage.getItem("history_of_game"));
    showHistory(history_of_game);
  }

  // 言語の取得
  if(localStorage.getItem("lang") == null){
    localStorage.setItem("lang", lang_en);
  }else if(localStorage.getItem("lang")| localStorage.getItem("lang") == "true" ){
    // 英語
    lang_en = true;
    document.getElementById("hatena").innerHTML = HATENA_TEXT_EN;
    document.getElementById("Decision_button").innerText="decision";
    document.getElementById("input_text").setAttribute("placeholder","input column");
    document.getElementById("setting").innerHTML = SET_TEXT_EN;

    document.getElementById("kt_all").innerText = "All"
    document.getElementById("kt_normal").innerText = "top half"
    document.getElementById("kt_ga").innerText = "bottom half"
    document.getElementById("kt_none").innerText = "hidden"

    // グラフ画面変更
    change_graph_lang(["Not yet correct today","Copy","Tweet","Tweet with URL","STATISTICS","Play<br>times","Win%","Current<br>Streak","Max<br>Streak","GUESS DISTRIBUTION","<u>close</u>","You're correct","You're Incorrect"])
  }else{
    // 日本語
    lang_en = false;
  }

  // 色調調整
  if(localStorage.getItem("color") == null){
    localStorage.setItem("color", JSON.stringify(color));
    ChangeColor(...color);
  }else{
    color = JSON.parse(localStorage.getItem("color"));
    ChangeColor(...color);
  }


  if(localStorage.getItem("pass_day")==pass_day){
    now_solve = JSON.parse(localStorage.getItem("now_solve"));
    history_of_hb_text = JSON.parse(localStorage.getItem("history_of_hb_text"));
    history_of_hb = JSON.parse(localStorage.getItem("history_of_hb"));
    history_of_anser = JSON.parse(localStorage.getItem("history_of_anser"));
    fin = JSON.parse(localStorage.getItem("fin"));



    for(let i = 0;i < now_solve.row;i++){
      AnsDisplayUpdate(i);
    }
    ValueUpdate();
    DisplayUpdate();
    if(fin.tf){
      en_tx_array = ["You're correct","You're Incorrect"]
      jp_tx_array = ["正解です","不正解です","正解しました"]
      if(lang_en){
        if(jp_tx_array.includes(fin.text)){
          end(en_tx_array[jp_tx_array.indexOf(fin.text)]);
        }else{
          end(fin.text);
        }
      }else{
        if(en_tx_array.includes(fin.text)){
          end(jp_tx_array[en_tx_array.indexOf(fin.text)]);
        }else{
          end(fin.text);
        }
      }
    };
  }else{
    ;
  }
}
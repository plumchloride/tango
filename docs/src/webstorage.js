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
  if(localStorage.getItem("pass_day")==pass_day){
    now_solve = JSON.parse(localStorage.getItem("now_solve"));
    history_of_hb_text = JSON.parse(localStorage.getItem("history_of_hb_text"));
    history_of_hb = JSON.parse(localStorage.getItem("history_of_hb"));
    history_of_anser = JSON.parse(localStorage.getItem("history_of_anser"));
    fin = JSON.parse(localStorage.getItem("fin"));

    
    // ゲームのプレイ歴がない場合はデータを作成し、ある場合は取得する
    if(localStorage.getItem("history_of_game") == undefined){
      localStorage.setItem("history_of_game", JSON.stringify(history_of_game));
      showHistory(history_of_game);
    }else{

      history_of_game = JSON.parse(localStorage.getItem("history_of_game"));
      showHistory(history_of_game);
    }

    for(let i = 0;i < now_solve.row;i++){
      AnsDisplayUpdate(i);
    }
    ValueUpdate();
    DisplayUpdate();
    if(fin.tf){
      end(fin.text);
    };
  }else{
    console.log("the data is not today's data")
  }
}
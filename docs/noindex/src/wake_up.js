let wake_up_progress = {"getAdata":false,"getQdata":false,"getWord":false,"createKeybord":false,"createDisplay":false,"fin_create":false,"createKeybordEvent":false,"fin":false}
GetCsvData('./public/data/A_data_new.csv',"A");

const Progress = ()=>{
  // console.log(wake_up_progress)
  if(wake_up_progress["getAdata"] & !wake_up_progress["getQdata"]){
    GetCsvData('./public/data/Q_fil_ippan.csv',"Q");
  }else  if(wake_up_progress["getAdata"] & wake_up_progress["getQdata"] & !wake_up_progress["getWord"]){
    GetTodayWord();
  }else if(wake_up_progress["getAdata"] & wake_up_progress["getQdata"] & wake_up_progress["getWord"] & !wake_up_progress["createKeybord"]){
    CreateKeybord();
  }else if(wake_up_progress["getAdata"] & wake_up_progress["getQdata"] & wake_up_progress["getWord"] & wake_up_progress["createKeybord"] & !wake_up_progress["createDisplay"]){
    CreateDisplay();
  }else if(wake_up_progress["getAdata"] & wake_up_progress["getQdata"] & wake_up_progress["getWord"] & wake_up_progress["createKeybord"] & wake_up_progress["createDisplay"] & !wake_up_progress["createKeybordEvent"]){
    wake_up_progress["fin_create"] = true;
    AddKeybordEvent();
  }else if(wake_up_progress["fin_create"] & wake_up_progress["createKeybordEvent"]){
    wake_up_progress["fin"] = true;
    setInterval(DisplayTime, 1000);
    SolvHighlight();
    experienceCheck();
    beforeDataCheck();
    if(pass_day == 9|pass_day == 10){
      alertShow("報告\n出題単語辞書に関して更新を行いました。\n詳細は左上のはてなマークをクリックしてnote記事よりご覧下さい\n9回目の単語に関しては変化はありません",8000)
    }
  }
}


const DisplayTime = ()=>{
  jst = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
  if((23-parseInt(jst.getHours())) == 0 & (59-parseInt(jst.getMinutes())) == 0 & (59-parseInt(jst.getSeconds())) == 0){
    alert("日付が変わりました。単語が変わるためリロードします")
    location.reload();
  }
  time_left = ("0"+String(23-parseInt(jst.getHours()))).slice(-2) + ":" + ("0"+String(59-parseInt(jst.getMinutes()))).slice(-2) + ":" + ("0"+String(59-parseInt(jst.getSeconds()))).slice(-2);
  document.getElementById("time_left").innerHTML = "<strong>第"+String(pass_day)+"回</strong>　今日の単語 残り時間："+time_left;
}
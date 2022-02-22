let wake_up_progress = {"getAdata":false,"getQdata":false,"getWord":false,"createKeybord":false,"createDisplay":false,"fin_create":false,"createKeybordEvent":false,"expericheck":false,"beforeDataCheck":false,"fin":false}
GetCsvData('./public/data/A_data_new.csv?ver=3.1.0',"A");
let filter_array = []

const Progress = ()=>{
  // console.log(wake_up_progress)
  if(wake_up_progress["getAdata"] & !wake_up_progress["getQdata"]){
    GetCsvData('./public/data/Q_fil_ippan.csv?ver=3.0.0',"Q");
    filter_array = Array.from(new Set([...A_data]));
  }else  if(wake_up_progress["getAdata"] & wake_up_progress["getQdata"] & !wake_up_progress["getWord"]){
    GetTodayWord();
  }else if(wake_up_progress["getAdata"] & wake_up_progress["getQdata"] & wake_up_progress["getWord"] & !wake_up_progress["createKeybord"]){
    CreateKeybord();
  }else if(wake_up_progress["getAdata"] & wake_up_progress["getQdata"] & wake_up_progress["getWord"] & wake_up_progress["createKeybord"] & !wake_up_progress["createDisplay"]){
    CreateDisplay();
  }else if(wake_up_progress["getAdata"] & wake_up_progress["getQdata"] & wake_up_progress["getWord"] & wake_up_progress["createKeybord"] & wake_up_progress["createDisplay"] & !wake_up_progress["createKeybordEvent"]){
    wake_up_progress["fin_create"] = true;
    AddKeybordEvent();
  }else if(wake_up_progress["fin_create"] & wake_up_progress["createKeybordEvent"] & !wake_up_progress["expericheck"]){
    setInterval(DisplayTime, 1000);
    SolvHighlight();
    experienceCheck();
  }else if(wake_up_progress["fin_create"] & wake_up_progress["createKeybordEvent"] & wake_up_progress["expericheck"]& !wake_up_progress["beforeDataCheck"]){
    beforeDataCheck();
  }else if(wake_up_progress["fin_create"] & wake_up_progress["createKeybordEvent"] & wake_up_progress["expericheck"] & wake_up_progress["beforeDataCheck"] & !wake_up_progress["fin"]){
    wake_up_progress["fin"] = true;
    CheckRemaining_all();
    getYesterdayTango();
  }else{
    console.log("想定外")
  }
}


const DisplayTime = ()=>{
  nowtime = new Date();
  if((23-parseInt(nowtime.getHours())) == 0 & (59-parseInt(nowtime.getMinutes())) == 0 & (59-parseInt(nowtime.getSeconds())) == 0){
    alert("日付が変わりました。単語が変わるためリロードします\nThe date has changed. Reload for word change.")
    location.reload();
  }
  time_left = ("0"+String(23-parseInt(nowtime.getHours()))).slice(-2) + ":" + ("0"+String(59-parseInt(nowtime.getMinutes()))).slice(-2) + ":" + ("0"+String(59-parseInt(nowtime.getSeconds()))).slice(-2);
  if(lang_en){
    document.getElementById("time_left").innerHTML = "<strong>No."+String(pass_day)+"</strong>　Next Tango："+time_left;
  }else{
    document.getElementById("time_left").innerHTML = "<strong>第"+String(pass_day)+"回</strong>　今日の単語 残り："+time_left;
  }
}
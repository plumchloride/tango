let wake_up_progress = {"getAdata":false,"getQdata":false,"getWord":false,"fin":false}
GetCsvData('./data/A_data.csv',"A");
GetCsvData('./data/Q_data.csv',"Q");

const Progress = ()=>{
  console.log(wake_up_progress)
  if(wake_up_progress["getAdata"] & wake_up_progress["getQdata"] & !wake_up_progress["getWord"]){
    GetTodayWord();
  }else if(wake_up_progress["getAdata"] & wake_up_progress["getQdata"] & wake_up_progress["getWord"]){
    wake_up_progress["fin"] = true;
    setInterval(DisplayTime, 1000);
  }
}


const DisplayTime = ()=>{
  jst = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
  time_left = ("0"+String(23-parseInt(jst.getHours()))).slice(-2) + ":" + ("0"+String(59-parseInt(jst.getMinutes()))).slice(-2) + ":" + ("0"+String(59-parseInt(jst.getSeconds()))).slice(-2);
  document.getElementById("time_left").innerHTML = "残り時間："+time_left;
}
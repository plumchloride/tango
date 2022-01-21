let wake_up_progress = {"getAdata":false,"getQdata":false}
GetCsvData('./data/A_data.csv',"A");
GetCsvData('./data/Q_data.csv',"Q");

const Progress = ()=>{
  console.log(wake_up_progress)
}

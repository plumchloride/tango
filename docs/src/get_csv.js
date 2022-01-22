let A_data = undefined;
let Q_data = undefined;

// HTTPリクエストを利用してcsvを取得
const GetCsvData = (dataPath,mode)=>{
  const request = new XMLHttpRequest();
  request.addEventListener('load', (event) => {
    const response = event.target.responseText;
    LoadData(mode,response)
  });
  request.open('GET', dataPath, true);
  request.send();
};

// 取得したデータを関数に保存
const LoadData = (mode,data)=>{
  if(mode == "A"){
    A_data = StringToArray(mode,data);
    wake_up_progress.getAdata = true;
    Progress();
  }else if(mode == "Q"){
    Q_data = StringToArray(mode,data);
    wake_up_progress.getQdata = true;
    Progress();
  }else{
    alert("ERROR Unexpected data is being acquired")
  }
}

// テキストを配列に変換
const StringToArray = (mode,data)=>{
  if(mode == "A"){
    _array_sp_n = [];
    _array_sp_n = data.split("\r\n");
    return _array_sp_n
  }else if(mode == "Q"){
    _array = {"title":[],"pronunciation":[]};
    _array_sp_n = [];
    _array_sp_n = data.split("\r\n");
    _array_sp_n.forEach(element => {
      _row = element.split(",")
      _array["title"].push(_row[0])
      _array["pronunciation"].push(_row[1])
    });
    return _array
  }else{
    alert("ERROR Unexpected data is being acquired")
  }
}

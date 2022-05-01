const a_csv_path = './public/data/A_data_new.csv';
const h_csv_path = './public/data/history.csv';
const t_csv_path = './public/data/tango_history.csv';
test = "https://plum-chloride.jp/kotonoha-tango/public/data/history.csv"
let csv_data = {"a_data":[],"h_data":{},"t_data":{}};
let history ={"anser":[],"hb":[]};
filter_array = [];
let pass_day = 0;
let data_day = 0;
let tango = ""
let sum = (accumulator, curr) => Number(accumulator) + Number(curr);
const even_q = ["m","t","A","-j","i","Q","q","1","2","g","L","-l","-q","z","-e","P","-f","V","-g","-h","W","C","e","-i","N","D","O","k","E","F",
          "a","s","B","u","0","R","l","h","r","I","-b","c","-k","J","H","K",
          "Z","y","b","Y","j","v","5","4","n","3","-a","-c","-d","-m","-n","G","U","0","8","T","9","S","d","-o","p","-p","M","w","6","f","X","x","7","o","-r"];
const odd_q = ["w","-a","g","r","Q","h","1","A","H","-f","-d","a","U","P","I","-o","V","-p","6","W","i","D","X","4","5","l","o","E","p","q",
        "R","B","s","K","t","T","3","0","F","j","O","k","v","G","Y","e",
        "S","x","C","u","f","-m","2","Z","-e","b","9","J","-l","8","-n","-c","-k","7","-b","-j","c","-i","n","-h","m","N","-q","L","-g","0","-n","d","M","y","z"];
const katakana = ["ア","イ","ウ","エ","オ","カ","キ","ク","ケ","コ","サ","シ","ス","セ","ソ","タ","チ","ツ","テ","ト","ナ","ニ","ヌ","ネ","ノ","ハ","ヒ","フ","ヘ","ホ",
        "マ","ミ","ム","メ","モ","ヤ","ユ","ヨ","ラ","リ","ル","レ","ロ","ワ","ヲ","ン",
        "ガ","ギ","グ","ゲ","ゴ","ザ","ジ","ズ","ゼ","ゾ","ダ","ヂ","ヅ","デ","ド","バ","ビ","ブ","ベ","ボ","パ","ピ","プ","ペ","ポ","ァ","ィ","ゥ","ェ","ォ","ッ","ャ","ュ","ョ","ー"];
const hiragana = ["あ","い","う","え","お","か","き","く","け","こ","さ","し","す","せ","そ","た","ち","つ","て","と","な","に","ぬ","ね","の","は","ひ","ふ","へ","ほ",
        "ま","み","む","め","も","や","ゆ","よ","ら","り","る","れ","ろ","わ","を","ん",
        "が","ぎ","ぐ","げ","ご","ざ","じ","ず","ぜ","ぞ","だ","ぢ","づ","で","ど","ば","び","ぶ","べ","ぼ","ぱ","ぴ","ぷ","ぺ","ぽ","ぁ","ぃ","ぅ","ぇ","ぉ","っ","ゃ","ゅ","ょ","ー"];


// === csv読み込み ===
const WakeUpRequest = (path,mode)=>{
  var _request = new XMLHttpRequest();
  _request.addEventListener('load', (event) => {
    const response = event.target.responseText;
    LoadData(mode,response);
    if(mode == "H"){
      let date = new Date(event.target.getResponseHeader('Last-Modified'));
      document.getElementById("get_time").innerText = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);
    }
  });
  _request.open('GET', path, true);
  _request.send();
}
const QError = (text)=>{
  document.getElementById("Error_title").innerText = text;
}
const LoadData = (mode,data)=>{
  switch(mode){
    case "A":
      var _array_sp_n = [];
      _array_sp_n = data.split(/\r\n|\n/);
      SaveArray(_array_sp_n,mode);
      break;
    case "H":
      var _dic = {};
      var _array_sp_n = [];
      _array_sp_n = data.split(/\r\n|\n/);
      _array_sp_n.forEach(element => {
        var _row = element.split(",");
        if(_row[0] != '' & _row != ''){
          _dic[_row[0]] = _row.slice(1);
        }
      });
      SaveArray(_dic,mode);
      break;
      case "T":
        var _dic = {};
        var _array_sp_n = [];
        _array_sp_n = data.split(/\r\n|\n/);
        _array_sp_n.forEach(element => {
          var _row = element.split(",");
          if(_row[0] != '' & _row != ''){
            _dic[_row[0]] = _row.slice(1);
          }
        });
        SaveArray(_dic,mode);
      break;
  }
}
const SaveArray = (data,mode)=>{
  switch(mode){
    case "A":
      csv_data.a_data = Array.from(new Set(data));
      filter_array = Array.from(new Set(csv_data.a_data));
      WakeUpRequest(test+`?ver=${nowtime.getFullYear()}${nowtime.getMonth()+1}${nowtime.getDate()}${nowtime.getMinutes()}`,"H");
      break;
    case "H":
      csv_data.h_data = data;
      // 最初の画面起動時に表示
      wakeup();
      break;
    case "T":
      csv_data.t_data = data;
      break;
  }
}

// wakeup
(()=>{
  nowtime = new Date();
  // クエリ取得
  var queryStr = window.location.search.slice(1);
  var qh =[]
  var qt = []
  if (!queryStr) {
    QError("Error1 情報が存在しません\nこちらのURLは利用出来ません。");
    return;
  }
  queryStr.split('&').forEach(function(queryStr) {
    var queryArr = queryStr.split('=');
    switch(queryArr[0]){
      case "d":
        data_day = Number(queryArr[1]);
        break;
      case "h":
        qh = queryArr[1].slice(0,queryArr[1].length-1);
        break;
      case "t":
        qt = queryArr[1];
        break;
      case "a":
        tango = queryArr[1];
        break;

    }
  });
  history.hb = [];
  qh.split("_").forEach((i)=>{
    var _hmem = []
    var _count = 0
    Array.from(i).forEach((z)=>{
      _count++;
      switch(z){
        case "n":
          _hmem.push("NO")
          break;
        case "h":
          _hmem.push("HIT")
          break;
        case "h":
          _hmem.push("BLOW")
          break;
      }
    })
    if(_count!=5){
      QError("Error2 情報が破損しています\nこちらのURLは利用出来ません。");
      return;
    }
    history.hb.push(_hmem)
  })
  var _ha = ""
  var _next = ""
  var _co = 0
  if(data_day % 2 == 0){
    q = even_q
  }else{
    q = odd_q
  }
  Array.from(qt).forEach((i)=>{
    if(i!="-"){
      _co ++;
      _ha += katakana[q.indexOf(_next+i)]
      _next = ""
    }else{
      _next = "-"
    }
    if(_co == 5){
      _co = 0
      _ha += ","
    }
  })
  var _tha = ""
  var _tnext = ""
  Array.from(tango).forEach((i)=>{
    if(i!="-"){
      _tha += katakana[q.indexOf(_tnext+i)]
      _tnext = ""
    }else{
      _tnext = "-"
    }
  })
  tango = _tha
  if(_co!=0){
    QError("Error3 情報が破損しています\nこちらのURLは利用出来ません。");
    return;
  }
  _ha = _ha.slice(0,_ha.length-1)
  history.anser = _ha.split(",")
  if(history.anser.length !=history.hb.length){
    QError("Error4 情報が破損しています\nこちらのURLは利用出来ません。");
    return;
  }
  WakeUpRequest(t_csv_path+`?ver=${nowtime.getFullYear()}${nowtime.getMonth()+1}${nowtime.getDate()}`,"T");
  WakeUpRequest(a_csv_path+`?ver=${nowtime.getFullYear()}${nowtime.getMonth()+1}${nowtime.getDate()}`,"A");
})();
// === csv読み込み ここまで ===

const wakeup = ()=>{
  let fday = luxon.DateTime.fromSQL('2022-01-21');
  let fday_diff = fday.diffNow('days');
  let timestamp = fday_diff.days;
  let pass_day =  Math.floor(timestamp*-1);
  document.getElementById("pass_day").innerText = `第${data_day}回`
  if(data_day < pass_day){
    document.getElementById("yet").classList.remove("non_visi");
    document.getElementById("not_yet").classList.add("non_visi");
    today_wakeup(data_day);
  }else if(JSON.parse(localStorage.getItem("flag")) == null){
    document.getElementById("not_yet").classList.remove("non_visi");
    document.getElementById("yet").classList.add("non_visi");
    document.getElementById("can_show").classList.remove("non_visi");
    QError("こちらは結果共有画面です\n「ことのはたんご」は下記リンクからプレイしてください。");
  }else if(pass_day == data_day & pass_day == JSON.parse(localStorage.getItem("pass_day")) & JSON.parse(localStorage.getItem("flag")).game_end){
    document.getElementById("yet").classList.remove("non_visi");
    document.getElementById("not_yet").classList.add("non_visi");
    today_wakeup(data_day);
  }else if(data_day > pass_day){
    document.getElementById("not_yet").classList.remove("non_visi");
    document.getElementById("yet").classList.add("non_visi");
    QError("未来の「ことのはたんご」です\nこちらのURLは現在では利用出来ません");
  }else{
    document.getElementById("not_yet").classList.remove("non_visi");
    document.getElementById("yet").classList.add("non_visi");
    document.getElementById("can_show").classList.remove("non_visi");
  }
}

const today_wakeup = (day)=>{
  var kan = ""
  if(day in csv_data.t_data){
    kan = csv_data.t_data[day][0]
    if(csv_data.t_data[day][1]!=tango){
      kan = "Error：規定のたんごと異なる単語です。"
    }
  }else{
    kan = "現在更新中です"
  }
  document.getElementById("tango").innerText = `「${kan}」（${tango}）`

  if(day in csv_data.h_data){
    // 集計表示
    document.getElementById("play_num").innerText = csv_data.h_data[day].reduce(sum).toLocaleString();
    document.getElementById("okper").innerText = Math.floor((1 - Number(csv_data.h_data[day][10])/csv_data.h_data[day].reduce(sum))*10000)/100

    Chart.defaults.plugins.legend.display = false;

    labels = ["1","2","3","4","5","6","7","8","9","10","X"];
    var color = Array(5);
    var col2 = Array(5);
    color.fill('#557443');
    col2.fill("#AE8B31");
    color.push(...col2);
    color.push("#B4534B");
    data = {
      labels: labels,
      datasets: [{
        backgroundColor: color,
        borderColor: 'rgb(128,197,222)',
        data: csv_data.h_data[day],
        borderWidth: 0

      }]
    }
    config = {
      showTooltips: false,
      type: 'bar',
      data: data,
      options: {
        responsive: false,
        scales: {
        y: {
            beginAtZero: true
          },
        },
      }
    };
    myChart = new Chart(
      document.getElementById('myChart'),
      config
    );
  }else{
    console.log("here",pass_day)
  }
  document.getElementById("sikou_num").innerText = `試行回数：${history.anser.length}回`
  // 回答表示・残り候補数表示
  var adl = document.getElementById("ad_l");
  var adr = document.getElementById("ad_r");
  var nokori_div = document.getElementById("nokori_div");

  for (let step = 0; step < history.anser.length; step++) {
    var _anser = Array.from(history.anser[step]);
    var row = document.createElement("div");
    row.setAttribute("class",(step < 5)?"rect":"circle");

    // 残り候補数
    var nokoris = CheckRemaining_all(history.hb[step],history.anser[step]);
    var _head = document.createElement("h4");
    _head.innerText = `${history.anser[step]}・残り候補数：${nokoris[0]}個`
    nokori_div.appendChild(_head)
    var _text = document.createElement("p");
    if(nokoris[0] > 20){
      _text.innerText = nokoris[1].slice(0,20)+"　など"
    }else{
      _text.innerText = nokoris[1].slice(0,20)
    }
    nokori_div.appendChild(_text);


    for(let index = 0;index < 5;index++){
      var div = document.createElement("div");
      div.innerText = _anser[index];
      div.setAttribute("class","dis_text " +history.hb[step][index])
      row.appendChild(div)
    }
    if(step<5){
      adl.appendChild(row)
    }else{
      adr.appendChild(row)
    }
  }
};

const CheckRemaining_all = (history_of_hb,history_of_anser) =>{
  //history_of_hb_text 作製
  var history_of_hb_text = {"hit":[],"blow":[],"all":[]}
  history_of_hb.forEach((e,index)=>{
    if(e == "BLOW"){
      history_of_hb_text.blow.push(history_of_anser[index]);
    }else if(e == "HIT"){
      history_of_hb_text.hit.push(history_of_anser[index]);
    }else{
      if(!history_of_hb_text["all"].includes(history_of_anser[index])){
        history_of_hb_text.all.push(history_of_anser[index]);
      }
    }
  });
  // blow hit 重複削除
  history_of_hb_text["hit"].forEach((element) => {
    if(history_of_hb_text["blow"].length != 0 & history_of_hb_text["blow"].includes(element)){
      history_of_hb_text["blow"].splice(history_of_hb_text["blow"].indexOf(element),1);
    };
    if(history_of_hb_text["all"].length != 0 & history_of_hb_text["all"].includes(element)){
      history_of_hb_text["all"].splice(history_of_hb_text["all"].indexOf(element),1);
    };
  });
  history_of_hb_text["blow"].forEach((element) => {
    if(history_of_hb_text["all"].length != 0 & history_of_hb_text["all"].includes(element)){
      history_of_hb_text["all"].splice(history_of_hb_text["all"].indexOf(element),1);
    };
  });

  // none 含んでいない
  history_of_hb_text["all"].forEach((e)=>{
    filter_array = filter_array.filter((word)=>!word.includes(e));
  })
  // blow 含んでいる事
  history_of_hb_text["blow"].forEach((e) =>{
    filter_array = filter_array.filter((word)=>word.includes(e));
  })
  // hit 含んでいること
  history_of_hb_text["hit"].forEach((e) =>{
    filter_array = filter_array.filter((word)=>word.includes(e));
  })

  // hbリストを参照
  hit_blow_list = []
  history_of_hb.forEach((e,index2)=>{
    // 各文字の評価(HIT BLOW)
    if(e == "BLOW"){
      filter_array = filter_array.filter((word)=>history_of_anser[index2] != word[index2]);
      if(hit_blow_list.includes(history_of_anser[index2])){
        // HIT or BLOWが同じ試行で同じたんごに対して、2個出た場合
        filter_array = filter_array.filter((word) => word.indexOf(history_of_anser[index2]) != word.lastIndexOf(history_of_anser[index2]));
      }
      hit_blow_list.push(history_of_anser[index2]);
    }else if(e == "NO" & history_of_hb_text["blow"].includes(history_of_anser[index2])){
      // 二重処理の場合,NOの箇所に含んでいない
      filter_array = filter_array.filter((word)=>history_of_anser[index2] != word[index2]);
    }else if(e == "HIT"){
      filter_array = filter_array.filter((word)=>history_of_anser[index2] == word[index2]);
      if(hit_blow_list.includes(history_of_anser[index2])){
        // HIT or BLOWが同じ試行で同じたんごに対して、2個出た場合
        filter_array = filter_array.filter((word) => word.indexOf(history_of_anser[index2]) != word.lastIndexOf(history_of_anser[index2]));
      }
      hit_blow_list.push(history_of_anser[index2]);
    }else if(e == "NO" & history_of_hb_text["hit"].includes(history_of_anser[index2])){
      // 二重処理の場合,NOの箇所に含んでいない
      filter_array = filter_array.filter((word)=>history_of_anser[index2] != word[index2]);
    }
  })
  return [filter_array.length,filter_array]
}
window.addEventListener('storage', function(e) {
  if(e.key == "flag"){
    setTimeout(()=>{location.reload();},1000);
    return;
  }
});

document.getElementById("tango_input").addEventListener("submit",(e)=>{
  // 異なる文字が入力されていないかチェック。
  var in_t = document.getElementById("input_text").value
  var flag_error = false
  var in_ans = ""
  Array.from(in_t).forEach((element)=>{
    if(katakana.includes(element)){
      in_ans+=element;
    }else if(hiragana.includes(element)){
      in_ans+=katakana[hiragana.indexOf(element)];
    }else{
      flag_error = true
    }
  });
  console.log(in_ans)
  if(flag_error){
    alert("注意\n入力した「たんご」はひらがな・カタカナの5文字のみです");
    return
  }
  if(in_ans == tango){
    document.getElementById("yet").classList.remove("non_visi");
    document.getElementById("not_yet").classList.add("non_visi");
    today_wakeup(data_day);
  }else{
    alert("注意\n入力した「たんご」が異なります。");
    return
  }

});
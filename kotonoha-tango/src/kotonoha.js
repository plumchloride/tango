

const current_version = "6.0.4";

const hiragana = ["あ","い","う","え","お","か","き","く","け","こ","さ","し","す","せ","そ","た","ち","つ","て","と","な","に","ぬ","ね","の","は","ひ","ふ","へ","ほ",
                "ま","み","む","め","も","や","ゆ","よ","ら","り","る","れ","ろ","わ","を","ん",
                "が","ぎ","ぐ","げ","ご","ざ","じ","ず","ぜ","ぞ","だ","ぢ","づ","で","ど","ば","び","ぶ","べ","ぼ","ぱ","ぴ","ぷ","ぺ","ぽ","ぁ","ぃ","ぅ","ぇ","ぉ","っ","ゃ","ゅ","ょ","ー"];
const katakana = ["ア","イ","ウ","エ","オ","カ","キ","ク","ケ","コ","サ","シ","ス","セ","ソ","タ","チ","ツ","テ","ト","ナ","ニ","ヌ","ネ","ノ","ハ","ヒ","フ","ヘ","ホ",
                "マ","ミ","ム","メ","モ","ヤ","ユ","ヨ","ラ","リ","ル","レ","ロ","ワ","ヲ","ン",
                "ガ","ギ","グ","ゲ","ゴ","ザ","ジ","ズ","ゼ","ゾ","ダ","ヂ","ヅ","デ","ド","バ","ビ","ブ","ベ","ボ","パ","ピ","プ","ペ","ポ","ァ","ィ","ゥ","ェ","ォ","ッ","ャ","ュ","ョ","ー"];

let filter_array = []
let game_data = {"now_solve":{"index":0,"row":0},"anser":["　","　","　","　","　"]};
let tango = {"kanzi":"=====","yomi":"====="};
let daily_data = {"pass_day":0,"uuid":undefined};
let flag = {"wakeup":false,"game_end":false,"game_win":false,"remain_show":true,"lang_en":false};
let icon_src = {"hatena":"./public/img/hatena.svg","bar":"./public/img/bar_graph.svg","set":"./public/img/set.svg","batu":"./public/img/x.svg"};
let display_mode = "";
let HTML_element = {"remain_toggle":document.getElementById("remain_toggle_input"),"emoji_place":document.getElementById("emoji_place"),
                    "input_text":document.getElementById("input_text"),"remain":document.getElementById("remain_num"),"remain_toggle_text":document.getElementById("remain_unvisi"),
                    "display_mode":{"body":document.getElementById("body"),"hatena":document.getElementById("hatena"),"bar":document.getElementById("graph"),"set":document.getElementById("setting")},
                    "icon_btn":{"hatena":document.getElementById("img_hatena"),"bar":document.getElementById("img_bar_graph"),"set":document.getElementById("img_setting")}};
let myChart = "A"; // チャート初期化用
let curent_key_type = "all";
let current_color = ["rgb(167,210,141)","rgb(252, 201, 72)"];
let none_re_array = []; // remain動作軽量用
let reload = false;
let KeybordButton_Mode = "input"
let Assumption_word = {"hit":[],"none":[]};
let max_use = {};

// =================
// Initalization
// =================
const q_csv_path = './public/data/Q_fil_ippan.csv?ver='+current_version;
const a_csv_path = './public/data/A_data_new.csv?ver='+current_version;
const h_csv_path = 'https://plum-chloride.jp/kotonoha-tango/public/data/history.csv?ver=';
let wakeup_array = [false,false,false,false,false,false,false,false]
// a,q,h,createkeybord,createDisplay,version_check
const Initialization = () =>{
  // 経過日の取得
  let fday = luxon.DateTime.fromSQL('2022-01-21');
  let fday_diff = fday.diffNow('days');
  let timestamp = fday_diff.days;
  let pass_day =  Math.floor(timestamp*-1);
  daily_data.pass_day = pass_day;
  console.log(`第${daily_data.pass_day}回`);

  Getcsv(a_csv_path,"A");
  Getcsv(q_csv_path,"Q");
  let nowtime = new Date();
  Getcsv(h_csv_path+String(nowtime.getHours())+String(nowtime.getMinutes()),"H");
  CreateKeybord();
  CreateDisplay();
  GetLocalStorage();
  document.getElementById("ver").innerText = current_version;

  setInterval(DisplayTime, 1000);
}
const FinWakeupProcess = ()=>{
  var sum = (accumulator, curr) => Number(accumulator) + Number(curr);

  if(wakeup_array.reduce(sum) == wakeup_array.length){

    // 第339回エラー用
    if(daily_data.pass_day == 339 || daily_data.pass_day == 340){
      if(localStorage.getItem("pass_day")){
        if(localStorage.getItem("pass_day")<339){
          localStorage.setItem("end339",true);
        }else{
          if(!localStorage.getItem("end339")){
            var cf = confirm("第339回（12/26）における、正答の単語を入力出来ない不具合でご迷惑をおかけして申し訳ございません。\n朝5時において不具合修正が完了しています。そのため12/26 0時-5時にプレイしたユーザが対象となります。\n該当の不具合により連勝数が途切れた等の問題が発生した場合は「OK・はい」を選択する事で履歴をロールバックできます。\n修正の必要が無い、もしくは不具合の影響を受けていないユーザは「No・キャンセル」を選択してください。")
            if(cf){
              window.location = "https://plum-chloride.jp/kotonoha-tango/emergency339.html";
              alert("「OK・はい」ボタンを押すとページが移動します。\nページが移動しない場合は第339回緊急修正用と記載されているリンクより移動してください")
              document.getElementById("e339").innerHTML = "<a href='https://plum-chloride.jp/kotonoha-tango/emergency339.html'>第339回緊急修正用</a>"
              return;
            }else{
              if(daily_data.pass_day == 339){
                var cf = confirm("再度選択肢を表示しますか？\n「OK・はい」or「No・キャンセル」")
                if(!cf){localStorage.setItem("end339",true);}
              }else{
                localStorage.setItem("end339",true)
              }
            }
          }
        }
      }
    }
    // 第339回エラー用


    if(daily_data.uuid == undefined){
      daily_data.uuid = "some_id"
    }
    var version_url = "https://3vpuj2s6o5bscauba24p3ryegy0cpeud.lambda-url.ap-northeast-1.on.aws/"
    p_t = {"uuid":daily_data.uuid,"day":daily_data.pass_day,"hist":history.game,"localstorage":enable_localstorage,"version":current_version,"now_time":GetNowTime()}
    p_j = JSON.stringify(p_t);
    xhr = new XMLHttpRequest;
    xhr.onload = function(){
      var res = xhr.responseText;
      var respons = JSON.parse(res);
      // console.log(respons)
      if(respons.version != current_version){
        alert("アップデートがあります。リロードでアップデートして下さい。\nThis app has an update. Do a reload.")
        return;
      }
      if(respons.re_text != ""){
        alertShow(respons.re_text,2000);
      }
      daily_data.uuid = respons.uuid
      if(enable_localstorage){
        localStorage.setItem("uuid",respons.uuid)
      }
      SetUi();
    };
    xhr.onerror = function(){
      alertShow("バージョンの確認が出来ません。現在プレイ出来ません。\n Unable to confirm version. Unable to play now.",2000);
    }
    xhr.open('POST', version_url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(p_j);
  }

  // 単語呼び出し
  if(wakeup_array[1] & !wakeup_array[6] & !wakeup_array[7]){
    wakeup_array[6] = true;
    wakeup_array[7] = true;
    GetYesterdayTango();
    GetTodayWord();
  }
};
const GetNowTime = ()=>{
  var now = new Date();
  var Year = now.getFullYear();
  var Month = now.getMonth()+1;
  var _Date = now.getDate();
  var Hour = now.getHours();
  var Min = now.getMinutes();
  var Sec = now.getSeconds();
  var now_time = Year + "-" + Month + "-" + _Date + " " + Hour + ":" + ("00"+Min).slice(-2) + ":" + ("00"+Sec).slice(-2);
  return now_time
}


// =================
// csv読み込み
// =================
let csv_data = {"q_data":{},"a_data":[]};
const Getcsv = (path,mode)=>{
  var _request = new XMLHttpRequest();
  _request.addEventListener('load', (event) => {
    const response = event.target.responseText;
    LoadData(mode,response);
  });
  _request.open('GET', path, true);
  _request.send();
}
const LoadData = (mode,data)=>{
  switch(mode){
    case "A":
      var _array_sp_n = [];
      _array_sp_n = data.split(/\r\n|\n/);
      SaveArray(_array_sp_n,mode);
      break;
    case "Q":
      var _array = {"title":[],"pronunciation":[]};
      var _array_sp_n = [];
      _array_sp_n = data.split(/\r\n|\n/);
      _array_sp_n.forEach(element => {
        var _row = element.split(",")
        _array["title"].push(_row[0])
        _array["pronunciation"].push(_row[1])
      });
      SaveArray(_array,mode);
      break;
    case "H":
      var $h_out = document.getElementById("h_csv");
      var sum = (accumulator, curr) => Number(accumulator) + Number(curr);
      _array_sp_n = data.split(/\r\n|\n/);
      _array_sp_n.forEach(element => {
        var _row = element.split(",");
        if(_row[0] != '' & _row != ''){
          if(_row[0] == String(daily_data.pass_day)){
            $h_out.innerText = `全ユーザーの正答率：${Math.floor((1 - Number(_row[11])/_row.slice(1,12).reduce(sum))*10000)/100}%`
          }
        }
      });
      wakeup_array[2] = true;
      FinWakeupProcess();
      break;
    default:
      alert("ERROR1:\n csvmode is invalid");
      location.reload();
  }
}
const SaveArray = (data,mode,env)=>{
  switch(mode){
    case "A":
      csv_data.a_data = data;
      if(csv_data.a_data != {} && csv_data.q_data != {}){
        let add_tango = (Array.from(new Set(csv_data.a_data.concat(csv_data.q_data.pronunciation)))).filter(word=>word != undefined);
        csv_data.a_data = add_tango;
      }
      filter_array = Array.from(new Set([...csv_data.a_data]));
      csv_data.a_data = Array.from(new Set([...csv_data.a_data]));
      wakeup_array[0] = true;
      FinWakeupProcess();
      break;
    case "Q":
      csv_data.q_data = data;
      if(csv_data.a_data != {} && csv_data.q_data != {}){
        let add_tango = (Array.from(new Set(csv_data.a_data.concat(csv_data.q_data.pronunciation)))).filter(word=>word != undefined);
        csv_data.a_data = add_tango;
        filter_array = Array.from(new Set([...csv_data.a_data]));
        csv_data.a_data = Array.from(new Set([...csv_data.a_data]));
      }
      wakeup_array[1] = true;
      FinWakeupProcess();
      break;
    default:
      alert("ERROR1:\n csvmode is invalid");
      location.reload();
  }
}

// =================
// UI作製
// =================
const KEYBORD_LIST = [["ワ","ラ","ヤ","マ","ハ","ナ","タ","サ","カ","ア"],
                      ["ヲ","リ","　","ミ","ヒ","ニ","チ","シ","キ","イ"],
                      ["ン","ル","ユ","ム","フ","ヌ","ツ","ス","ク","ウ"],
                      ["　","レ","　","メ","ヘ","ネ","テ","セ","ケ","エ"],
                      ["　","ロ","ヨ","モ","ホ","ノ","ト","ソ","コ","オ"],
                      ["ー","　","ャ","パ","バ","　","ダ","ザ","ガ","ァ"],
                      ["　","　","　","ピ","ビ","　","ヂ","ジ","ギ","ィ"],
                      ["　","　","ュ","プ","ブ","ッ","ヅ","ズ","グ","ゥ"],
                      ["del","　","　","ペ","ベ","　","デ","ゼ","ゲ","ェ"],
                      ["←","→","ョ","ポ","ボ","　","ド","ゾ","ゴ","ォ"]];
const CreateKeybord = ()=>{
  let $keybord = document.getElementById("keybord");
  let element_array = [];
  [0,1,2,3,4,"_",5,6,7,8,9].forEach((e,index)=>{
    if(e == "_"){
      element_array.push(document.createElement("hr"));
      element_array[5].setAttribute("id","keybord_hr");
    }else{
      element_array.push(document.createElement("div"));
      if(e < 5)element_array[index].setAttribute("class","row bt_normal");
      if(e >= 5)element_array[index].setAttribute("class","row bt_ga");
      for(let z = 0;z<10;z++){
        element_array[index].appendChild(document.createElement("button"));
        element_array[index].childNodes[z].innerText = KEYBORD_LIST[e][z];
        if(KEYBORD_LIST[e][z] == "　"){
          element_array[index].childNodes[z].setAttribute("class","space_bt");
          element_array[index].childNodes[z].setAttribute("disabled","True");
        }else if(["←","→","del"].includes(KEYBORD_LIST[e][z])){
          element_array[index].childNodes[z].setAttribute("class","func_bt");
          element_array[index].childNodes[z].setAttribute("onclick","FuncButton('"+KEYBORD_LIST[e][z]+"');")
        }else{
          element_array[index].childNodes[z].setAttribute("class","key_bt");
          element_array[index].childNodes[z].setAttribute("id","btn_"+KEYBORD_LIST[e][z]);
          element_array[index].childNodes[z].setAttribute("onclick","KeybordButton('"+KEYBORD_LIST[e][z]+"');");
        }
      }
    }
  })
  element_array.forEach((element)=>{
    $keybord.appendChild(element);
  })
  wakeup_array[3] = true;
  FinWakeupProcess();
};
const CreateDisplay = ()=>{
  var $display = document.getElementById("eval_display");
  var element_array = [];
  for(let i = 0;i<5;i++){
    element_array.push(document.createElement("div"));
    element_array[i].setAttribute("class","row");
    element_array[i].setAttribute("id","dis-row-"+String(i));
    for(let z = 0;z<10;z++){
      if(z == 5){
        element_array[i].appendChild(document.createElement("div"));
        element_array[i].childNodes[z].setAttribute("class","dis-pa");
      }
      if(z<5){
        element_array[i].appendChild(document.createElement("div"));
        element_array[i].childNodes[z].setAttribute("class","display_num left_display display_chara");
        element_array[i].childNodes[z].setAttribute("id","dis-"+String(i)+"-"+String(z));
      }else{
        lef_el = document.createElement("div");
        lef_el.setAttribute("class","display_num right_display display_chara");
        lef_el.setAttribute("id","dis-"+String(i+5)+"-"+String(z-5));
        element_array[i].appendChild(lef_el);
      }
    }
  }
  element_array.forEach((element)=>{
    $display.appendChild(element);
  })
  wakeup_array[4] = true;
  FinWakeupProcess();
}
// =================
// localstorage読み込み
// =================
let enable_localstorage = false;
let history ={"anser":[],"hb":[],"hb_text":{"hit":[],"blow":[],"all":[]},"remain":[],"game":{"try_count":0,"win_count":0,"current_streak":0,"max_streak":0,"history":[0,0,0,0,0,0,0,0,0,0]}};
let change_wind = false
const GetLocalStorage  = ()=>{
  var test_local = "test_local"
  try {
    localStorage.setItem(test_local, test_local);
    localStorage.removeItem(test_local);
    enable_localstorage = true;
  } catch (e) {
    alert("このブラウザではlocalstorageが対応していません。プレイは可能ですが、プレイ履歴を保存する事が出来ません。\nThis browser does not support localstorage. It is possible to play, but it is not possible to save the play history.");
  }

  // ローカルストレージON
  if(enable_localstorage){
    try {
      // ゲーム経験している場合
      if(localStorage.getItem("experience")){
        if((daily_data.pass_day-localStorage.getItem("pass_day")) <60){
          change_wind = true
        };
        // history_of_game(ゲーム履歴)
        if(localStorage.getItem("history_of_game") != null){
          history.game = JSON.parse(localStorage.getItem("history_of_game"));
        }

        // 色調調整
        if(localStorage.getItem("color") == null){
          localStorage.setItem("color", JSON.stringify(current_color));
          ChangeColor(...current_color);
        }else{
          current_color = JSON.parse(localStorage.getItem("color"));
          ChangeColor(...current_color);
        }
        // ゲーム設定
        // langage
        if(localStorage.getItem("lang") == null){
          localStorage.setItem("lang", flag.lang_en);
        }else if(localStorage.getItem("lang")| localStorage.getItem("lang") == "true" ){
          changeLang();// 英語
        }else{
          ;// 日本語
        }
        // 今日のデータがある場合
        if(localStorage.getItem("pass_day")==daily_data.pass_day){
          game_data.now_solve = JSON.parse(localStorage.getItem("now_solve"));
          history.hb_text = JSON.parse(localStorage.getItem("history_of_hb_text"));
          history.hb = JSON.parse(localStorage.getItem("history_of_hb"));
          history.anser = JSON.parse(localStorage.getItem("history_of_anser"));
          var ls_flag = JSON.parse(localStorage.getItem("flag"))
          flag.game_end = ls_flag.game_end;
          flag.game_win = ls_flag.game_win;
          flag.remain_show = ls_flag.remain_show;

          // エラーハンドリング ゲーム完了が保存できていないパターン
          if(history.hb.length != 0){
            if(history.hb[history.hb.length - 1].length !=0 &history.hb[history.hb.length - 1].every((n) => n == "HIT") & !flag.game_end){
              alertShow("バグですが動作に問題はありません。\n 戦歴が増加している可能性があります。 \n Error8: flag is not set.[true]",2000);
              flag.game_end = true;
              flag.game_win = true;
              if(localStorage.getItem("bf_error8") == "false"){
                localStorage.setItem("bf_error8", true);
              }else{
                localStorage.setItem("flag", JSON.stringify({"game_end":flag.game_end,"game_win":flag.game_win,"remain_show":flag.remain_show}));
              }
            }else if(history.hb.length ==10 & !flag.game_end){
              alertShow("バグですが動作に問題はありません。\n 戦歴が増加している可能性があります。 \n Error8: flag is not set.[false]",2000);
              flag.game_end = true;
              flag.game_win = false;
              if(localStorage.getItem("bf_error8") == "false"){
                localStorage.setItem("bf_error8", true);
              }else{
                localStorage.setItem("flag", JSON.stringify({"game_end":flag.game_end,"game_win":flag.game_win,"remain_show":flag.remain_show}));
              }
            }
          }

          // 残り候補数推移
          if(localStorage.getItem("remain") != null){
            history.remain = JSON.parse(localStorage.getItem("remain"));
          }
          // メモ機能
          if(localStorage.getItem("Assumption_word") != null){
            Assumption_word = JSON.parse(localStorage.getItem("Assumption_word"));
            Assumption_word.hit.forEach(element=>{
              document.getElementById("btn_"+element).classList.add("AssumptionHit");
            })
            Assumption_word.none.forEach(element=>{
              document.getElementById("btn_"+element).classList.add("AssumptionNone");
            })
          }
          // 文字最大使用回数
          if(localStorage.getItem("max_use") != null){
            max_use = JSON.parse(localStorage.getItem("max_use"));
          }
          // 今日のUUID
          if(localStorage.getItem("uuid") != null){
            daily_data.uuid = localStorage.getItem("uuid");
          }
        }else{
          // 今日のデータが無い場合
        }
      }else{
      // ゲーム経験していない場合
      }

      wakeup_array[5] = true;
      FinWakeupProcess();
    } catch (e) {
      console.log(e)
      alert("ゲーム履歴取得においてエラーがあります。設定画面より、データの初期化をお願いします。\nThere is an error in acquiring game history. Please initialize the data from the setting screen.");
    }
  }else{
    // localstorage off
    wakeup_array[5] = true;
    FinWakeupProcess();
  };
}

// =================
// 単語読み込み
// =================
// シード値付きの乱数
// https://sbfl.net/blog/2017/06/01/javascript-reproducible-random/
class Random {
  constructor(seed,x) {
    this.x = x;
    this.y = 4120343;
    this.z = 856135;
    this.w = seed;
  }
  // XorShift
  next() {
    const t = this.x ^ (this.x << 11);
    this.x = this.y;
    this.y = this.z;
    this.z = this.w;
    return this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8));
  }
  // min 以上 max 以下の乱数を生成する
  nextInt(min, max) {
    const r = Math.abs(this.next());
    return min + (r % (max + 1 - min));
  }
}
const GetRandom = (Q_data,Yesterday = false)=>{
  let nowtime = new Date();
  if(Yesterday)nowtime = new Date(nowtime.setDate(nowtime.getDate() - 1));
  let year = parseInt(String(nowtime.getFullYear()));
  let month = parseInt(String(nowtime.getMonth()));
  let day = parseInt(String(nowtime.getDate()));
  // console.log(`${year}/${month+1}/${day}`)
  let seed = year+month*801+day*13;
  let rand = new Random(seed,day*2001);
  let random_num = rand.nextInt(0,Q_data["title"].length);
  return random_num;
}
const GetTodayWord = ()=>{
  let random_num = GetRandom(csv_data.q_data);
  let title = csv_data.q_data["title"][random_num];
  let pronunciation  = csv_data.q_data["pronunciation"][random_num];
  tango.kanzi = title;
  tango.yomi = pronunciation;
  // console.log(`${tango.kanzi},${tango.yomi},${random_num+1}`)
  FinWakeupProcess();
}
const GetYesterdayTango = ()=>{
  let random_num = GetRandom(csv_data.q_data,true);
  let b_title = csv_data.q_data["title"][random_num];
  let b_pronunciation  = csv_data.q_data["pronunciation"][random_num];
  document.getElementById("before_tango").innerText = `「${b_title}」（${b_pronunciation}）`
}

// =================
// UIタイマー
// =================
const DisplayTime = ()=>{
  var nowtime = new Date();
  if((23-parseInt(nowtime.getHours())) == 0 & (59-parseInt(nowtime.getMinutes())) == 0 & (59-parseInt(nowtime.getSeconds())) == 0){
    alert("日付が変わりました。単語が変わるためリロードします\nThe date has changed. Reload for word change.")
    location.reload();
  }
  var time_left = ("0"+String(23-parseInt(nowtime.getHours()))).slice(-2) + ":" + ("0"+String(59-parseInt(nowtime.getMinutes()))).slice(-2) + ":" + ("0"+String(59-parseInt(nowtime.getSeconds()))).slice(-2);
  if(flag.lang_en){
    document.getElementById("time_left").innerHTML = "<strong>No."+String(daily_data.pass_day)+"</strong>　Next Tango："+time_left;
  }else{
    document.getElementById("time_left").innerHTML = "<strong>第"+String(daily_data.pass_day)+"回</strong> 残り時間："+time_left;
  }
}


// =================
// UI更新
// =================
const SetUi = () =>{
  // たんご検出
  if(enable_localstorage){
    if(JSON.parse(localStorage.getItem("tango")) != null & localStorage.getItem("pass_day")==daily_data.pass_day){
      if(JSON.parse(localStorage.getItem("tango")).yomi != tango.yomi){
        tango = JSON.parse(localStorage.getItem("tango"));
        alertShow("バグです。答えの単語が他のユーザと異なる可能性があります。\n Error5: The saved word and the retrieved word are different.",2000);
      }
    }
  }

  ShowHistory(history.game);

  RemoveSolveHighlight();
  DisplayWordUpdate();
  SolvHighlight();
  KeybordHB();
  CheckRemaining_all(false);
  if(change_wind)mode_change("game");
  if(flag.game_end){
    End();
  }else{
    flag.wakeup = true;
  }
};
// 選択ハイライト削除
const RemoveSolveHighlight = ()=>{
  var $display_class = document.getElementsByClassName("display_chara");
  Array.from($display_class).forEach(e=>{
    e.classList.remove("row_now_solve");
    e.classList.remove("now_solve");
    e.removeEventListener("click",displayClick);
  })
  }
// 文字反映
let done_word = [false,false,false,false,false,false,false,false,false,false]
const DisplayWordUpdate = (wo = history.anser,hb = history.hb) =>{
  // 最後の場合はこれを呼ばない
  [0,1,2,3,4,5,6,7,8,9].forEach(row_ind=>{
    if(row_ind < wo.length){
      if(!done_word[row_ind]){
        var chara_arr = wo[row_ind].split("");
        [0,1,2,3,4].forEach(cha_ind=>{
          $dis_cha = document.getElementById(`dis-${row_ind}-${cha_ind}`)
          $dis_cha.innerText = chara_arr[cha_ind]
          $dis_cha.classList.add(`word_${hb[row_ind][cha_ind].toLowerCase()}`)
        })
        done_word[row_ind] = true
      };
    };
  });
};
// 選択ハイライト反映
const SolvHighlight = (row = game_data.now_solve.row)=>{
  if(flag.game_end){return};
  for(let i = 0;i < 5;i++){
    if(i == game_data.now_solve.index){
      document.getElementById("dis-"+String(row)+"-"+String(i)).classList.add("now_solve");
      document.getElementById("dis-"+String(row)+"-"+String(i)).addEventListener("click",displayClick);
    }else{
      document.getElementById("dis-"+String(row)+"-"+String(i)).classList.add("row_now_solve");
      document.getElementById("dis-"+String(row)+"-"+String(i)).addEventListener("click",displayClick);
    }
  }
}
// キーボード反映
const KeybordHB = (HB_arr = history.hb_text)=>{
  // キーボード反映
  Array.from(new Set(HB_arr["all"])).forEach((e)=>{
    document.getElementById("btn_"+e).classList.add("word_none");
    document.getElementById("btn_"+e).classList.remove("AssumptionNone","AssumptionHit");
    Assumption_word.hit = Assumption_word.hit.filter(item => item != e);
    Assumption_word.none = Assumption_word.none.filter(item => item != e);
  })
  Array.from(new Set(HB_arr["blow"])).forEach((e)=>{
    document.getElementById("btn_"+e).classList.remove("word_none");
    document.getElementById("btn_"+e).classList.add("word_blow");
  })
  Array.from(new Set(HB_arr["hit"])).forEach((e)=>{
    document.getElementById("btn_"+e).classList.remove("word_none","word_blow");
    document.getElementById("btn_"+e).classList.add("word_hit");
  })
  if(enable_localstorage){
    localStorage.setItem("Assumption_word", JSON.stringify(Assumption_word));
  }
}
const EndWordUpdate = (time,cha_ind = 0,wo = history.anser,hb = history.hb,row_ind = game_data.now_solve.row-1)=>{
  // 最後の場合
  if(cha_ind > 4)return;
  var chara_arr = wo[row_ind].split("");
  $dis_cha = document.getElementById(`dis-${row_ind}-${cha_ind}`)
  $dis_cha.innerText = chara_arr[cha_ind]
  $dis_cha.classList.add(`word_${hb[row_ind][cha_ind].toLowerCase()}`)
  setTimeout(EndWordUpdate, time,time,cha_ind+1);
};


// =================
// UI更新
// =================
const ShowHistory = (dir) =>{
  document.getElementById("try_count").innerText = dir.try_count;
  win_rate = String(Math.floor((dir.win_count/dir.try_count)*100))+"%";
  if(!Math.floor((dir.win_count/dir.try_count)*100)){
    win_rate = "0%";
  }
  document.getElementById("win_rate").innerText = win_rate;
  document.getElementById("current_streak").innerText =dir.current_streak;
  document.getElementById("max_streak").innerText =dir.max_streak;

  // chart
  Chart.defaults.plugins.legend.display = false;
  labels = ["1","2","3","4","5","6","7","8","9","10"];
  data = {
    labels: labels,
    datasets: [{
      backgroundColor: 'rgb(128,197,222)',
      borderColor: 'rgb(128,197,222)',
      data: dir.history,
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
        }
      },
    }
  };

  if(myChart != "A"){
    myChart.destroy();
  }
  myChart = new Chart(
    document.getElementById('myChart'),
    config
  );
}
const createEmoji = (url_flag,rem_flag,twitter_flag,share_flag=false)=>{
  // エラー処理
  if(rem_flag){
    _remain = [...history.remain]
    if(history.hb.length != _remain.length){
      missnum = history.hb.length - _remain.length
      minn_array = Array(missnum);
      minn_array.fill(NaN);
      _remain.unshift(...minn_array);
    }
  }
  var base_text = ""
  if(twitter_flag)base_text+="#";
  base_text += "ことのはたんご";
  if(share_flag)base_text+="D";
  base_text += " 第"+String(daily_data.pass_day)+"回  ";

  if(flag.game_win){
    base_text += String(game_data.now_solve.row)+"/10\r\n"
  }else if(game_data.now_solve.row == 10){
    base_text += "X/10\r\n"
  }else if(flag.game_end){
    base_text += "X("+String(game_data.now_solve.row)+")/10\r\n"
  }else{
    base_text += String(game_data.now_solve.row)+"/10\r\n"
  }

  if(url_flag){
    base_text += "https://plum-chloride.jp/kotonoha-tango/index.html \r\n"
  }
  if(share_flag){
    base_text += "https://plum-chloride.jp/kotonoha-tango/share.html"+toQuery(daily_data.pass_day,history.anser,history.hb,tango.yomi)+" \r\n"
  }
  graph_text = ""
  history.hb.forEach((Element,index)=>{
    if(index<5){
      graph_text+=" \r\n"
      Element.forEach((e)=>{
        graph_text += e.replace("NO","⬜").replace("BLOW","🟨").replace("HIT","🟩")
      })
      if(rem_flag)graph_text+=" "+String(_remain[index]);
    }else{
      graph_text+=" \r\n"
      Element.forEach((e)=>{
        graph_text += e.replace("NO","⚪").replace("BLOW","🟡").replace("HIT","🟢")
      })
      if(rem_flag)graph_text+=" "+String(_remain[index]);
    }
  })
  return(base_text+graph_text)
}
// =================
// 単語入力・キーボード
// =================
// キーボード入力用入力欄に変化があった場合
$input = document.getElementById("input_text");
$input.addEventListener('input',(e)=>{
  if(flag.game_end){return};
  _anser = $input.value.split('');
  before_anser = [];
  _anser.forEach(element => {
    if(hiragana.indexOf(element) == -1){
      // カタカナや英語だった場合はそのまま（確定時にテキスト種別を取得する。）
      before_anser.push(element);
    }else{
      // ひらがなをカタカナに
      before_anser.push(katakana[hiragana.indexOf(element)]);
    }
  });
  b_ans = before_anser.slice(0,5);
  b_ans.push("　","　","　","　","　");
  game_data.anser = b_ans.slice(0,5);
  Word_input()
})
const Word_input = (word_arr = game_data.anser,row = game_data.now_solve.row) =>{
  word_arr.forEach((cha,cha_ind)=>{
    $dis_cha = document.getElementById(`dis-${row}-${cha_ind}`)
    $dis_cha.innerText = cha.replace(/－/g,"　")
  })
}
const KeybordButton = (character)=>{
  switch(KeybordButton_Mode){
    case "input":
      game_data.anser[game_data.now_solve.index] = character;
      if(game_data.now_solve.index <4){
        game_data.now_solve.index += 1;
      }
      RemoveSolveHighlight();
      SolvHighlight();
      Word_input();
      $input.value = game_data.anser.join("").replace(/　/g,"－")
      break;
    case "Assumption":
      var cr_key = document.getElementById("btn_"+character);
      if(!cr_key.classList.contains("word_none")){
        if(cr_key.classList.contains("AssumptionHit")){
          cr_key.classList.add("AssumptionNone");
          cr_key.classList.remove("AssumptionHit");
          Assumption_word.none.push(character);
          Assumption_word.hit = Assumption_word.hit.filter(item => item != character);
        }else if(cr_key.classList.contains("AssumptionNone")){
          cr_key.classList.remove("AssumptionNone");
          Assumption_word.none = Assumption_word.none.filter(item => item != character);
        }else{
          cr_key.classList.add("AssumptionHit");
          Assumption_word.hit.push(character);
        }
        if(enable_localstorage){
          localStorage.setItem("Assumption_word", JSON.stringify(Assumption_word));
        }
      }
      break;
  }
}
const FuncButton = (key)=>{
  var gni = game_data.now_solve.index;
  switch(key){
    case "←":
      if(gni > 0){
        game_data.now_solve.index -= 1;
        RemoveSolveHighlight();
      SolvHighlight();
      }
      break;
    case "→":
      if(gni <4){
        game_data.now_solve.index += 1;
        RemoveSolveHighlight();
      SolvHighlight();
      }
      break;
    case "del":
      if(game_data.anser[gni] == "　" & gni > 0){
        game_data.anser[gni -1] = "　";
        game_data.now_solve.index -= 1;
      }else{
        game_data.anser[gni] = "　";
      }
      RemoveSolveHighlight();
      SolvHighlight();
      Word_input();
      $input.value = game_data.anser.join("").replace(/　/g,"－")
      break;
    default:
      alert("バグ、もしくは不正な操作です。リロードします。\nERROR3: keyname is invalid");
      location.reload();
  }
}
const change_keybord_inout_mode = ()=>{
  mode_change("game")
  switch(KeybordButton_Mode){
    case "input":
      KeybordButton_Mode = "Assumption"
      document.getElementById("img_write").classList.add("Assumption-btn");
      document.getElementById("keybord").classList.add("Assumption-btn");
      break;
    case "Assumption":
      KeybordButton_Mode = "input"
      document.getElementById("img_write").classList.remove("Assumption-btn");
      document.getElementById("keybord").classList.remove("Assumption-btn");
      break;
  }
}
const alldel = ()=>{
  Assumption_word.hit.forEach(element=>{
    document.getElementById("btn_"+element).classList.remove("AssumptionHit","AssumptionNone");
  })
  Assumption_word.none.forEach(element=>{
    document.getElementById("btn_"+element).classList.remove("AssumptionHit","AssumptionNone");
  })
  Assumption_word = {"hit":[],"none":[]};
  if(enable_localstorage){
    localStorage.setItem("Assumption_word", JSON.stringify(Assumption_word));
  }
}
const KryTypeChange = (type)=>{
  if(curent_key_type == type){
    return false;
  }else{
    document.getElementById("kt_"+type).classList.add("cuurent");
    document.getElementById("kt_"+curent_key_type).classList.remove("cuurent");
    curent_key_type = type;
    switch(type){
      case "all":
        Array.prototype.filter.call(document.getElementsByClassName("bt_normal"),(e)=>{
          e.classList.remove("non_visi");
        });
        Array.prototype.filter.call(document.getElementsByClassName("bt_ga"),(e)=>{
          e.classList.remove("non_visi");
        });
        document.getElementById("keybord_hr").classList.remove("non_visi");
        document.getElementById("keybord_move").classList.remove("non_visi");
        break;
      case "normal":
        Array.prototype.filter.call(document.getElementsByClassName("bt_normal"),(e)=>{
          e.classList.remove("non_visi");
        });
        Array.prototype.filter.call(document.getElementsByClassName("bt_ga"),(e)=>{
          e.classList.add("non_visi");
        });
        document.getElementById("keybord_hr").classList.add("non_visi");
        document.getElementById("keybord_move").classList.remove("non_visi");
        break;
      case "ga":
        Array.prototype.filter.call(document.getElementsByClassName("bt_normal"),(e)=>{
          e.classList.add("non_visi");
        });
        Array.prototype.filter.call(document.getElementsByClassName("bt_ga"),(e)=>{
          e.classList.remove("non_visi");
        });
        document.getElementById("keybord_hr").classList.add("non_visi");
        document.getElementById("keybord_move").classList.remove("non_visi");
        break;
      case "none":
        Array.prototype.filter.call(document.getElementsByClassName("bt_normal"),(e)=>{
          e.classList.add("non_visi");
        });
        Array.prototype.filter.call(document.getElementsByClassName("bt_ga"),(e)=>{
          e.classList.add("non_visi");
        });
        document.getElementById("keybord_hr").classList.add("non_visi");
        document.getElementById("keybord_move").classList.add("non_visi");
        break;
    }
  }
}
// =================
// 回答
// =================
document.getElementById("tango_input").addEventListener("submit",(e)=>{
  if(flag.game_end){return};  
  // 値の改変やバグチェック
  if(!flag.wakeup){
    alert("バグ、もしくは不正な操作です。リロードします。\n Error1: Not wake up");
    location.reload();
    return;
  }else if(!(game_data.anser.length == 5)){
    alert("バグ、もしくは不正な操作です。リロードします。\n Error2: The length of the entered character is incorrect")
    location.reload();
    return;
  }
  // 異なる文字が入力されていないかチェック。
  var check = false
  game_data.anser.forEach((element)=>{
    if(hiragana.includes(element) | katakana.includes(element)){
      ;
    }else{
      if(check){
        if(flag.lang_en){
          alertShow('Attention\nNot enough letter or use only (hiragana or katakana)',2000);
        }else{
          alertShow("注意\n入力できる「たんご」はひらがな・カタカナの5文字のみです",2000);
        };
      }
      check = true
    }
  });
  if(check)return;
  // 入力単語が実在しているかのチェック
  var kotonoha = game_data.anser.join("");
  if(csv_data.a_data.includes(kotonoha)){
    ;
  }else{
    if(flag.lang_en){
      alertShow('Attention\nNot in the dictionary of this app)',2000);
    }else{
      alertShow("注意\nことのは（本アプリの辞書内の単語）を記入して下さい",2000)
    };
    check = true;
    return;
  }

  // ヒットアンドブロー処理
  var today_tango_arr = tango.yomi.split("");
  var h_word = [];
  var b_word = [];
  var not_word = [];
  var hb_list = ["NO","NO","NO","NO","NO"];
  var hit_count = 0;
  var cha_count = {}
  game_data.anser.forEach((element,index)=>{
    if(element == today_tango_arr[index]){
      // hit
      h_word.push(element);
      hb_list[index] = "HIT";
      hit_count += 1;
    }else if(today_tango_arr.includes(element)){
      // blow
      b_word.push(element);
      hb_list[index] = "BLOW";
    }else{
      not_word.push(element);
    }

    if(Object.keys(cha_count).indexOf(element) != -1){
      cha_count[element] += 1
    }else{
      cha_count[element] = 1
    }
  });

  // 重複処理・HIT_BLOWだす文字のインデックスの重要度を判定する
  let cha_hb_priority = {}
  Object.keys(cha_count).forEach(e=>{
    let h_priority = [];
    let bn_priority = [];
    if(today_tango_arr.includes(e)){
      cha_hb_priority[e] = [];
      // HIT色付け優先度検索
      [0,1,2,3,4].forEach(cha_ind=>{
        if(game_data.anser[cha_ind] == e){
          if(today_tango_arr[cha_ind] == e){
            h_priority.push(cha_ind)
          }else{
            bn_priority.push(cha_ind)
          };
        };
      });
      cha_hb_priority[e].push(...h_priority);
      cha_hb_priority[e].push(...bn_priority);
    }
  });
  // 答えの文字数以上にBLOW判定があった場合重要度順にそれをNONEにする
  Object.keys(cha_hb_priority).forEach(e=>{
    var ans_cha_count = today_tango_arr.filter(word => word==e).length
    for(let i = 0; i<cha_hb_priority[e].length;i++){
      var prio_index = cha_hb_priority[e][i]
      if(i >= ans_cha_count){
        if(hb_list[prio_index] == "BLOW"){
          hb_list[prio_index] = "NO"
        }else if(hb_list[prio_index] == "HIT"){
          alert("重複判定処理でエラーが発生しました。\n An error occurred during duplication judgment processing.");
        }
      }
    }
  })
  // 答えの最大文字数が分かった場合それを保存する
  Object.keys(cha_hb_priority).forEach(e=>{
    var ans_cha_count = today_tango_arr.filter(word => word==e).length
    if(cha_hb_priority[e].length>ans_cha_count){
      max_use[e] = ans_cha_count;
    }
  })

  // 文字情報取得
  history.hb_text.hit = Array.from(new Set(history.hb_text.hit.concat(h_word)));
  history.hb_text.blow = Array.from(new Set(history.hb_text.blow.concat(b_word)));
  history.hb_text.all = Array.from(new Set(history.hb_text.all.concat(not_word)));

  // 画面表示系計算
  history.hb.push(hb_list);
  history.anser.push(game_data.anser.toString().replace(/,/g, ""));
  game_data.anser = ["　","　","　","　","　"];



  // 回答したことを伝える
  game_data.now_solve.row += 1;
  game_data.now_solve.index = 0;

  // ローカルストレージに保存
  if(enable_localstorage){
    localStorage.setItem("flag", JSON.stringify({"game_end":false,"game_win":false,"remain_show":flag.remain_show}));
    localStorage.setItem("experience", true);
    localStorage.setItem("now_solve", JSON.stringify(game_data.now_solve));
    localStorage.setItem("history_of_hb_text", JSON.stringify(history.hb_text));
    localStorage.setItem("history_of_hb", JSON.stringify(history.hb));
    localStorage.setItem("history_of_anser", JSON.stringify(history.anser));
    localStorage.setItem("pass_day", daily_data.pass_day);
    localStorage.setItem("bf_error8", false);
    localStorage.setItem("tango",JSON.stringify(tango));
    localStorage.setItem("max_use",JSON.stringify(max_use));
  }
  var _game_end = false;
  if(hit_count == 5 | game_data.now_solve.row == 10)_game_end = true;

  // 画面更新
  if(!_game_end){
    RemoveSolveHighlight();
    DisplayWordUpdate();
    SolvHighlight();
    KeybordHB();
    CheckRemaining_all(true);
    $input.value = "";
  }else{
    $input.value = "";
    window.scroll({top: 0, behavior: 'smooth'});
    RemoveSolveHighlight();
    KeybordHB();
    CheckRemaining_all(true);
    sleep_time = 500;
    setTimeout(EndWordUpdate, sleep_time,sleep_time);
  }


  if(hit_count == 5){
    flag.game_end = true;
    flag.game_win = true;
    setTimeout(End, 3000);
  }else if(game_data.now_solve.row == 10){
    flag.game_end = true;
    flag.game_win = false;
    setTimeout(End, 3000);
  };
});
// =================
// 残り候補数表示
// =================
const CheckRemaining_all = (progress_re = false) =>{
  if(!filter_array | filter_array.length == 0){
    alertShow("バグです。プレイは可能ですが動作に一部影響が出ています。\n Error3: The number of remaining words is not defined",2000);
    return;
  }
  var history_of_hb_text = history.hb_text;
  var history_of_hb = history.hb;
  var history_of_anser = history.anser;
  // blow hit 重複削除
  history_of_hb_text["hit"].forEach((element) => {
    if(history_of_hb_text["blow"].length != 0 & history_of_hb_text["blow"].includes(element)){
      history_of_hb_text["blow"].splice(history_of_hb_text["blow"].indexOf(element),1);
    };
  });

  // none 含んでいない
  // none_re_array -> 何度もnoneを回さなくていいように
  var _none_array_before = [];
  history_of_hb_text["all"].forEach((e) =>{
    if(!none_re_array.includes(e)){
      _none_array_before.push(e);
    }
  });
  _none_array_before.forEach((e)=>{
    filter_array = filter_array.filter((word)=>!word.includes(e));
  })
  none_re_array.push(..._none_array_before);

  // blow 含んでいる事
  history_of_hb_text["blow"].forEach((e) =>{
    filter_array = filter_array.filter((word)=>word.includes(e));
  })
  // hit 含んでいること
  history_of_hb_text["hit"].forEach((e) =>{
    filter_array = filter_array.filter((word)=>word.includes(e));
  })

  // hbリストを参照
  history_of_hb.forEach((element,row)=>{
    // 各試行
    element.forEach((e,cha_ind)=>{
      // 各文字の評価(HIT BLOW)
      // HITの場合は確定BLOWとNOの場合はその位置から除外
      if(e == "BLOW" || e == "NO"){
        filter_array = filter_array.filter((word)=>history_of_anser[row][cha_ind] != word[cha_ind]);
      }else if(e == "HIT"){
        filter_array = filter_array.filter((word)=>history_of_anser[row][cha_ind] == word[cha_ind]);
      }
    })
  });

  // 最大使用回数が分かる場合
  Object.keys(max_use).forEach(e=>{
    filter_array = filter_array.filter((word)=>(word.match( new RegExp( e, "g" ) ) || [] ).length == max_use[e])
  })

  RemainShow(filter_array.length);
  if(progress_re){
    history.remain.push(filter_array.length);
    if(enable_localstorage){
      localStorage.setItem("remain", JSON.stringify(history.remain));
    }
  };
}
// =================
// ゲームエンド
// =================
// === game終了処理 ===
const End = ()=>{
  if(flag.game_win){
    if(flag.lang_en){
      var win_tx = "You're correct";
    }else{
      var win_tx = "正解です"
    }
  }else{
    if(flag.lang_en){
      var win_tx = "You're Incorrect";
    }else{
      var win_tx = "不正解です"
    }
  }

  // 今日初めての終了の場合データの更新を行う
  if(enable_localstorage){
    var win_b_tf = JSON.parse(localStorage.getItem("flag")).game_end;
  }else{
    var win_b_tf = false;
  }
  if(!win_b_tf){
    history.game.try_count += 1;
    if(flag.game_win){
      // 勝利の場合
      history.game.win_count += 1;
      history.game.current_streak += 1;
      if(history.game.current_streak>history.game.max_streak){
        history.game.max_streak = history.game.current_streak;
      }
      history.game.history[game_data.now_solve.row -1] += 1;
    }else{
      // 敗北の場合
      history.game.current_streak = 0;
    }
    if(enable_localstorage){
      localStorage.setItem("history_of_game", JSON.stringify(history.game));
    }
  }
  // 終了したことをwebstorageに伝える
  var LS_flag = {"game_end":flag.game_end,"game_win":flag.game_win,"remain_show":flag.remain_show};
  if(enable_localstorage){
    localStorage.setItem("flag", JSON.stringify(LS_flag));
  }
  // 文字変更
  document.getElementById("result").innerText = win_tx
  document.getElementById("result_answer").innerText = `たんご：「${tango.kanzi}」（${tango.yomi}）`
  document.getElementById("result_answer").classList.remove("non_visi");
  // 戦歴表示
  ShowHistory(history.game);
  // グラフ画面起動
  mode_change("bar");
  if(enable_localstorage){
    if(flag.game_end != JSON.parse(localStorage.getItem("flag")).game_end){
      localStorage.setItem("flag", JSON.stringify({"game_end":flag.game_end,"game_win":flag.game_win,"remain_show":flag.remain_show}));
      alertShow("バグです。動作に一部影響が出ています。\n Error7: flag is not set",2000);
    }
  };

  // 339用データ保存（後日削除）
  if(!win_b_tf){
    if(daily_data.pass_day == 339){localStorage.setItem("end339",true)};
  };
  // 339用データ保存（後日削除）== ここまで


  // api用
  var api_num = 0
  api_num = game_data.now_solve.row;
  if(!flag.game_win){
    api_num = 11;
  }
  // エラー吐いたときに影響がないように最下部に
  // console.log(api_num)
  if(!win_b_tf){
    data_post(daily_data.pass_day,api_num);
  }
}
// === API データポスト ===
const data_post = (day,result)=>{
  if(daily_data.uuid == undefined){
    daily_data.uuid = "some_id"
  }
  p_t = {"pass_day":String(day),"ans":String(result),"time":GetNowTime(),"localstorage":enable_localstorage,"uuid":daily_data.uuid,"day":daily_data.pass_day,"words":history.anser,"win":flag.game_win,"game_ex":history.game.try_count}
  p_j = JSON.stringify(p_t);
  xhr = new XMLHttpRequest;
  xhr.onload = function(){
    var res = xhr.responseText;
    console.log(res);
  };
  xhr.onerror = function(){
    alertShow("バグです。動作に一部影響が出ています。\n Error6: API communication failed",2000);
  }
  xhr.open('POST', "https://hizz2zq2k4wt2t76n7uqon4peu0dpnsq.lambda-url.ap-northeast-1.on.aws/", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(p_j);
}

// =================
// UIイベント
// =================
const allNonVisi = ()=>{
  Object.keys(HTML_element.display_mode).forEach((key) => {
    HTML_element.display_mode[key].classList.add("non_visi");
  });
  Object.keys(HTML_element.icon_btn).forEach((key) => {
    HTML_element.icon_btn[key].setAttribute("src",icon_src[key]);
    HTML_element.icon_btn[key].setAttribute("onclick","mode_change('"+key+"');");
  });
}
// 画面遷移
const mode_change = (to_mode)=>{
  allNonVisi()
  switch(to_mode){
    case "hatena":
    case "set":
      SetMode(to_mode);
      break;
    case "bar":
      SetMode(to_mode);
      HTML_element.display_mode.body.classList.remove("non_visi");
      HTML_element.emoji_place.innerText = createEmoji(false,HTML_element.remain_toggle.checked);
      break;
    case "game":
      HTML_element.display_mode.body.classList.remove("non_visi");
      break;
  }
}
const SetMode = (mode)=>{
  HTML_element.display_mode[mode].classList.remove("non_visi");
  HTML_element.icon_btn[mode].setAttribute("src",icon_src["batu"]);
  HTML_element.icon_btn[mode].setAttribute("onclick","mode_change('game');");
}
// コピー クリップボードに送信
document.getElementById("graph_copy").addEventListener("click",(element)=>{
  var promise = navigator.clipboard.writeText(createEmoji(false,HTML_element.remain_toggle.checked,false));
  if(promise){
    alertShow("クリップボードにコピー完了",500);
  }
})
// ツイート
document.getElementById("graph_tw").addEventListener("click",(element)=>{
	tweet_btn(false);
	});
// URL付き
document.getElementById("graph_tw_url").addEventListener("click",(element)=>{
  tweet_btn(true);
});
const tweet_btn = (url_flag,share_flag) => {
  s = createEmoji(url_flag,HTML_element.remain_toggle.checked,true,share_flag);
  if (s != ""){
    s = encodeURIComponent(s);
    //投稿画面を開く
    url = "https://twitter.com/intent/tweet?text=" + s;
    window.open(url,"_blank");
    }
}
// 結果共有
document.getElementById("graph_copy_u").addEventListener("click",(element)=>{
  var promise = navigator.clipboard.writeText(createEmoji(false,HTML_element.remain_toggle.checked,false,true));
  if(promise){
    alertShow("クリップボードにコピー完了",500);
  }
});
document.getElementById("graph_tw_u").addEventListener("click",(element)=>{
  tweet_btn(false,true);
});
// 閉じるボタンでもgraphを閉じられるように
document.getElementById("graph_close").addEventListener("click",(el)=>{
  mode_change("game");
});
// 残り単語数推移機能のオンオフ検知(チェックボタン)
const RemainToggleChange = ()=>{
  HTML_element.emoji_place.innerText = createEmoji(false,HTML_element.remain_toggle.checked);
};
// 色変更機能
const ChangeColor = (color_hit = current_color[0] ,color_brow = current_color[1])=>{
  document.documentElement.style.setProperty('--hit',color_hit);
  document.documentElement.style.setProperty('--brow',color_brow);
  current_color[0] = color_hit;
  current_color[1] = color_brow;
  switch(color_brow){
    case "rgb(252, 201, 72)":
      document.getElementById("colour_0").setAttribute("checked","");
      break;
    case "#85C0F9":
      document.getElementById("colour_1").setAttribute("checked","");
      break;
    case "rgb(188, 230, 163)":
      document.getElementById("colour_2").setAttribute("checked","");
      break;
  }
  if(enable_localstorage){
    localStorage.setItem("color", JSON.stringify(current_color));
  }
}
// 残り候補数非表示非表示切り替え
const toggle_remain_show = ()=>{
  if(flag.lang_en){
    if(flag.remain_show){
      HTML_element.remain_toggle_text.innerText="（Show）"
    }else{
      HTML_element.remain_toggle_text.innerText="（Hide）"
    }
  }else{
    if(flag.remain_show){
      HTML_element.remain_toggle_text.innerText="（表示）"
    }else{
      HTML_element.remain_toggle_text.innerText="（非表示）"
    }
  }
  flag.remain_show = !flag.remain_show
  RemainShow();
  if(enable_localstorage){
    localStorage.setItem("flag", JSON.stringify({"game_end":flag.game_end,"game_win":flag.game_win,"remain_show":flag.remain_show}));
  }
}
// 残り数反映
const RemainShow = (remain_num = filter_array.length)=>{
  if(flag.remain_show){
    if(flag.lang_en){
      HTML_element.remain.innerText = `Remaining words：${remain_num}`;
    }else{
      HTML_element.remain.innerText = `残り候補数：${remain_num}`;
    };
  }else{
    if(flag.lang_en){
      HTML_element.remain.innerText = `Remaining words：〇〇〇`;
    }else{
      HTML_element.remain.innerText = `残り候補数：〇〇〇`;
    };
  }
}
// ディスプレイクリック
const displayClick = (e)=>{
  game_data.now_solve.index = parseInt(e.target.id.slice(-1));
  RemoveSolveHighlight();
  SolvHighlight();
}



// アラート用
const alertShow = (text,time = 2000)=>{
  document.getElementById("alert").classList.remove("non_visi")
  document.getElementById("alert_text").innerText = text
  setTimeout(()=>{document.getElementById("alert").classList.add("non_visi")},time);
}

// =================
// 複数タブ
// =================
window.addEventListener('storage', function(e) {
  if(e.key == "history_of_hb"){
    if(!reload){
      reload = true;
      alertShow("別のタブでことのはたんごが更新されました。リロードします。\n KotonohaTango has been updated in another tab. Reloading.",2000);
      flag.wakeup = false;
      setTimeout(()=>{location.reload();},2000);
      return;
    }
    reload = true;
  }
});
// =================
// プレイ共有
// =================
const even_q = ["m","t","A","-j","i","Q","q","1","2","g","L","-l","-q","z","-e","P","-f","V","-g","-h","W","C","e","-i","N","D","O","k","E","F",
          "a","s","B","u","0","R","l","h","r","I","-b","c","-k","J","H","K",
          "Z","y","b","Y","j","v","5","4","n","3","-a","-c","-d","-m","-n","G","U","-0","8","T","9","S","d","-o","p","-p","M","w","6","f","X","x","7","o","-r"];
const odd_q = ["w","-a","g","r","Q","h","1","A","H","-f","-d","a","U","P","I","-o","V","-p","6","W","i","D","X","4","5","l","o","E","p","q",
        "R","B","s","K","t","T","3","0","F","j","O","k","v","G","Y","e",
        "S","x","C","u","f","-m","2","Z","-e","b","9","J","-l","8","-r","-c","-k","7","-b","-j","c","-i","n","-h","m","N","-q","L","-g","-0","-n","d","M","y","z"];
const toQuery = (k,Qan,Qhb,Qy) =>{
  var qu = "?d="
  qu += k + "&t="
  var q = []
  if(Number(k) % 2 == 0){
    q = even_q
  }else{
    q = odd_q
  }
  Qan.forEach((i)=>{
    Array.from(i).forEach((z)=>{
      qu += q[katakana.indexOf(z)]
    })
  })
  qu += "&a="
  Array.from(Qy).forEach((i)=>{
    qu += q[katakana.indexOf(i)]
  })
  qu += "&h="
  Qhb.forEach((i)=>{
    i.forEach((z)=>{
      switch(z){
        case "HIT":
          qu += "h"
          break;
        case "BLOW":
          qu += "b"
          break;
        case "NO":
          qu += "n"
          break;
      }
    })
    qu +="_"
  })
  return qu
}

// =================
// 降参
// =================
const gameff = ()=>{
  if(!flag.game_end){
    if(confirm("降参しますか？\nDo you want to surrender?")){
      if(enable_localstorage){
        localStorage.setItem("now_solve", JSON.stringify(game_data.now_solve));
        localStorage.setItem("history_of_hb_text", JSON.stringify(history.hb_text));
        localStorage.setItem("history_of_hb", JSON.stringify(history.hb));
        localStorage.setItem("history_of_anser", JSON.stringify(history.anser));
        localStorage.setItem("pass_day", daily_data.pass_day);
        localStorage.setItem("flag", JSON.stringify({"game_end":false,"game_win":false,"remain_show":flag.remain_show}));
        localStorage.setItem("bf_error8", false);
        localStorage.setItem("tango",JSON.stringify(tango));
      }
      flag.game_end = true;
      flag.game_win = false;
      setTimeout(End, 0);
    }
  }
}
// =================
// localstorage削除
// =================
const DelSet = ()=>{
  if(confirm("設定削除を行います。よろしいでしょうか？")){
    localStorage.removeItem("color");
    localStorage.removeItem("lang");
    alert("削除が完了しました。リロードします。")
    location.reload();
  }
}
const DelDay = ()=>{
  if(confirm("データ削除を行います。\nプレイ中のデータは削除されます。よろしいでしょうか？")){
    if(flag.game_end){
      alert("ゲームがクリアされているため削除できません。")
      return;
    }
    var key_len = ['pass_day', 'history_of_hb_text', 'now_solve', 'flag', 'pb_forms', 'color', 'lang', 'bf_error8', 'experience', 'remain', 'Assumption_word', 'history_of_hb', 'history_of_game', 'history_of_anser', 'tango',"max_use","uuid"]
    var kl = key_len.length
    alertShow("削除中です。少々お待ちください。",kl*500)
    for( let i = 0; i < key_len.length; i++ ){
      var some_key = key_len[i]
      if(some_key != "history_of_game"){
        setTimeout(lsri,i*500,some_key)
      }
      if(i == kl-1){
        setTimeout(()=>{
          alert("削除が完了しました。リロードします。")
          location.reload();
        },i*500)
      }
    }
  }
}
const lsri = (key)=>{
  console.log("del:"+key)
  localStorage.removeItem(key)
}
// =================
// 英語化
// =================
const changeLang = () =>{
  if(flag.lang_en){
    flag.lang_en = false;
    document.getElementById("hatena").innerHTML = HATENA_TEXT_JP;
    document.getElementById("Decision_button").innerText="決定";
    document.getElementById("input_text").setAttribute("placeholder","キーボード入力用");
    document.getElementById("setting").innerHTML = SET_TEXT_JP;
    document.getElementById("kt_all").innerText = "全種";
    document.getElementById("kt_normal").innerText = "50音";
    document.getElementById("kt_ga").innerText = "濁点等";
    document.getElementById("kt_none").innerText = "非表示";
    document.getElementById("before_tango_h2").innerText ="昨日のたんご：";
    if(!flag.remain_show){
      document.getElementById("remain_unvisi").innerText="（表示）";
    }else{
      document.getElementById("remain_unvisi").innerText="（非表示）";
    }

    // グラフ画面変更
    change_graph_lang(["今日は正解していません","コピー","ツイート","URL付きでツイート","戦歴","プレイ<br>回数","勝率","現在の<br>連勝数","最大<br>連勝数","正解分布表示","<u>閉じる</u>","正解です","不正解です","　残り候補数推移","メモを削除","降参","結果共有URL付き","回答に利用した単語が<br>共有されます","コピー","ツイート"])
  }else{
    flag.lang_en = true;
    document.getElementById("hatena").innerHTML = HATENA_TEXT_EN;
    document.getElementById("Decision_button").innerText="decision";
    document.getElementById("input_text").setAttribute("placeholder","input column");
    document.getElementById("setting").innerHTML = SET_TEXT_EN;
    document.getElementById("kt_all").innerText = "All";
    document.getElementById("kt_normal").innerText = "top half";
    document.getElementById("kt_ga").innerText = "bottom half";
    document.getElementById("kt_none").innerText = "hidden";
    document.getElementById("before_tango_h2").innerText = "Yesterday たんご：";
    if(!flag.remain_show){
      document.getElementById("remain_unvisi").innerText="（Show）";
    }else{
      document.getElementById("remain_unvisi").innerText="（Hide）";
    }

    // グラフ画面変更
    change_graph_lang(["Not yet correct today","Copy","Tweet","Tweet with URL","STATISTICS","Play<br>times","Win%","Current<br>Streak","Max<br>Streak","GUESS DISTRIBUTION","<u>close</u>","You're correct","You're Incorrect","　transition of remaining words","Delete memo","surrender","Result with shareable URL","The words you used in<br>your answer will be shared","Copy","Tweet"])
  }
  // 現在の言語を保存
  if(enable_localstorage){
    localStorage.setItem("lang", flag.lang_en);
  }
  // 色保存
  ChangeColor();
  // 残り候補数表示切り替え
  RemainShow();
}
const change_graph_lang= (text)=>{
  if(!flag.game_end){
    document.getElementById("result").innerText = text[0];
  }else{
    if(flag.game_win){
      document.getElementById("result").innerText = text[11];
    }else{
      document.getElementById("result").innerText = text[12];
    }
  }
  document.getElementById("graph_copy").innerText = text[1];
  document.getElementById("graph_tw").innerText = text[2];
  document.getElementById("graph_tw_url").innerText = text[3];
  document.getElementById("history_h2").innerText = text[4];
  document.getElementById("his_1").innerHTML = text[5];
  document.getElementById("his_2").innerHTML = text[6];
  document.getElementById("his_3").innerHTML = text[7];
  document.getElementById("his_4").innerHTML = text[8];
  document.getElementById("gr_title").innerText = text[9];
  document.getElementById("graph_close").innerHTML = text[10];
  document.getElementById("remain_span").innerHTML = text[13];
  document.getElementById("bt_alldel").innerText = text[14];
  document.getElementById("bt_ff").innerText = text[15];
  document.getElementById("share_h2").innerText = text[16]
  document.getElementById("share_ab").innerHTML = text[17]
  document.getElementById("graph_copy_u").innerText = text[18]
  document.getElementById("graph_tw_u").innerText = text[19]
}
const HATENA_TEXT_EN = `
<h2 id="switch_lang" onclick="changeLang();"><small><u id="switch_lang_u">日本語に切り替え</u></small></h2>
<h2>How to play</h2>
<p>Guess the <strong>tango(たんご)</strong> in 10 tries.</p>
<p>Each guess must be a valid 5 letter word,<strong>"kotonoha(ことのは)"</strong></p>
<p>After each guess, the color of the tiles will change to show evaluate the words you guessed.</p>
<h2>Examples</h2>
<div class="row">
<div class="display_num word_hit">キ</div>
<div class="display_num word_none">ョ</div>
<div class="display_num word_hit">ウ</div>
<div class="display_num word_none">シ</div>
<div class="display_num word_blow">ツ</div>
</div>
<div style="font-size: 0.9em;">
<p>The letter <strong class="hit_ex">「キ・ウ」</strong> is <strong class="hit_ex">in word and in the correct spot</strong>.</p>
<p>The letter <strong class="blow_ex">「ツ」</strong> is <strong class="blow_ex">in word but in the wrong spot</strong>。</p>
<p>The letter <strong>「ョ・シ」</strong> is not in the word.</p>
<p>In this case, the correct tango is 「急追：キュウツイ」.</p>
</div>
<h2>In the beginning</h2>
<p>I was greatly inspired by <a href="https://www.powerlanguage.co.uk/wordle/" target="_blank">Wordle</a> to create this app.</p>
<p>This is a word guessing game that can be played once a day.</p>
<p>The answer is the same for all users. Let's avoid spoilers.</p>
<p>Due to the nature of the Japanese language, <strong>it is tremendously more difficult than Wordle</strong>.</p>
<h2>Ver Memo function</h2>
<p>The memo function can be turned on by clicking the pencil icon in the navigation at the top of the screen.<br>During the memo function, you can place a "Maru/Batsu" marker by clicking on the UI keyboard.</p>
<h2>Assistance in playing and Post-production impressions<br>(Only Japanese)</h2>
<p>＞ <a href="https://note.com/plumchloride/n/n1fcddc29b00c" target="_blank">note記事</a></p>
<h2>About word updates and dictionary data<br>(Only Japanese)</h2>
<p>＞ <a href="https://note.com/plumchloride/n/n8d25cad96348" target="_blank">note記事</a></p>
<h2>About duplicate display</h2>
<p>When you enter the <strong>kotonoha</strong> that uses two or three of the same characters, the evaluation will be displayed from the left for the number of characters included in the answer. However, this is not the case for green highlighting.</p>
<p><strong>The correct tango is「シュウカイ」</strong></p>
<div class="row">
<div class="display_num word_hit">シ</div>
<div class="display_num word_none">シ</div>
<div class="display_num word_none">オ</div>
<div class="display_num word_none">ド</div>
<div class="display_num word_none">シ</div>
</div>
<p><strong>The correct tango is「スソナオシ」</strong></p>
<div class="row">
<div class="display_num word_none">シ</div>
<div class="display_num word_none">シ</div>
<div class="display_num word_blow">オ</div>
<div class="display_num word_none">ド</div>
<div class="display_num word_hit">シ</div>
</div>
<p><strong>The correct tango is「アカシヤキ」</strong></p>
<div class="row">
<div class="display_num word_blow">シ</div>
<div class="display_num word_none">シ</div>
<div class="display_num word_none">オ</div>
<div class="display_num word_none">ド</div>
<div class="display_num word_none">シ</div>
</div>
<p><strong>The correct tango is「シュクシャ」</strong></p>
<div class="row">
<div class="display_num word_hit">シ</div>
<div class="display_num word_blow">シ</div>
<div class="display_num word_none">オ</div>
<div class="display_num word_none">ド</div>
<div class="display_num word_none">シ</div>
</div>
<p><strong>The correct tango is「ブンシシキ」</strong></p>
<div class="row">
<div class="display_num word_blow">シ</div>
<div class="display_num word_blow">シ</div>
<div class="display_num word_none">オ</div>
<div class="display_num word_none">ド</div>
<div class="display_num word_none">シ</div>
</div>
<h2>CAUTION</h2>
<p>Japanese has a huge number of words, so even if a word exists, it may not be registered in <strong>Kotonoha</strong>.</p>
<p>We do not have a clear filtering system for the words in the questions. The words in this app do not contain "political, religious, sexist, or sexual" intentions.</p>

<h2  id="hatena_close" style="cursor: pointer;" onclick="mode_change('game');"><u>Close Description</u></h2>
<hr>
<div></div>
<p><small>Tango is generated daily from a dictionary using random numbers. You can get it by analyzing the internal JavaScript, but please refrain from doing so.</small></p>
<img alt="クリエイティブ・コモンズ・ライセンス" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
`

const HATENA_TEXT_JP = `
<h2 id="switch_lang"><small><u id="switch_lang_u" onclick="changeLang();">Switch to English</u></small></h2>
<h2>遊び方</h2>
<p>10回の試行で決められた5文字である1つの<strong>たんご</strong>を当てて下さい。</p>
<p>それぞれの試行は本アプリの辞書で定められた5文字の<strong>ことのは</strong>であることが必要です。</p>
<p>各試行のたびに文字のタイルの色が変わり、試行した単語に対して評価を行います。</p>
<h2>評価例</h2>
<div class="row">
<div class="display_num word_hit">キ</div>
<div class="display_num word_none">ョ</div>
<div class="display_num word_hit">ウ</div>
<div class="display_num word_none">シ</div>
<div class="display_num word_blow">ツ</div>
</div>
<div style="font-size: 0.9em;">
<p><strong class="hit_ex">「キ・ウ」</strong>はたんごに<strong class="hit_ex">含まれており場所も正しい</strong>です。</p>
<p><strong class="blow_ex">「ツ」</strong>はたんごに含まれているが<strong class="blow_ex">場所が違います</strong>。</p>
<p><strong>「ョ・シ」</strong>はたんごに含まれていません。</p>
<p>この場合の正解のたんごは「急追：キュウツイ」です</p>
</div>
<h2>初めに</h2>
<p>本家<a href="https://www.powerlanguage.co.uk/wordle/" target="_blank">Wordle</a>様より大きな影響を受けて日本語版の Wordle として作成しました。</p>
<p>1日1回遊ぶことが出来る単語推理ゲームです。</p>
<p>答えは全ユーザーで共通です。ネタバレは避けましょう</p>
<p><strong>日本語の特性上本家Wordleよりもだいぶ難易度が高いです</strong>。</p>
<h2>メモ機能</h2>
<p>画面上部のナビゲーションにおける鉛筆をクリックすることでメモ機能をONにできます。<br>メモ機能中ではUIキーボードをクリックすることで「マル・バツ」の目印を設置できます。</p>
<h2>プレイ指南書・作製後感想</h2>
<p>＞ <a href="https://note.com/plumchloride/n/n1fcddc29b00c" target="_blank">note記事</a></p>
<h2>単語更新・辞書データについて</h2>
<p>＞ <a href="https://note.com/plumchloride/n/n8d25cad96348" target="_blank">note記事</a></p>
<h2>重複表示について</h2>
<p>同じ文字を２個、３個使う<strong>ことのは</strong>を入力した際には、答えに含まれる文字数分だけ左から評価の表示を行います。ただし緑ハイライトの場合はその限りではありません。</p>
<p><strong>例：正解のたんごが「シュウカイ」の場合</strong></p>
<div class="row">
<div class="display_num word_hit">シ</div>
<div class="display_num word_none">シ</div>
<div class="display_num word_none">オ</div>
<div class="display_num word_none">ド</div>
<div class="display_num word_none">シ</div>
</div>
<p><strong>例：正解のたんごが「スソナオシ」の場合</strong></p>
<div class="row">
<div class="display_num word_none">シ</div>
<div class="display_num word_none">シ</div>
<div class="display_num word_blow">オ</div>
<div class="display_num word_none">ド</div>
<div class="display_num word_hit">シ</div>
</div>
<p><strong>例：正解のたんごが「アカシヤキ」の場合</strong></p>
<div class="row">
<div class="display_num word_blow">シ</div>
<div class="display_num word_none">シ</div>
<div class="display_num word_none">オ</div>
<div class="display_num word_none">ド</div>
<div class="display_num word_none">シ</div>
</div>
<p><strong>例：正解のたんごが「シュクシャ」の場合</strong></p>
<div class="row">
<div class="display_num word_hit">シ</div>
<div class="display_num word_blow">シ</div>
<div class="display_num word_none">オ</div>
<div class="display_num word_none">ド</div>
<div class="display_num word_none">シ</div>
</div>
<p><strong>例：正解のたんごが「ブンシシキ」の場合</strong></p>
<div class="row">
<div class="display_num word_blow">シ</div>
<div class="display_num word_blow">シ</div>
<div class="display_num word_none">オ</div>
<div class="display_num word_none">ド</div>
<div class="display_num word_none">シ</div>
</div>
<h2>注意</h2>
<p>日本語は単語数が膨大なため、存在する単語でも<strong>ことのは</strong>に登録されていない可能性があります。ご了承下さい。</p>
<p>出題単語に対するフィルタリングを明確には行っていません。本アプリにて出題される単語は「政治・宗教的・性差別・性的」な意図を含みません。</p>
<h2 id="hatena_close" style="cursor: pointer;" onclick="mode_change('game');"><u>説明を閉じる</u></h2>
<hr>
<div></div>
<p><small>たんごは乱数を用いて毎日辞書より生成しています。内部のJavaScriptを解析すると取得出来ますが、そのような行動はお控え下さい。</small></p>
<img alt="クリエイティブ・コモンズ・ライセンス" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
`

const SET_TEXT_EN = `
<h2>Color change</h2>
<p>The resulting color of the text output will not change.</p>
<div id="change_colour">
<label>
<input type="radio" id="colour_0" name="colour" value="0" onclick="ChangeColor('rgb(167,210,141)','rgb(252, 201, 72)')">
<div class="colour_ex_box" style="background-color: rgb(167,210,141);"></div><div class="colour_ex_box" style="background-color: rgb(252, 201, 72);"></div>
</label>
<br>
<label>
<input type="radio" id="colour_1" name="colour" value="1" onclick="ChangeColor('#F5793A','#85C0F9')">
<div class="colour_ex_box" style="background-color: #F5793A;"></div><div class="colour_ex_box" style="background-color: #85C0F9;"></div>
</label>
<br>
<label>
<input type="radio" id="colour_2" name="colour" value="2" onclick="ChangeColor('rgb(115, 145, 97)','rgb(188, 230, 163)')">
<div class="colour_ex_box" style="background-color: rgb(115, 145, 97);"></div><div class="colour_ex_box" style="background-color: rgb(188, 230, 163);"></div>
</label>
</div>
<br>
<h2>Register new words</h2>
<p>If you want to register a new word, please submit it <a href="https://docs.google.com/forms/d/e/1FAIpQLSeqAiw5vTc2a2tA2S4614rF42P4Wi-VF9tyyH6GDrmzaaaanw/viewform?usp=sf_link" target="_blank">Google Form</a>. It may take some time for the new word to be added to the dictionary, but it will be added under certain conditions.</p>
<h2>Data initialization</h2>
<p>Please try it out when you are unable to progress due to a bug or other problem.</p>
<p><span style="text-decoration: underline solid blue;cursor: pointer;font-weight: bold;color: blue;" onclick="DelSet()">Deletion of settings</span>：Remove color and language settings.</p>
<p><span style="text-decoration: underline solid blue;cursor: pointer;font-weight: bold;color: blue;" onclick="DelDay()">Data Deletion</span>：All data will be deleted, except for the statistics. Play data of the day will be deleted, but past data will not be deleted.</p>
<h2>Bug Reports</h2>
<p>If you encounter any bugs and want to share them, please post them <a href="https://github.com/plumchloride/tango/issues/new?assignees=&labels=bug&template=bug_report.md&title=" target="_blank">Issues on GitHub</a>.</p>
<h2>License</h2>
<div style="font-size: 0.9em;">
<p>This work is licensed under the BSD License.<br>This work is also licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) License.</p>
<p>This work also uses software from the following author: The UniDic Consortium "UniDic-cwj_3.1.0" [<a  href = "https://ccd.ninjal.ac.jp/unidic/"target="_blank">https://ccd.ninjal.ac.jp/unidic/</a>].<br>
"UniDic-cwj_3.1.0" is licensed under the BSD License and Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) License.</p>
<p>This work also uses software from the following author: 国立国語研究所(2004)『分類語彙表増補改訂版データベース』(ver.1.0)<br>国立国語研究所(2004)『分類語彙表増補改訂版データベース』(ver.1.0) is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) License.</p>
</div>
<h2>Privacy Policy</h2>
<p>This website uses Google Analytics, a service provided by Google, Inc. This service collects, records, and analyzes the user's visit history. The data collected does not contain any personally identifiable information. The data collected is managed by Google.</p>
<ul>
<li>Google Analytics Terms of Use<br><a href="http://www.google.com/analytics/terms/jp.html" target="_blank">http://www.google.com/analytics/terms/jp.html</a></li>
<li>Google Privacy Policy<br><a href="http://www.google.com/intl/ja/policies/privacy/" target="_blank">http://www.google.com/intl/ja/policies/privacy/</a></li>
</ul>
<p>Data is collected, recorded, and analyzed on this website using an API created by this website to obtain users' response scores. The data collected is only the number of successful or unsuccessful attempts and the date of the game when the results are determined, and does not contain any personally identifiable information. The collected, recorded, and analyzed data may be made public.</p>
<p>By using this site, you grant us permission to use and collect response data via Google Analytics, cookies, and APIs.</p>
<h2>Other</h2>
<p>The code can be found on GitHub below.</p>
<p><a href="https://github.com/plumchloride/tango" target="_blank"><img id="github_img" src="https://gh-card.dev/repos/plumchloride/tango.svg"></a></p>

<div class="flex_center"><small>ことのはたんご ver ${current_version}</small></div>
<br>
<div class="flex_center">
<address>
&copy; 2022 Rikito Ohnishi
</address>
</div>
`
const SET_TEXT_JP = `
<h2>色変更</h2>
<p>結果としてテキスト出力される色は変わりません。</p>
<div id="change_colour">
<label>
<input type="radio" id="colour_0" name="colour" value="0" onclick="ChangeColor('rgb(167,210,141)','rgb(252, 201, 72)')">
<div class="colour_ex_box" style="background-color: rgb(167,210,141);"></div><div class="colour_ex_box" style="background-color: rgb(252, 201, 72);"></div>
</label>
<br>
<label>
<input type="radio" id="colour_1" name="colour" value="1" onclick="ChangeColor('#F5793A','#85C0F9')">
<div class="colour_ex_box" style="background-color: #F5793A;"></div><div class="colour_ex_box" style="background-color: #85C0F9;"></div>
</label>
<br>
<label>
<input type="radio" id="colour_2" name="colour" value="2" onclick="ChangeColor('rgb(115, 145, 97)','rgb(188, 230, 163)')">
<div class="colour_ex_box" style="background-color: rgb(115, 145, 97);"></div><div class="colour_ex_box" style="background-color: rgb(188, 230, 163);"></div>
</label>
</div>
<br>
<h2>新規単語登録</h2>
<p>新規単語を登録したい場合は<a href="https://docs.google.com/forms/d/e/1FAIpQLSeqAiw5vTc2a2tA2S4614rF42P4Wi-VF9tyyH6GDrmzaaaanw/viewform?usp=sf_link" target="_blank">このフォーム</a>から投稿して下さい。反映まで時間をいただくと思いますが、一定の条件のもと辞書に追加いたします。</p>
<h2>データ初期化</h2>
<p>バグ等で進行不能になった際に試しに利用してみてください。</p>
<p><span style="text-decoration: underline solid blue;cursor: pointer;font-weight: bold;color: blue;" onclick="DelSet()">設定削除</span>：色や言語の設定を削除します</p>
<p><span style="text-decoration: underline solid blue;cursor: pointer;font-weight: bold;color: blue;" onclick="DelDay()">データ削除</span>：戦歴以外のすべてのデータを削除します。当日のプレイデータは削除されますが、過去のデータは削除されません。</p>
<h2>バグ報告</h2>
<p>バグ等が発生し共有をしたい場合は<a href="https://github.com/plumchloride/tango/issues/new?assignees=&labels=bug&template=bug_report.md&title=" target="_blank">GitHub上のissues</a>もしくは作者の<a href="https://twitter.com/plum_chloride" target="_blank">Twitter</a>宛てにに投稿して下さい。</p>
<h2>その他</h2>
<p>コードに関しては以下のGitHubに掲載されています。</p>
<p><a href="https://github.com/plumchloride/tango" target="_blank"><img id="github_img" src="https://gh-card.dev/repos/plumchloride/tango.svg"></a></p>
<h2>その他報告</h2>
<p>もし感想を送る場合やバグ報告の際は<a href="https://twitter.com/plum_chloride" target="_blank">こちらのTwitter</a>より連絡して下さい</p>
<h2>ライセンス</h2>
<div style="font-size: 0.9em;">
<p>本アプリケーションは <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">クリエイティブ・コモンズ 表示 - 非営利 - 継承 4.0 国際 ライセンス</a>の下に提供されています。<br>本アプリケーションはくわえて、BSDライセンスの下に提供されています。</p>
<p>また本アプリケーションは次の著作者によるソフトウェアを使用しています：The UniDic Consortium「UniDic-cwj_3.1.0」 [<a  href = "https://ccd.ninjal.ac.jp/unidic/"target="_blank">https://ccd.ninjal.ac.jp/unidic/</a>]<br>
「UniDic-cwj_3.1.0」はBSDライセンスおよびクリエイティブ・コモンズ 表示-非営利-継承4.0 非移植(CC BY-NC-SA 4.0)のもと提供されています。</p>
<p>また本アプリケーションは次の著作者によるソフトウェアを使用しています：国立国語研究所(2004)『分類語彙表増補改訂版データベース』(ver.1.0)<br>国立国語研究所(2004)『分類語彙表増補改訂版データベース』(ver.1.0)はクリエイティブ・コモンズ 表示-非営利-継承4.0 非移植(CC BY-NC-SA 4.0)のもと提供されています。</p>
</div>
<h2>プライバシーポリシー</h2>
<p>　本ウェブサイトにおいて、利用ユーザの訪問状況を把握するためにGoogle社のサービスであるGoogle Analyticsを利用しています。このサービスによりユーザの訪問履歴を収集、記録、分析を行っています。収集されたデータに関しては個人を特定する情報は含まれません。また収集されたデータはGoogle社により管理されています。</p>
<ul>
<li>Google Analytics利用規約<br><a href="http://www.google.com/analytics/terms/jp.html" target="_blank">http://www.google.com/analytics/terms/jp.html</a></li>
<li>Google プライバシーポリシー<br><a href="http://www.google.com/intl/ja/policies/privacy/" target="_blank">http://www.google.com/intl/ja/policies/privacy/</a></li>
</ul>
<p>　本ウェブサイトにおいて、ユーザの回答成績を取得するために本サイトが作成したAPIを用いてデータの収集、記録、分析を行います。収集するデータは結果が確定した際に、何回の試行で成功・失敗したのか及びゲームの出題日のみを取得しており、個人を特定する情報は含まれておりません。収集、集計、分析されたデータは公開する場合があります。</p>
<p>　ユーザは、本サイトを利用することでGoogle Analytics、cookie、APIによる回答データの収集に関して使用及びに許可を与えたものとみなします。</p>
<div class="flex_center"><small>ことのはたんご ver ${current_version}</small></div>
<br>
<div class="flex_center">
<address>
&copy; 2022 Rikito Ohnishi
</address>
</div>
`
// === 英語化 ここまで===


Initialization();
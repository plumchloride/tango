const a_csv_version = "4.0.0";
const q_csv_version = "4.0.0";
const q_csv_path = './public/data/Q_fil_ippan.csv?ver='+q_csv_version;
const a_csv_path = './public/data/A_data_new.csv?ver='+q_csv_version;
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
const hiragana = ["あ","い","う","え","お","か","き","く","け","こ","さ","し","す","せ","そ","た","ち","つ","て","と","な","に","ぬ","ね","の","は","ひ","ふ","へ","ほ",
                "ま","み","む","め","も","や","ゆ","よ","ら","り","る","れ","ろ","わ","を","ん",
                "が","ぎ","ぐ","げ","ご","ざ","じ","ず","ぜ","ぞ","だ","ぢ","づ","で","ど","ば","び","ぶ","べ","ぼ","ぱ","ぴ","ぷ","ぺ","ぽ","ぁ","ぃ","ぅ","ぇ","ぉ","っ","ゃ","ゅ","ょ","ー"];
const katakana = ["ア","イ","ウ","エ","オ","カ","キ","ク","ケ","コ","サ","シ","ス","セ","ソ","タ","チ","ツ","テ","ト","ナ","ニ","ヌ","ネ","ノ","ハ","ヒ","フ","ヘ","ホ",
                "マ","ミ","ム","メ","モ","ヤ","ユ","ヨ","ラ","リ","ル","レ","ロ","ワ","ヲ","ン",
                "ガ","ギ","グ","ゲ","ゴ","ザ","ジ","ズ","ゼ","ゾ","ダ","ヂ","ヅ","デ","ド","バ","ビ","ブ","ベ","ボ","パ","ピ","プ","ペ","ポ","ァ","ィ","ゥ","ェ","ォ","ッ","ャ","ュ","ョ","ー"];

let csv_data = {"q_data":{},"a_data":[]};
let filter_array = []
let game_data = {"now_solve":{"index":0,"row":0},"anser":["　","　","　","　","　"]};
let history ={"anser":[],"hb":[],"hb_text":{"hit":[],"blow":[],"all":[]},"remain":[],"game":{"try_count":0,"win_count":0,"current_streak":0,"max_streak":0,"history":[0,0,0,0,0,0,0,0,0,0]}};
let tango = {"kanzi":"=====","yomi":"====="};
let daily_data = {"pass_day":0};
let wakeup_number = 0;
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

// 関数内ではlet・varによる宣言を利用し、ローカルスコープにする

// ゲーム起動用変数
const Progress = ()=>{
  switch(wakeup_number){
    case 1:
      WakeUpRequest(a_csv_path,"A");
      break;
    case 2:
      filter_array = Array.from(new Set([...csv_data.a_data]));
      csv_data.a_data = Array.from(new Set([...csv_data.a_data]));
      GetTodayWord();
      break;
    case 3:
      CreateKeybord();
      break;
    case 4:
      CreateDisplay();
      break;
    case 5:
      BeforeDataCheck();
      break;
    case 6:
      TodayDataCheck();
      break;
    case 7:
      GetYesterdayTango();
      break;
    case 8:
      setInterval(DisplayTime, 1000);
      flag.wakeup = true;
      break;
    default:
      alert("ERROR2:\n wakeup number is invalid");
      location.reload();
  }
}


// === csv読み込み ===
const WakeUpRequest = (path,mode)=>{
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
    default:
      alert("ERROR1:\n csvmode is invalid");
      location.reload();
  }
}
const SaveArray = (data,mode,env)=>{
  switch(mode){
    case "A":
      csv_data.a_data = data;
      wakeup_number += 1;
      Progress();
      break;
    case "Q":
      csv_data.q_data = data;
      wakeup_number += 1;
      Progress();
      break;
    default:
      alert("ERROR1:\n csvmode is invalid");
      location.reload();
  }
}
// === csv読み込み ここまで ===

// === 今日の単語取得 ===
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
const GetRandom = (Q_data)=>{
  let nowtime = new Date();
  let First_Day = new Date("2022/1/21");
  let timestamp = nowtime - First_Day;
  let pass_day =  Math.floor(timestamp/(24 * 60 * 60 * 1000));
  let year = parseInt(String(nowtime.getFullYear()));
  let month = parseInt(String(nowtime.getMonth()));
  let day = parseInt(String(nowtime.getDate()));
  // console.log(`${year}/${month+1}/${day}`)
  let seed = year+month*801+day*13;
  let rand = new Random(seed,day*2001);
  let random_num = rand.nextInt(0,Q_data["title"].length);
  return [random_num,pass_day];
}
const GetTodayWord = ()=>{
  let [random_num,passday] = GetRandom(csv_data.q_data);
  let title = csv_data.q_data["title"][random_num];
  let pronunciation  = csv_data.q_data["pronunciation"][random_num];
  if(passday == 40){
    title = "十干"
    pronunciation = "ジュッカン"
  }else if(passday == 41){
    title = "プロポーズ"
    pronunciation = "プロポーズ"
  }else if(passday == 42){
    title = "新秋"
    pronunciation = "シンシュウ"
  }else if(passday == 43){
    title = "保育園"
    pronunciation = "ホイクエン"
  }else if(passday == 44){
    title = "参照"
    pronunciation = "サンショウ"
  }else if(passday == 45){
    title = "スキー板"
    pronunciation = "スキーイタ"
  }else if(passday == 46){
    title = "突き当たり"
    pronunciation = "ツキアタリ"
  }else if(passday == 47){
    title = "ガムテープ"
    pronunciation = "ガムテープ"
  }else if(passday == 48){
    title="爪楊枝"
    pronunciation = "ツマヨウジ"
  }else if(passday == 49){
    title="沼沢"
    pronunciation = "ショウタク"
  }
  tango.kanzi = title;
  tango.yomi = pronunciation;
  daily_data.pass_day = passday;
  wakeup_number += 1;
  Progress();
}
// === 今日の単語取得 ここまで ===
// === 昨日の単語取得 ===
const GetRandom_before = ()=>{
  let b_nowtime = new Date();
  let b_yes_time = new Date(b_nowtime.setDate(b_nowtime.getDate() - 1));
  let b_year = parseInt(String(b_yes_time.getFullYear()));
  let b_month = parseInt(String(b_yes_time.getMonth()));
  let b_day = parseInt(String(b_yes_time.getDate()));
  let b_seed = b_year+b_month*801+b_day*13;
  let b_rand = new Random(b_seed,b_day*2001);
  let b_random_num = b_rand.nextInt(0,csv_data.q_data["title"].length);
  return b_random_num;
}
// 昨日の単語
const GetYesterdayTango = ()=>{
  let random_num = GetRandom_before();
  let b_title = csv_data.q_data["title"][random_num];
  let b_pronunciation  = csv_data.q_data["pronunciation"][random_num];
  if(daily_data.pass_day == 41){
    b_title = "十干"
    b_pronunciation = "ジュッカン"
  }else if(daily_data.pass_day == 42){
    b_title = "プロポーズ"
    b_pronunciation = "プロポーズ"
  }else if(daily_data.pass_day == 43){
    b_title = "新秋"
    b_pronunciation = "シンシュウ"
  }else if(daily_data.pass_day == 44){
    b_title = "保育園"
    b_pronunciation = "ホイクエン"
  }else if(daily_data.pass_day == 45){
    b_title = "参照"
    b_pronunciation = "サンショウ"
  }else if(daily_data.pass_day == 46){
    b_title = "スキー板"
    b_pronunciation = "スキーイタ"
  }else if(daily_data.pass_day == 47){
    b_title = "突き当たり"
    b_pronunciation = "ツキアタリ"
  }else if(daily_data.pass_day == 48){
    b_title = "ガムテープ"
    b_pronunciation = "ガムテープ"
  }else if(daily_data.pass_day == 49){
    b_title="爪楊枝"
    b_pronunciation = "ツマヨウジ"
  }else if(daily_data.pass_day == 50){
    b_title="沼沢"
    b_pronunciation = "ショウタク"
  }
  document.getElementById("before_tango").innerText = `「${b_title}」（${b_pronunciation}）`
  wakeup_number += 1;
  Progress();
}
// === 昨日の単語取得 ここまで ===

// === 残り候補数表示機能 ===
const CheckRemaining_all = (progress_re = false) =>{
  if(!filter_array | filter_array.length == 0){
    alertShow("バグです。動作に一部影響が出ています。\n Error3: The number of remaining words is empty",2000);
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
  history_of_hb.forEach((element,index)=>{
    // 各試行
    hit_blow_list = []
    element.forEach((e,index2)=>{
      // 各文字の評価(HIT BLOW)
      if(e == "BLOW"){
        filter_array = filter_array.filter((word)=>history_of_anser[index][index2] != word[index2]);
        if(hit_blow_list.includes(history_of_anser[index][index2])){
          // HIT or BLOWが同じ試行で同じたんごに対して、2個出た場合
          filter_array = filter_array.filter((word) => word.indexOf(history_of_anser[index][index2]) != word.lastIndexOf(history_of_anser[index][index2]));
        }
        hit_blow_list.push(history_of_anser[index][index2]);
      }else if(e == "NO" & history_of_hb_text["blow"].includes(history_of_anser[index][index2])){
        // 二重処理の場合,NOの箇所に含んでいない
        filter_array = filter_array.filter((word)=>history_of_anser[index][index2] != word[index2]);
      }else if(e == "HIT"){
        filter_array = filter_array.filter((word)=>history_of_anser[index][index2] == word[index2]);
        if(hit_blow_list.includes(history_of_anser[index][index2])){
          // HIT or BLOWが同じ試行で同じたんごに対して、2個出た場合
          filter_array = filter_array.filter((word) => word.indexOf(history_of_anser[index][index2]) != word.lastIndexOf(history_of_anser[index][index2]));
        }
        hit_blow_list.push(history_of_anser[index][index2]);
      }else if(e == "NO" & history_of_hb_text["hit"].includes(history_of_anser[index][index2])){
        // 二重処理の場合,NOの箇所に含んでいない
        filter_array = filter_array.filter((word)=>history_of_anser[index][index2] != word[index2]);
      }
    })
  });

  RemainShow(filter_array.length);
  if(progress_re){
    history.remain.push(filter_array.length);
    localStorage.setItem("remain", JSON.stringify(history.remain));
  };
}
// === 残り候補数表示機能 ここまで ===

// === webstorage ===
const BeforeDataCheck = ()=>{
  // ゲームの経験者かつ30日以内にプレイしている場合、画面遷移
  if(localStorage.getItem("experience")){
    if((daily_data.pass_day-localStorage.getItem("pass_day")) >30){
      return;
    }else{
      mode_change("game");
    };
  }

  // ゲームのプレイ履歴がない場合はデータを作成し、ある場合は取得する
  if(localStorage.getItem("history_of_game") != null){
    history.game = JSON.parse(localStorage.getItem("history_of_game"));
  }
  ShowHistory(history.game);

  // 言語の取得
  if(localStorage.getItem("lang") == null){
    localStorage.setItem("lang", flag.lang_en);
  }else if(localStorage.getItem("lang")| localStorage.getItem("lang") == "true" ){
    changeLang();// 英語
  }else{
    ;// 日本語
  }

  // 色調調整
  if(localStorage.getItem("color") == null){
    localStorage.setItem("color", JSON.stringify(current_color));
    ChangeColor(...current_color);
  }else{
    current_color = JSON.parse(localStorage.getItem("color"));
    ChangeColor(...current_color);
  }

  wakeup_number += 1;
  Progress();
}
const TodayDataCheck = ()=>{
  // 今日のデータがある場合
  if(localStorage.getItem("pass_day")==daily_data.pass_day){
    var _now_solve = JSON.parse(localStorage.getItem("now_solve"));

    // アプデ後日付変更で更新
    // game_data.now_solve = JSON.parse(localStorage.getItem("now_solve"));
    if(_now_solve.index == undefined){
      game_data.now_solve.index = _now_solve.text;
      game_data.now_solve.row = _now_solve.row;
      console.log("error")
    }else{
      game_data.now_solve = _now_solve;
    }

    history.hb_text = JSON.parse(localStorage.getItem("history_of_hb_text"));
    history.hb = JSON.parse(localStorage.getItem("history_of_hb"));
    history.anser = JSON.parse(localStorage.getItem("history_of_anser"));

    // こちらもバージョンアップ後数日で変更
    if(JSON.parse(localStorage.getItem("flag")) == null){
      var fin = JSON.parse(localStorage.getItem("fin"));
      if(["正解です","You're correct","正解しました"].includes(fin.text)){
        flag.game_end = true;
        flag.game_win = true;
      }else  if(["不正解です","You're Incorrect"].includes(fin.text)){
        flag.game_end = true;
        flag.game_win = false;
      }else{
        flag.game_end = false;
        flag.game_win = false;
      }
    }else{
      localStorage.removeItem("fin");
      var _flag = JSON.parse(localStorage.getItem("flag"));
      flag.game_end = _flag.game_end;
      flag.game_win = _flag.game_win;
      flag.remain_show = _flag.remain_show;
    }

    // 残り候補数推移
    if(localStorage.getItem("remain") != null){
      history.remain = JSON.parse(localStorage.getItem("remain"));
    }

    for(let i = 0;i < game_data.now_solve.row;i++){
      EvaluateUpdate(i);
    }
    ValueUpdate();
    DisplayUpdate();
    if(flag.game_end){
      End();
    }
  }else{
    RemainShow(filter_array.length);
    DisplayUpdate();
  }

  wakeup_number += 1;
  Progress();
}
// === webstorage ここまで ===

// === 回答評価機能 ===
document.getElementById("Decision_button").addEventListener("click",(e)=>{
  if(flag.game_end){return};
  var check = false
  // 値の改変やバグチェック
  if(!flag.wakeup){
    alert("バグ、もしくは不正な操作です。リロードします。\n Error1: Not wake up")
    check = true;
    location.reload();
    return;
  }else if(!(game_data.anser.length == 5)){
    alert("バグ、もしくは不正な操作です。リロードします。\n Error2: The length of the entered character is incorrect")
    check = true;
    location.reload();
    return;
  }
  // 異なる文字が入力されていないかチェック。
  game_data.anser.forEach((element)=>{
    if(hiragana.includes(element) | katakana.includes(element)){
      ;
    }else{
      if(flag.lang_en){
        alertShow('Attention\nNot enough letter or use only (hiragana or katakana)',2000);
      }else{
        alertShow("注意\n入力した「たんご」はひらがな・カタカナの5文字のみです",2000);
      };
      check = true;
      return;
    }
  });

  // 入力単語が実在しているかのチェック
  var kotonoha = game_data.anser.toString().replace(/,/g, "")
  if(check){
    // 前項でエラー処理済み
    return;
  }else if(csv_data.a_data.includes(kotonoha)){
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
  // 前項でエラー処理済み
  if(check){
    return
  }

  // ヒットアンドブロー処理
  var hb_yomi = tango.yomi.split("");
  var h_word = [];
  var b_word = [];
  var not_word = [];
  var hb_list = ["NO","NO","NO","NO","NO"];
  var hit_count = 0;
  game_data.anser.forEach((element,index)=>{
    if(element == hb_yomi[index]){
      // hit
      h_word.push(element);
      hb_list[index] = "HIT";
      hit_count += 1;
    }else if(hb_yomi.includes(element)){
      // blow
      b_word.push(element);
      hb_list[index] = "BLOW";
    }else{
      not_word.push(element);
    }
  });

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
  localStorage.setItem("now_solve", JSON.stringify(game_data.now_solve));
  localStorage.setItem("history_of_hb_text", JSON.stringify(history.hb_text));
  localStorage.setItem("history_of_hb", JSON.stringify(history.hb));
  localStorage.setItem("history_of_anser", JSON.stringify(history.anser));
  localStorage.setItem("pass_day", daily_data.pass_day);
  localStorage.setItem("flag", JSON.stringify({"game_end":false,"game_win":false,"remain_show":flag.remain_show}));

  // 画面更新 エラー確認
  // remaing_check
  var remaing_check_tf = false;
  if(!filter_array){
    alertShow("バグです。動作に一部影響が出ています。\n Error3: The number of remaining words is not defined",2000)
  }else{
    remaing_check_tf = true;
  }
  sleep_time = 0;
  if(hit_count == 5 | game_data.now_solve.row == 10){
    sleep_time = 500;
    window.scroll({top: 0, behavior: 'smooth'});
  }
  EvaluateUpdate(game_data.now_solve.row -1,sleep_time,remaing_check_tf);
  ValueUpdate();
  DisplayUpdate();


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
// === 回答評価機能 ここまで ===

// === 評価画面反映・重複処理 ===
const EvaluateUpdate = (row,sleep_time = 0,remain_tf_up = false) =>{
  RemoveSolveHighlight(row);
  var _row_hb = Array.from(history.hb[row]);
  var row_text = history.anser[row];
  // 重複判別用set
  var row_text_array = row_text.split("");
  var row_text_set = new Set(row_text_array);
  var pr_array = tango.yomi.split("");
  var pr_set = new Set(pr_array);

  if(row_text_set.size != row_text_array.length){
    // 回答に重複あり
    if(pr_set.size != pr_array.length){
      // 答えに重複あり
      var ans_dupli = serchDupli(pr_array);
      switch (row_text_array.length-row_text_set.size){
        case 1:
          _row_hb = Dupli_1(ans_dupli,_row_hb,row_text_array,pr_array);
          break;
        case 2:
          if(serchDupli(row_text_array).length == 2){
            serchDupli(row_text_array).forEach((element)=>{
              _row_hb = Dupli_1(ans_dupli,_row_hb,row_text_array,pr_array,true,element);
            })
          }else{
            _row_hb = Dupli_2(ans_dupli,_row_hb,row_text_array,pr_array);
          }
          break;
        default:
          console.log("ddNone");
      }
    }else{
      // 答えに重複ナシ
      switch (row_text_array.length-row_text_set.size){
        case 1:
          _row_hb = Dupli_1([" "],_row_hb,row_text_array,pr_array);
          break;
        case 2:
          if(serchDupli(row_text_array).length == 2){
            serchDupli(row_text_array).forEach((element)=>{
              _row_hb = Dupli_1([" "],_row_hb,row_text_array,pr_array,true,element);
            })
          }else{
            _row_hb = Dupli_2([" "],_row_hb,row_text_array,pr_array);
          }
          break;
        default:
          console.log("ndNone");
      }
    }
  }
  //上記仕組みをストレージに反映
  history.hb[row] = _row_hb;
  localStorage.setItem("history_of_hb", JSON.stringify(history.hb));


  // ディスプレイ反映
  if(sleep_time == 0){
    for(let i = 0;i<5;i++){
      document.getElementById("dis-"+String(row)+"-"+String(i)).innerText = row_text[i];
      if(_row_hb[i] == "HIT"){
        document.getElementById("dis-"+String(row)+"-"+String(i)).classList.add("word_hit");
      }else if(_row_hb[i] == "BLOW"){
        document.getElementById("dis-"+String(row)+"-"+String(i)).classList.add("word_blow");
      }else{
        document.getElementById("dis-"+String(row)+"-"+String(i)).classList.add("word_none");
      }
    }
  }else{
    setTimeout(answer_production,sleep_time,_row_hb,row,0,sleep_time,row_text);
  }

  // キーボード反映
  Array.from(new Set(history.hb_text["all"])).forEach((element)=>{
    document.getElementById("btn_"+element).classList.add("word_none");
  })
  Array.from(new Set(history.hb_text["blow"])).forEach((element)=>{
    document.getElementById("btn_"+element).classList.remove("word_none");
    document.getElementById("btn_"+element).classList.add("word_blow");
  })
  Array.from(new Set(history.hb_text["hit"])).forEach((element)=>{
    document.getElementById("btn_"+element).classList.remove("word_none");
    document.getElementById("btn_"+element).classList.remove("word_blow");
    document.getElementById("btn_"+element).classList.add("word_hit");
  })

  if(!filter_array){
    alertShow("バグです。動作に一部影響が出ています。\n Error3: The number of remaining words is not defined",2000)
  }else{
    CheckRemaining_all(remain_tf_up);
  }
}

const answer_production = (hb,row,index,time,row_text)=>{
  document.getElementById("dis-"+String(row)+"-"+String(index)).innerText = row_text[index];
  if(hb[index] == "HIT"){
    document.getElementById("dis-"+String(row)+"-"+String(index)).classList.add("word_hit");
  }else if(hb[index] == "BLOW"){
    document.getElementById("dis-"+String(row)+"-"+String(index)).classList.add("word_blow");
  }else{
    document.getElementById("dis-"+String(row)+"-"+String(index)).classList.add("word_none");
  }
  if(index < 4){
    setTimeout(answer_production,time,hb,row,index+1,time,row_text);
  }
}
// 重複をリストで変換
const serchDupli = (ar)=>{
  return ar.filter(function (val, idx, arr){
    return arr.indexOf(val) === idx && idx !== arr.lastIndexOf(val);
})};
// 重複管理
const Dupli_1 = (pr_du_array,HB_array,Ans_array,pre_array,du=false,word=undefined)=>{
  var Du = ""
  if(du){
    Du = word;
  }else{
    Du = serchDupli(Ans_array);
  };
  if(!pre_array.includes(String(Du))){
    // そもそも重複した箇所が回答と関係ない
    return HB_array;
  }else if(pr_du_array.includes(String(Du))){
    // 回答が重複していて、文字も重複している場合はそのまま出力
    return HB_array;
  }else if(pre_array.includes(String(Du))){
    if(HB_array[Ans_array.lastIndexOf(String(Du))] == "HIT"){
      // 後ろがHIT => 前を消す
      index = Ans_array.indexOf(String(Du));
      HB_array[index] = "NO";
      return HB_array;
    }else if(HB_array[Ans_array.indexOf(String(Du))] == "HIT"){
      // 前がHIT => 後ろを消す
      index = Ans_array.lastIndexOf(String(Du));
      HB_array[index] = "NO";
      return HB_array;
    }else{
      // 両方BLOW => 後ろを消す
      index = Ans_array.lastIndexOf(String(Du));
      HB_array[index] = "NO";
      return HB_array;
    }
  }else{
    console.log("想定外")
  }
}
const Dupli_2 = (pr_du_array,HB_array,Ans_array,pre_array)=>{
  var Du = serchDupli(Ans_array);
  if(!pre_array.includes(String(Du))){
    // そもそも重複した箇所が回答と関係ない
    return HB_array;
  }else if(pr_du_array.includes(String(Du))){
    // 回答が重複していて、文字も重複している場合
    if(serchDupli(pr_du_array).length == 2){
      // 文字の欠損が2+2文字の場合
      f_index = Ans_array.indexOf(String(Du));
      m_index = Ans_array.indexOf(String(Du),f_index+1);
      l_index = Ans_array.lastIndexOf(String(Du));
      index_list = [f_index,m_index,l_index];
      hb_3_list = [HB_array[index_list[0]],HB_array[index_list[1]],HB_array[index_list[2]]];
      HB_array[index_list[hb_3_list.lastIndexOf("BLOW")]] = "NO";
      return HB_array;

    }else if(pre_array.length - new Set(pre_array).size == 2){
      // 文字の欠損が３文字の場合そのまま出力
      return HB_array;
    }else{
      // 文字の欠損が２文字の場合
      f_index = Ans_array.indexOf(String(Du));
      m_index = Ans_array.indexOf(String(Du),f_index+1);
      l_index = Ans_array.lastIndexOf(String(Du));
      index_list = [f_index,m_index,l_index];
      hb_3_list = [HB_array[index_list[0]],HB_array[index_list[1]],HB_array[index_list[2]]];
      HB_array[index_list[hb_3_list.lastIndexOf("BLOW")]] = "NO";
      return HB_array;
    }
  }else if(pre_array.includes(String(Du))){
    // 答えに３文字の単語が１個のみ用いられている場合
    f_index = Ans_array.indexOf(String(Du));
    m_index = Ans_array.indexOf(String(Du),f_index+1);
    l_index = Ans_array.lastIndexOf(String(Du));
    index_list = [f_index,m_index,l_index];
    hb_3_list = [HB_array[index_list[0]],HB_array[index_list[1]],HB_array[index_list[2]]];
    HB_array[index_list[hb_3_list.lastIndexOf("BLOW")]] = "NO";
    hb_3_list[hb_3_list.lastIndexOf("BLOW")] = "NO";
    HB_array[index_list[hb_3_list.lastIndexOf("BLOW")]] = "NO";
    return HB_array
  }else{
    console.log("想定外")
  }
}
// === 評価画面反映・重複処理 ここまで ===

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
  // このゲームの経験者であることを伝える
  localStorage.setItem("experience", true);

  // 今日初めての終了の場合データの更新を行う
  // アプデ後修正
  if(JSON.parse(localStorage.getItem("flag")) == null){
    var win_b_tf = JSON.parse(localStorage.getItem("fin")).tf;
  }else{
    var win_b_tf = JSON.parse(localStorage.getItem("flag")).game_end;
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
    localStorage.setItem("history_of_game", JSON.stringify(history.game));
  }

  // 戦歴表示
  ShowHistory(history.game);

  // 終了したことをwebstorageに伝える
  localStorage.setItem("flag", JSON.stringify({"game_end":flag.game_end,"game_win":flag.game_win,"remain_show":flag.remain_show}))
  // 文字変更
  document.getElementById("result").innerText = win_tx
  document.getElementById("result_answer").innerText = `たんご：「${tango.kanzi}」（${tango.yomi}）`
  document.getElementById("result_answer").classList.remove("non_visi");
  // グラフ画面起動
  mode_change("bar");
}
// === game終了処理 ここまで ===

// === UI作製 ===
const CreateKeybord = ()=>{
  let $keybord = document.getElementById("keybord");
  let element_array = [];
  for(let i = 0;i<10;i++){
    // <hr>を入れた後
    if(i >= 5){
      if(i == 5){
        element_array.push(document.createElement("hr"))
        element_array[5].setAttribute("id","keybord_hr")
      };
      element_array.push(document.createElement("div"));
      element_array[i+1].setAttribute("class","row bt_ga");
      for(let z = 0;z<10;z++){
        element_array[i+1].appendChild(document.createElement("button"));
        element_array[i+1].childNodes[z].innerText = KEYBORD_LIST[i][z];
        if(KEYBORD_LIST[i][z] == "　"){
          element_array[i+1].childNodes[z].setAttribute("class","space_bt");
          element_array[i+1].childNodes[z].setAttribute("disabled","True");
        }else if(["←","→","del"].includes(KEYBORD_LIST[i][z])){
          element_array[i+1].childNodes[z].setAttribute("class","func_bt");
          element_array[i+1].childNodes[z].setAttribute("onclick","FuncButton('"+KEYBORD_LIST[i][z]+"');")
        }else{
          element_array[i+1].childNodes[z].setAttribute("class","key_bt");
          element_array[i+1].childNodes[z].setAttribute("id","btn_"+KEYBORD_LIST[i][z]);
          element_array[i+1].childNodes[z].setAttribute("onclick","KeybordButton('"+KEYBORD_LIST[i][z]+"');");
        }
      };
      // 入れる前
    }else{
      element_array.push(document.createElement("div"));
      element_array[i].setAttribute("class","row bt_normal");
      for(let z = 0;z<10;z++){
        element_array[i].appendChild(document.createElement("button"));
        element_array[i].childNodes[z].innerText = KEYBORD_LIST[i][z];
        if(KEYBORD_LIST[i][z] == "　"){
          element_array[i].childNodes[z].setAttribute("class","space_bt");
          element_array[i].childNodes[z].setAttribute("disabled","True");
        }else{
          element_array[i].childNodes[z].setAttribute("class","key_bt");
          element_array[i].childNodes[z].setAttribute("id","btn_"+KEYBORD_LIST[i][z]);
          element_array[i].childNodes[z].setAttribute("onclick","KeybordButton('"+KEYBORD_LIST[i][z]+"');");
        }
      };
    }
  };
  element_array.forEach((element)=>{
    $keybord.appendChild(element);
  })
  wakeup_number += 1;
  Progress();
};
const CreateDisplay = ()=>{
  var $display = document.getElementById("eval_display");
  var element_array = [];
  for(let i = 0;i<5;i++){
    element_array.push(document.createElement("div"));
    element_array[i].setAttribute("class","row");
    element_array[i].setAttribute("id","dis-row-"+String(i));
    for(let z = 0;z<10;z++){
      if(z<5){
        element_array[i].appendChild(document.createElement("div"));
        element_array[i].childNodes[z].setAttribute("class","display_num");
        element_array[i].childNodes[z].setAttribute("id","dis-"+String(i)+"-"+String(z));
      }else{
        element_array[i].appendChild(document.createElement("div"));
        element_array[i].childNodes[z].setAttribute("class","display_num right_display");
        element_array[i].childNodes[z].setAttribute("id","dis-"+String(i+5)+"-"+String(z-5));
      }
    }
  }
  element_array.forEach((element)=>{
    $display.appendChild(element);
  })
  wakeup_number += 1;
  Progress();
}
// 戦歴表示機能
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
// === UI作製 ここまで ===

// === UIクリックイベント ===
const KeybordButton = (character)=>{
  game_data.anser[game_data.now_solve.index] = character;
  if(game_data.now_solve.index <4){
    game_data.now_solve.index += 1;
  }
    DisplayUpdate();
    ValueUpdate();
}
const FuncButton = (key)=>{
  var gni = game_data.now_solve.index;
  switch(key){
    case "←":
      if(gni > 0){
        game_data.now_solve.index -= 1;
        DisplayUpdate();
      }
      break;
    case "→":
      if(gni <4){
        game_data.now_solve.index += 1;
        DisplayUpdate();
      }
      break;
    case "del":
      if(game_data.anser[gni] == "　" & gni > 0){
        game_data.anser[gni -1] = "　";
      }else{
        game_data.anser[gni] = "　";
      }
      if(gni > 0){
        game_data.now_solve.index -= 1;
      }
      DisplayUpdate();
      ValueUpdate();
      break;
    default:
      alert("ERROR3:\n keyname is invalid");
      location.reload();
  }
}
// graph コピー機能及びツイート機能
// コピー クリップボードに送信
document.getElementById("graph_copy").addEventListener("click",(element)=>{
  var promise = navigator.clipboard.writeText(createEmoji(false,HTML_element.remain_toggle.checked));
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
const tweet_btn = (url_flag) => {
  s = createEmoji(url_flag,HTML_element.remain_toggle.checked);
  if (s != "") {
    s = encodeURIComponent(s);
    //投稿画面を開く
    url = "https://twitter.com/intent/tweet?text=" + s;
    window.open(url,"_blank");
    }
}
// 閉じるボタンでもgraphを閉じられるように
document.getElementById("graph_close").addEventListener("click",(el)=>{
  mode_change("game");
});
// 残り単語数推移機能のオンオフ検知(チェックボタン)
const RemainToggleChange = ()=>{
  HTML_element.emoji_place.innerText = createEmoji(false,HTML_element.remain_toggle.checked);
};
// ディスプレイクリック
const displayClick = (e)=>{
  game_data.now_solve.index = parseInt(e.target.id.slice(-1));
  RemoveSolveHighlight();
  SolvHighlight();
}
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
  localStorage.setItem("color", JSON.stringify(current_color));
}
// キーボード変更
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
  localStorage.setItem("flag", JSON.stringify({"game_end":false,"game_win":false,"remain_show":flag.remain_show}));
}
// === UIクリックイベント ここまで ===

// === 画面表示操作 ===
// 全画面非表示
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
// 入力した値のアップデート
const ValueUpdate = ()=>{
  if(flag.game_end){return};
  // すべて空白だった場合は入力欄を空に
  var all_space=true;
  game_data.anser.forEach((element)=>{
    if(!(element == "　")){
      all_space = false;
    }
  });
  if(all_space){
    HTML_element.input_text.value = "";
  }else{
    // そうでない場合は全角スペースを残す
    HTML_element.input_text.value = game_data.anser.slice(0,5).toString().replace(/,/g, "")
  }
}
// ディスプレイのアップデート
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
const RemoveSolveHighlight = (row = game_data.now_solve.row)=>{
  for(let i = 0;i < 5;i++){
    document.getElementById("dis-"+String(row)+"-"+String(i)).classList.remove("row_now_solve");
    document.getElementById("dis-"+String(row)+"-"+String(i)).classList.remove("now_solve");
    document.getElementById("dis-"+String(row)+"-"+String(i)).removeEventListener("click",displayClick);
    }
  }
const DisplayUpdate = (row = game_data.now_solve.row)=>{
  if(flag.game_end){return};
  RemoveSolveHighlight();
  SolvHighlight();
  game_data.anser.forEach((element,index)=>{
    document.getElementById("dis-"+String(row)+"-"+String(index)).innerText = element;
  });
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
// 今日の単語時間表示
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
    document.getElementById("time_left").innerHTML = "<strong>第"+String(daily_data.pass_day)+"回</strong>　今日の単語 残り："+time_left;
  }
}
// === 画面表示操作 ===

// === 英語化 ===
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
    change_graph_lang(["今日は正解していません","コピー","ツイート","URL付きでツイート","戦歴","プレイ<br>回数","勝率","現在の<br>連勝数","最大<br>連勝数","正解分布表示","<u>閉じる</u>","正解です","不正解です","　残り候補数推移"])
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
    change_graph_lang(["Not yet correct today","Copy","Tweet","Tweet with URL","STATISTICS","Play<br>times","Win%","Current<br>Streak","Max<br>Streak","GUESS DISTRIBUTION","<u>close</u>","You're correct","You're Incorrect","　transition of remaining words"])
  }
  // 現在の言語を保存
  localStorage.setItem("lang", flag.lang_en);
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
<p>The letter <strong class="blow_ex">「シ」</strong> is <strong class="blow_ex">in word but in the wrong spot</strong>。</p>
<p>The letter <strong>「ョ・ツ」</strong> is not in the word.</p>
<p>In this case, the correct tango is 「急追：キュウツイ」.</p>
</div>
<h2>In the beginning</h2>
<p>I was greatly inspired by <a href="https://www.powerlanguage.co.uk/wordle/" target="_blank">Wordle</a> to create this app.</p>
<p>This is a word guessing game that can be played once a day.</p>
<p>The answer is the same for all users. Let's avoid spoilers.</p>
<p>Due to the nature of the Japanese language, <strong>it is tremendously more difficult than Wordle</strong>.</p>
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
<div class="display_num word_none">オ</div>
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
<div class="display_num word_none">オ</div>
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
<h2>License</h2>
<div style="font-size: 0.9em;">
<p>This work is licensed under the BSD License.<br>This work is also licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) License.</p>
<p>This work also uses software from the following author: The UniDic Consortium "UniDic-cwj_3.1.0" [<a  href = "https://ccd.ninjal.ac.jp/unidic/"target="_blank">https://ccd.ninjal.ac.jp/unidic/</a>].<br>
"UniDic-cwj_3.1.0" is licensed under the BSD License and Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) License.</p>
<p>This work also uses software from the following author: 国立国語研究所(2004)『分類語彙表増補改訂版データベース』(ver.1.0)<br>国立国語研究所(2004)『分類語彙表増補改訂版データベース』(ver.1.0) is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) License.</p>
</div>
<h2>Bug Reports</h2>
<p>If you encounter any bugs and want to share them, please post them <a href="https://github.com/plumchloride/tango/issues/new?assignees=&labels=bug&template=bug_report.md&title=" target="_blank">Issues on GitHub</a>.</p>
<h2>Other</h2>
<p>The code can be found on GitHub below.</p>
<p><a href="https://github.com/plumchloride/tango" target="_blank"><img id="github_img" src="https://gh-card.dev/repos/plumchloride/tango.svg"></a></p>

<div class="flex_center"><small>ことのはたんご ver 3.2.0</small></div>
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
<h2>バグ報告</h2>
<p>バグ等が発生し共有をしたい場合は<a href="https://github.com/plumchloride/tango/issues/new?assignees=&labels=bug&template=bug_report.md&title=" target="_blank">GitHub上のissues</a>もしくは作者の<a href="https://twitter.com/plum_chloride" target="_blank">Twitter</a>宛てにに投稿して下さい。</p>
<h2>ライセンス</h2>
<div style="font-size: 0.9em;">
<p>本アプリケーションは <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">クリエイティブ・コモンズ 表示 - 非営利 - 継承 4.0 国際 ライセンス</a>の下に提供されています。<br>本アプリケーションはくわえて、BSDライセンスの下に提供されています。</p>
<p>また本アプリケーションは次の著作者によるソフトウェアを使用しています：The UniDic Consortium「UniDic-cwj_3.1.0」 [<a  href = "https://ccd.ninjal.ac.jp/unidic/"target="_blank">https://ccd.ninjal.ac.jp/unidic/</a>]<br>
「UniDic-cwj_3.1.0」はBSDライセンスおよびクリエイティブ・コモンズ 表示-非営利-継承4.0 非移植(CC BY-NC-SA 4.0)のもと提供されています。</p>
<p>また本アプリケーションは次の著作者によるソフトウェアを使用しています：国立国語研究所(2004)『分類語彙表増補改訂版データベース』(ver.1.0)<br>国立国語研究所(2004)『分類語彙表増補改訂版データベース』(ver.1.0)はクリエイティブ・コモンズ 表示-非営利-継承4.0 非移植(CC BY-NC-SA 4.0)のもと提供されています。</p>
</div>
<h2>その他</h2>
<p>コードに関しては以下のGitHubに掲載されています。</p>
<p><a href="https://github.com/plumchloride/tango" target="_blank"><img id="github_img" src="https://gh-card.dev/repos/plumchloride/tango.svg"></a></p>
<h2>その他報告</h2>
<p>もし感想を送る場合やバグ報告の際は<a href="https://twitter.com/plum_chloride" target="_blank">こちらのTwitter</a>より連絡して下さい</p>
<div class="flex_center"><small>ことのはたんご ver 3.2.0</small></div>
<br>
<div class="flex_center">
<address>
&copy; 2022 Rikito Ohnishi
</address>
</div>
`
// === 英語化 ここまで===


// === その他 ===
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
  DisplayUpdate();
})
// 絵文字（戦歴コピー）作製
const createEmoji = (url_flag,rem_flag)=>{
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
  if(flag.game_win){
    base_text = "ことのはたんご 第"+String(daily_data.pass_day)+"回  "+String(game_data.now_solve.row)+"/10\r\n"
  }else if(game_data.now_solve.row == 10){
    base_text = "ことのはたんご 第"+String(daily_data.pass_day)+"回  X/10\r\n"
  }else{
    base_text = "ことのはたんご 第"+String(daily_data.pass_day)+"回  "+String(game_data.now_solve.row)+"/10\r\n"
  }
  if(url_flag){
    base_text += "https://plum-chloride.jp/kotonoha-tango/index.html \r\n"
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
// アラート用
const alertShow = (text,time = 1000)=>{
  document.getElementById("alert").classList.remove("non_visi")
  document.getElementById("alert_text").innerText = text
  setTimeout(()=>{document.getElementById("alert").classList.add("non_visi")},time);
}
// === その他 ここまで ===

// === デバッグ用 ===
const AllConsole = ()=>{
  console.log("csv_data");
  console.log(csv_data);
  console.log("tango");
  console.log(tango);
  console.log("daily_data");
  console.log(daily_data);
  console.log("wakeup_number");
  console.log(wakeup_number);
  console.log("flag");
  console.log(flag);
  console.log("game_data");
  console.log(game_data);
  console.log("history")
  console.log(history)
}
// == デバッグ用 ここまで ===





// ゲームスタート
WakeUpRequest(q_csv_path,"Q");
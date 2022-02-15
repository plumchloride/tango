end_tf = false;
copy_win = false; // 結果コピーに使う
history_of_game = {"try_count":0,"win_count":0,"current_streak":0,"max_streak":0,"history":[0,0,0,0,0,0,0,0,0,0]}
const end = (text,win=0)=>{
  win_tx = ["正解です","You're correct","正解しました"]
  if(win_tx.includes(text)){
    win = 1
  }
  if(win == 1){
    copy_win = true;
  }
  // このゲームの経験者であることを伝える
  localStorage.setItem("experience", true);

  // 今日初めての終了の場合データの更新を行う
  if(!JSON.parse(localStorage.getItem("fin")).tf){
    history_of_game.try_count += 1;
    // 勝利の場合
    if(win == 1){
      history_of_game.win_count += 1;
      history_of_game.current_streak += 1;
      if(history_of_game.current_streak>history_of_game.max_streak){
        history_of_game.max_streak = history_of_game.current_streak;
      }
      history_of_game.history[now_solve.row -1] += 1;
    }else{
      history_of_game.current_streak = 0;
    }
    localStorage.setItem("history_of_game", JSON.stringify(history_of_game));
  }

  // 戦歴表示
  showHistory(history_of_game);

  // 終了したことをwebstorageに伝える
  localStorage.setItem("fin", JSON.stringify({"tf":true,"text":text}))
  end_tf = true;
  // 文字変更
  document.getElementById("result").innerText = text
  document.getElementById("result_answer").innerText = `たんご：「"${title}"」（"${pronunciation}"）`
  // グラフ画面起動
  mode = "bar"
  allNonVisi();
  Object.keys(img_show).forEach((key) => {
    if(key == mode){
      img_show[key] = true;
    }else{
      img_show[key] = false;
    }
  });
  $div[mode].classList.remove("non_visi");
  $img_btn[mode].setAttribute("src",src.batu);
  if(mode == "bar"){
    $div["body"].classList.remove("non_visi");
    document.getElementById("emoji_place").innerText = createEmoji();
    document.getElementById("emoji_place_re").innerText = createEmoji(false,true);
  }
}

const createEmoji = (URL = false,rem = false)=>{
  // エラー処理
  _remain = [...remain_history]
  if(history_of_hb.length != _remain.length){
    missnum = history_of_hb.length - _remain.length
    minn_array = Array(missnum);
    minn_array.fill(NaN);
    _remain.unshift(...minn_array);
  }

  if(copy_win){
    base_text = "ことのはたんご 第"+String(pass_day)+"回  "+String(now_solve.row)+"/10\r\n"
  }else if(now_solve.row == 10){
    base_text = "ことのはたんご 第"+String(pass_day)+"回  X/10\r\n"
  }else{
    base_text = "ことのはたんご 第"+String(pass_day)+"回  "+String(now_solve.row)+"/10\r\n"
  }
  if(URL){
    base_text += "https://plum-chloride.jp/kotonoha-tango/index.html \r\n"
  }

  graph_text = ""
  history_of_hb.forEach((Element,index)=>{
    if(index<5){
      graph_text+=" \r\n"
      Element.forEach((e)=>{
        graph_text += e.replace("NO","⬜").replace("BLOW","🟨").replace("HIT","🟩")
      })
      if(rem)graph_text+=" "+String(_remain[index]);
    }else{
      graph_text+=" \r\n"
      Element.forEach((e)=>{
        graph_text += e.replace("NO","⚪").replace("BLOW","🟡").replace("HIT","🟢")
      })
      if(rem)graph_text+=" "+String(_remain[index]);
    }
  })
  return(base_text+graph_text)
}
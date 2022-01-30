end_tf = false;
end_fin = false;
history_of_game = {"try_count":0,"win_count":0,"current_streak":0,"max_streak":0,"history":[0,0,0,0,0,0,0,0,0,0]}
const end = (text,win=0)=>{
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
  }
}
  // // クリップボードに送信
  // var promise = navigator.clipboard.writeText(base_text+graph_text)
  // if(promise){
  //   alert("コピー完了");
  // }

const createEmoji = ()=>{
  base_text = "ことのはたんご 第"+String(pass_day)+"回  "+String(now_solve.row)+"/10\r\n"
  graph_text = ""
  history_of_hb.forEach((Element,index)=>{
    if(index<5){
      graph_text+=" \r\n"
      Element.forEach((e)=>{
        graph_text += e.replace("NO","⬜").replace("BLOW","🟨").replace("HIT","🟩")
      })
    }else{
      graph_text+=" \r\n"
      Element.forEach((e)=>{
        graph_text += e.replace("NO","⚪️").replace("BLOW","🟡").replace("HIT","🟢")
      })
    }
  })
  return(base_text+graph_text)
}
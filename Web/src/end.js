end_tf = false;
end_fin = false;
const end = (text)=>{
  end_tf = true;
  // 文字変更
  document.getElementById("result").innerText = text
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
  base_text = "ことのはたんご 第"+String(pass_day)+"回  "+String(now_solve.row)+"/10\r\n\r\n"
  if(end_tf){
    if(end_fin){
      situation = "正解"
    }else{
      situation = "不正解"
    }
  }else{
    situation = "途中経過"
  }
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
  return(base_text+situation+graph_text)
}
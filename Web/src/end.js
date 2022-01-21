const end = ()=>{
  createEmoji();
}

const createEmoji = ()=>{
  base_text = "ことのはたんご "+String(pass_day)+" "+String(now_solve.row)+"/10\r\n\r\n"
  graph_text = ""
  history_of_hb.forEach((Element,index)=>{
    if(index<5){
      Element.forEach((e)=>{
        graph_text += e.replace("NO","⬜").replace("BLOW","🟨").replace("HIT","🟩")
      })
      graph_text+=" \r\n"
    }else{
      Element.forEach((e)=>{
        graph_text += e.replace("NO","⚪️").replace("BLOW","🟡").replace("HIT","🟢")
      })
      graph_text+=" \r\n"
    }
  })
  console.log(base_text+graph_text)
  // クリップボードに送信
  var promise = navigator.clipboard.writeText(base_text+graph_text)
  if(promise){
    alert("コピー完了");
  }
}
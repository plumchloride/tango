let now_solve = {"row":0,"text":0}
$input = document.getElementById("input_text");

const SolvHighlight = ()=>{
  if(end_tf){return};
  for(let i = 0;i < 5;i++){
    if(i == now_solve.text){
      document.getElementById("dis-"+String(now_solve.row)+"-"+String(i)).classList.add("now_solve");;
    }else{
      document.getElementById("dis-"+String(now_solve.row)+"-"+String(i)).classList.add("row_now_solve");
    }
  }
}
const RemoveSolveHighlight = (row = now_solve.row)=>{
  for(let i = 0;i < 5;i++){
    document.getElementById("dis-"+String(row)+"-"+String(i)).classList.remove("row_now_solve");
    document.getElementById("dis-"+String(row)+"-"+String(i)).classList.remove("now_solve");
    }
  }

const DisplayUpdate = ()=>{
  if(end_tf){return};
  RemoveSolveHighlight();
  SolvHighlight();
  anser.forEach((element,index)=>{
    document.getElementById("dis-"+String(now_solve.row)+"-"+String(index)).innerText = element
  });
}
const ValueUpdate = ()=>{
  if(end_tf){return};
  $input = document.getElementById("input_text");
  // すべて空白だった場合は入力欄を空に
  all_space=false;
  anser.forEach((element)=>{
    if(!(element == "　")){
      all_space = true;
    }
  });
  if(!all_space){
    $input.value = "";
  }else{
    // そうでない場合は全角スペースを残す
    $input.value = anser.slice(0,5).toString().replace(/,/g, "")
  }
}

// 回答をもとにヒットアンドブローを反映
const AnsDisplayUpdate = (row) =>{
  RemoveSolveHighlight(row);
  _row_hb = history_of_hb[row];
  _row_text = history_of_anser[row];

  // ディスプレイ反映
  for(let i = 0;i<5;i++){
    document.getElementById("dis-"+String(row)+"-"+String(i)).innerText = _row_text[i];
    if(_row_hb[i] == "HIT"){
      document.getElementById("dis-"+String(row)+"-"+String(i)).classList.add("word_hit");
    }else if(_row_hb[i] == "BLOW"){
      document.getElementById("dis-"+String(row)+"-"+String(i)).classList.add("word_blow");
    }else{
      document.getElementById("dis-"+String(row)+"-"+String(i)).classList.add("word_none");
    }
  }

  // キーボード反映
  Array.from(new Set(history_of_hb_text["all"])).forEach((element)=>{
    document.getElementById("btn_"+element).classList.add("word_none");
  })
  Array.from(new Set(history_of_hb_text["blow"])).forEach((element)=>{
    document.getElementById("btn_"+element).classList.remove("word_none");
    document.getElementById("btn_"+element).classList.add("word_blow")
  })
  Array.from(new Set(history_of_hb_text["hit"])).forEach((element)=>{
    document.getElementById("btn_"+element).classList.remove("word_none");
    document.getElementById("btn_"+element).classList.remove("word_blow");
    document.getElementById("btn_"+element).classList.add("word_hit")
  })
}

// アラート用
const alertShow = (text,time = 1000)=>{
  document.getElementById("alert").classList.remove("non_visi")
  document.getElementById("alert_text").innerText = text
  setTimeout(()=>{document.getElementById("alert").classList.add("non_visi")},time);
}
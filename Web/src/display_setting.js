let now_solve = {"row":0,"text":0}
$input = document.getElementById("input_text");

const SolvHighlight = ()=>{
  for(let i = 0;i < 5;i++){
    if(i == now_solve.text){
      document.getElementById("dis-"+String(now_solve.row)+"-"+String(i)).classList.add("now_solve");;
    }else{
      document.getElementById("dis-"+String(now_solve.row)+"-"+String(i)).classList.add("row_now_solve");
    }
  }
}
const RemoveSolveHighlight = ()=>{
  for(let i = 0;i < 5;i++){
    document.getElementById("dis-"+String(now_solve.row)+"-"+String(i)).classList.remove("row_now_solve");
    document.getElementById("dis-"+String(now_solve.row)+"-"+String(i)).classList.remove("now_solve");
    }
  }

const DisplayUpdate = ()=>{
  RemoveSolveHighlight();
  SolvHighlight();
  anser.forEach((element,index)=>{
    document.getElementById("dis-"+String(now_solve.row)+"-"+String(index)).innerText = element
  })
}
const ValueUpdate = ()=>{
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
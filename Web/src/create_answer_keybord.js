const AddKeybordEvent = ()=>{
  func_array = Array.from(document.getElementsByClassName("func_bt"));
  func_array.forEach(element => {
    element.addEventListener("click",(e)=>{
      FuncButton(e.target.dataset.key);
    })
  });

  text_array = Array.from(document.getElementsByClassName("key_bt"))
  text_array.forEach(element => {
    element.addEventListener("click",(e)=>{
      KeyButton(e.target.dataset.key);
    })
  });


  wake_up_progress.createKeybordEvent = true;
  Progress();
};

const FuncButton = (key)=>{
  if(key == "←"){
    if(now_solve.text > 0){
      now_solve.text -= 1;
      DisplayUpdate();
    }
  }else if(key == "→"){
    if(now_solve.text <4){
      now_solve.text += 1;
      DisplayUpdate();
    }
  }else if(key == "del"){
    anser[now_solve.text] = "　";
    if(now_solve.text > 0){
      now_solve.text -= 1;
    }
    DisplayUpdate();
    ValueUpdate();
  };
}

const KeyButton = (key) =>{
  anser[now_solve.text] = key;
  if(now_solve.text <4){
    now_solve.text += 1;
  }
    DisplayUpdate();
    ValueUpdate();
}
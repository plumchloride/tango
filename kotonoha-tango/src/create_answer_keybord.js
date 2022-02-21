let curent_key_type = "all"
const AddKeybordEvent = ()=>{
  func_array = Array.from(document.getElementsByClassName("func_bt"));
  func_array.forEach(element => {
    element.addEventListener("click",(e)=>{
      if(end_tf){return};
      FuncButton(e.target.dataset.key);
    })
  });

  text_array = Array.from(document.getElementsByClassName("key_bt"))
  text_array.forEach(element => {
    element.addEventListener("click",(e)=>{
      if(end_tf){return};
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
    if(anser[now_solve.text] == "　" & now_solve.text > 0){
      anser[now_solve.text -1] = "　";
    }else{
      anser[now_solve.text] = "　";
    }
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
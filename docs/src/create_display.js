let display_array = [];
let display_row_array = [];

const CreateDisplay = ()=>{
  $display = document.getElementById("eval_display");
  element_array = [];
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
  wake_up_progress["createDisplay"] = true;
  Progress();
}
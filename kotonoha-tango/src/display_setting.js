let now_solve = {"row":0,"text":0}
$input = document.getElementById("input_text");

const SolvHighlight = (row = now_solve.row )=>{
  if(end_tf){return};
  for(let i = 0;i < 5;i++){
    if(i == now_solve.text){
      document.getElementById("dis-"+String(row)+"-"+String(i)).classList.add("now_solve");;
    }else{
      document.getElementById("dis-"+String(row)+"-"+String(i)).classList.add("row_now_solve");
    }
  }
}
const RemoveSolveHighlight = (row = now_solve.row)=>{
  for(let i = 0;i < 5;i++){
    document.getElementById("dis-"+String(row)+"-"+String(i)).classList.remove("row_now_solve");
    document.getElementById("dis-"+String(row)+"-"+String(i)).classList.remove("now_solve");
    }
  }

const DisplayUpdate = (row = now_solve.row)=>{
  if(end_tf){return};
  RemoveSolveHighlight();
  SolvHighlight();
  anser.forEach((element,index)=>{
    document.getElementById("dis-"+String(row)+"-"+String(index)).innerText = element
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
  _row_hb = Array.from(history_of_hb[row]);
  row_text = history_of_anser[row];
  // 重複判別用set
  row_text_array = row_text.split("");
  row_text_set = new Set(row_text_array);
  pr_array = pronunciation.split("");
  pr_set = new Set(pr_array);

  if(row_text_set.size != row_text_array.length){
    // 回答に重複あり
    if(pr_set.size != pr_array.length){
      // 答えに重複あり
      ans_dupli = serchDupli(pr_array);
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
  history_of_hb[row] = _row_hb;
  localStorage.setItem("history_of_hb", JSON.stringify(history_of_hb));


  // ディスプレイ反映
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

  // キーボード反映
  Array.from(new Set(history_of_hb_text["all"])).forEach((element)=>{
    document.getElementById("btn_"+element).classList.add("word_none");
  })
  Array.from(new Set(history_of_hb_text["blow"])).forEach((element)=>{
    document.getElementById("btn_"+element).classList.remove("word_none");
    document.getElementById("btn_"+element).classList.add("word_blow");
  })
  Array.from(new Set(history_of_hb_text["hit"])).forEach((element)=>{
    document.getElementById("btn_"+element).classList.remove("word_none");
    document.getElementById("btn_"+element).classList.remove("word_blow");
    document.getElementById("btn_"+element).classList.add("word_hit");
  })

  if(!filter_array){
    alertShow("バグです。動作に一部影響が出ています。\n Error3: The number of remaining words is not defined",2000)
  }else{
    CheckRemaining_all();
  }
}

// 重複をリストで変換
const serchDupli = (ar)=>{
  return ar.filter(function (val, idx, arr){
    return arr.indexOf(val) === idx && idx !== arr.lastIndexOf(val);
})};


// 重複管理
const Dupli_1 = (pr_du_array,HB_array,Ans_array,pre_array,du=false,word=undefined)=>{
  Du = ""
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
  Du = serchDupli(Ans_array);
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

// アラート用
const alertShow = (text,time = 1000)=>{
  document.getElementById("alert").classList.remove("non_visi")
  document.getElementById("alert_text").innerText = text
  setTimeout(()=>{document.getElementById("alert").classList.add("non_visi")},time);
}
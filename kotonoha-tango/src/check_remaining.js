let none_re_array = []; // 含んでいない単語を何回もフィルタリングすることは負荷になるので、1度行ったフィルタリングを再度行わない
let remain_history = []
let remain_tf = true;
const CheckRemaining_all = (progress_re = false) =>{
  if(!filter_array | filter_array.length == 0){
    alertShow("バグです。動作に一部影響が出ています。\n Error3: The number of remaining words is empty",2000);
    return;
  }
  // blow hit 重複削除
  history_of_hb_text["hit"].forEach((element) => {
    if(history_of_hb_text["blow"].length != 0 & history_of_hb_text["blow"].includes(element)){
      history_of_hb_text["blow"].splice(history_of_hb_text["blow"].indexOf(element),1);
    };
  });


  // none 含んでいない
  _none_array_before = [];
  history_of_hb_text["all"].forEach((e) =>{
    if(!none_re_array.includes(e)){
      _none_array_before.push(e);
    }
  });
  _none_array_before.forEach((e)=>{
    filter_array = filter_array.filter((word)=>!word.includes(e));
  })
  none_re_array.push(..._none_array_before);

  // blow 含んでいる事
  history_of_hb_text["blow"].forEach((e) =>{
    filter_array = filter_array.filter((word)=>word.includes(e));
  })
  // blow 該当箇所に含んでいない。
  if(history_of_hb_text["blow"].length != 0){
    history_of_hb.forEach((element,index)=>{
      element.forEach((e,index2)=>{
        if(e == "BLOW"){
          if(history_of_hb_text["blow"].includes(history_of_anser[index][index2])){
            filter_array = filter_array.filter((word)=>history_of_anser[index][index2] != word[index2]);
          }
        }else if(e == "NO" & history_of_hb_text["blow"].includes(history_of_anser[index][index2])){
          // 二重処理の場合,NOの箇所に含んでいない
          filter_array = filter_array.filter((word)=>history_of_anser[index][index2] != word[index2]);
        }
      })
    })
  }

  // hit 含んでいること
  history_of_hb_text["hit"].forEach((e) =>{
    filter_array = filter_array.filter((word)=>word.includes(e));
  })
  // hit 該当箇所に含んでいること
  if(history_of_hb_text["hit"].length != 0){
    history_of_hb.forEach((element,index)=>{
      element.forEach((e,index2)=>{
        if(e == "HIT"){
          if(history_of_hb_text["hit"].includes(history_of_anser[index][index2])){
            filter_array = filter_array.filter((word)=>history_of_anser[index][index2] == word[index2]);
          }
        }else if(e == "NO" & history_of_hb_text["hit"].includes(history_of_anser[index][index2])){
          // 二重処理の場合,NOの箇所に含んでいない
          filter_array = filter_array.filter((word)=>history_of_anser[index][index2] != word[index2]);
        }
      })
    })
  }



  SecCheck(filter_array.length);
  if(progress_re){
    remain_history.push(filter_array.length);
    localStorage.setItem("remain", JSON.stringify(remain_history));
  };
}

// 残り候補数非表示機能
const toggle_remain_show = ()=>{
  if(lang_en){
    if(remain_tf){
      document.getElementById("remain_unvisi").innerText="（Show）"
    }else{
      document.getElementById("remain_unvisi").innerText="（Hide）"
    }
  }else{
    if(remain_tf){
      document.getElementById("remain_unvisi").innerText="（表示）"
    }else{
      document.getElementById("remain_unvisi").innerText="（非表示）"
    }
  }
  remain_tf = !remain_tf
  SecCheck();
}
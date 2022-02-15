let none_re_array = []; // 含んでいない単語を何回もフィルタリングすることは付加になるので、1度行ったフィルタリングを再度行わない
let remain_history = []
const CheckRemaining_all = (progress_re = false) =>{
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
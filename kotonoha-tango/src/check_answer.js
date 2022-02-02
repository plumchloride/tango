let anser = ["　","　","　","　","　"];
let history_of_anser = [];
let history_of_hb = [];
let history_of_hb_text = {"hit":[],"blow":[],"all":[]}

document.getElementById("Decision_button").addEventListener("click",(e)=>{
  if(end_tf){return};
  check = false
  // 値の改変やバグチェック
  if(!wake_up_progress.fin){
    alert("バグ、もしくは不正な操作です。リロードします。\n Error1: Not wake up")
    check = true;
    location.reload();
  }else if(!(anser.length == 5)){
    alert("バグ、もしくは不正な操作です。リロードします。\n Error2: The length of the entered character is incorrect")
    check = true;
    location.reload();
  }

  // 前項でエラー処理済み
  if(check){
    return
  }
  // 異なる文字が入力されていないかチェック。
  anser.forEach((element)=>{
    if(hiragana.includes(element) | katakana.includes(element)){
      ;
    }else{
      if(!check){
        if(lang_en){
          alertShow('Attention\nNot enough letter or use only (hiragana or katakana)',2000);
        }else{
          alertShow("注意\n入力した「たんご」はひらがな・カタカナの5文字のみです",2000);
        };
        check = true;
      }
    }
  });

  // 入力単語が実在しているかのチェック
  text_anser = anser.toString().replace(/,/g, "")
  if(check){
    // 前項でエラー処理済み
    return;
  }else if(A_data.includes(text_anser)){
    ;
  }else{
    if(lang_en){
      alertShow('Attention\nNot in the dictionary of this app)',2000);
    }else{
      alertShow("注意\nことのは（本アプリの辞書内の単語）を記入して下さい",2000)
    };
    check = true;
    return;
  }

  // 前項でエラー処理済み
  if(check){
    return
  }
  // ヒットアンドブロー処理
  hb_pronunciation = pronunciation.split("");
  b_word = new Set();
  all_word = new Set();
  non_dupli_anser = Array.from(new Set(anser));
  non_dupli_anser.forEach((element)=>{
    all_word.add(element);
    if(hb_pronunciation.includes(element)){
      b_word.add(element);
    }
  });
  h_index = [];
  h_word = new Set();
  for(let i=0; i < 5;i++){
    if(anser[i] == hb_pronunciation[i]){
      h_index.push(i);
      h_word.add(anser[i])
    }
  };

  // ヒットアンドブロー処理結果をarrayに
  hb_list = ["NO","NO","NO","NO","NO"];
  anser.forEach((element,index)=>{
    if(b_word.has(element)){
      hb_list[index] = "BLOW";
    }
  });
  h_index.forEach((element)=>{
    hb_list[element] = "HIT";
  });

  // 文字情報取得
  history_of_hb_text.hit = history_of_hb_text.hit.concat(Array.from(h_word));
  history_of_hb_text.blow = history_of_hb_text.blow.concat(Array.from(b_word));
  history_of_hb_text.all = history_of_hb_text.all.concat(Array.from(all_word));



  // 画面表示系計算
  history_of_hb.push(hb_list);
  history_of_anser.push(anser.toString().replace(/,/g, ""));
  anser = ["　","　","　","　","　"];


  // 回答したことを伝える
  now_solve.row += 1;
  now_solve.text = 0;

  // ローカルストレージに保存
  localStorage.setItem("now_solve", JSON.stringify(now_solve));
  localStorage.setItem("history_of_hb_text", JSON.stringify(history_of_hb_text));
  localStorage.setItem("history_of_hb", JSON.stringify(history_of_hb));
  localStorage.setItem("history_of_anser", JSON.stringify(history_of_anser));
  localStorage.setItem("pass_day", pass_day);
  localStorage.setItem("fin", JSON.stringify({"tf":false,"text":undefined}));

  //画面更新
  AnsDisplayUpdate(now_solve.row -1);
  ValueUpdate();
  DisplayUpdate();


  if(h_index.length == 5){
    end_fin = true;
    if(lang_en){
      end("You're correct",1);
    }else{
      end("正解です",1);
    }
  }else if(now_solve.row == 10){
    if(lang_en){
      end("You're Incorrect",0);
    }else{
      end("不正解です",0);
    }
  };

});
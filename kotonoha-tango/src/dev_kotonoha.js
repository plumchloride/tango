const mode_body ={"today":document.getElementById("mode_today"),"history":document.getElementById("mode_history"),
                  "kotonoha":document.getElementById("mode_kotonoha"),"tango":document.getElementById("mode_tango"),
                  "serch":document.getElementById("mode_serch"),"version":document.getElementById("mode_version"),"kiya":document.getElementById("mode_kiya")};
const mode_li ={"today":document.getElementById("today_li"),"history":document.getElementById("history_li"),
                "kotonoha":document.getElementById("kotonoha_li"),"tango":document.getElementById("tango_li"),
                "serch":document.getElementById("serch_li"),"version":document.getElementById("version_li"),"kiya":document.getElementById("kiya_li")};
const q_csv_path = './public/data/Q_fil_ippan.csv';
const a_csv_path = './public/data/A_data_new.csv';
const h_csv_path = './public/data/history.csv';
const t_csv_path = './public/data/tango_history.csv';
test = "https://plum-chloride.jp/kotonoha-tango/public/data/history.csv"
let csv_data = {"q_data":{},"a_data":[],"h_data":{},"t_data":{}};
let a_data_sep = {"bun":[],"uni":[],"user":[]};
let current_page = {"bun":0,"uni":0,"user":0};
let max_page = {"bun":0,"uni":0,"user":0};
lm = ""
let history ={"anser":[],"hb":[],"hb_text":{"hit":[],"blow":[],"all":[]},"remain":[]};
let _none_array_before = [];
filter_array = [];
pass_day = 0;
let C2 = "A"
let C3 = "A"
let sum = (accumulator, curr) => Number(accumulator) + Number(curr);


// === csv読み込み ===
const WakeUpRequest = (path,mode)=>{
  var _request = new XMLHttpRequest();
  _request.addEventListener('load', (event) => {
    const response = event.target.responseText;
    LoadData(mode,response);
    if(mode == "H"){
      let date = new Date(event.target.getResponseHeader('Last-Modified'));
      document.getElementById("get_time").innerText = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);
    }
  });
  _request.open('GET', path, true);
  _request.send();
}
const LoadData = (mode,data)=>{
  switch(mode){
    case "A":
      var _array_sp_n = [];
      _array_sp_n = data.split(/\r\n|\n/);
      SaveArray(_array_sp_n,mode);
      break;
    case "Q":
      var _array = {"title":[],"pronunciation":[]};
      var _array_sp_n = [];
      _array_sp_n = data.split(/\r\n|\n/);
      _array_sp_n.forEach(element => {
        var _row = element.split(",")
        _array["title"].push(_row[0])
        _array["pronunciation"].push(_row[1])
      });
      SaveArray(_array,mode);
      break;
    case "H":
      var _dic = {};
      var _array_sp_n = [];
      _array_sp_n = data.split(/\r\n|\n/);
      _array_sp_n.forEach(element => {
        var _row = element.split(",");
        if(_row[0] != '' & _row != ''){
          _dic[_row[0]] = _row.slice(1);
        }
      });
      SaveArray(_dic,mode);
      break;
      case "T":
        var _dic = {};
        var _array_sp_n = [];
        _array_sp_n = data.split(/\r\n|\n/);
        _array_sp_n.forEach(element => {
          var _row = element.split(",");
          if(_row[0] != '' & _row != ''){
            _dic[_row[0]] = _row.slice(1);
          }
        });
        SaveArray(_dic,mode);
      break;
    default:
      alert("ERROR1:\n csvmode is invalid");
      location.reload();
  }
}
const SaveArray = (data,mode)=>{
  switch(mode){
    case "A":
      csv_data.a_data = Array.from(new Set(data));
      a_data_sep.bun = csv_data.a_data.slice(0,csv_data.a_data.indexOf("サイリヨウ")+1);
      a_data_sep.uni = csv_data.a_data.slice(csv_data.a_data.indexOf("サイリヨウ")+1,csv_data.a_data.indexOf("ンバラカダ")+1);
      a_data_sep.user = csv_data.a_data.slice(csv_data.a_data.indexOf("ンバラカダ")+1);

      max_page.bun = Math.ceil(a_data_sep.bun.length/64);
      max_page.uni = Math.ceil(a_data_sep.uni.length/64);
      max_page.user = Math.ceil(a_data_sep.user.length/64);
      filter_array = Array.from(new Set(csv_data.a_data));
      WakeUpRequest(test+`?ver=${nowtime.getFullYear()}${nowtime.getMonth()+1}${nowtime.getDate()}${nowtime.getMinutes()}`,"H");

      break;
    case "Q":
      csv_data.q_data = data;
      break;
    case "H":
      csv_data.h_data = data;
      // 最初の画面起動時に表示
      change_mode("today",true);
      break;
    case "T":
      csv_data.t_data = data;
      break;
    default:
      alert("ERROR1:\n csvmode is invalid");
      location.reload();
  }
}

// wakeup
(()=>{
  nowtime = new Date();
  history.hb_text = JSON.parse(localStorage.getItem("history_of_hb_text"));
  history.hb = JSON.parse(localStorage.getItem("history_of_hb"));
  history.anser = JSON.parse(localStorage.getItem("history_of_anser"));
  WakeUpRequest(q_csv_path+`?ver=${nowtime.getFullYear()}${nowtime.getMonth()+1}${nowtime.getDate()}`,"Q");
  WakeUpRequest(t_csv_path+`?ver=${nowtime.getFullYear()}${nowtime.getMonth()+1}${nowtime.getDate()}`,"T");
  WakeUpRequest(a_csv_path+`?ver=${nowtime.getFullYear()}${nowtime.getMonth()+1}${nowtime.getDate()}`,"A");
})();
// === csv読み込み ここまで ===



const change_mode = (mode_to,first_flag = false) =>{
  // 全部消す
  Object.keys(mode_body).forEach(key =>{
    mode_body[key].classList.add("non_visi");
    mode_li[key].classList.remove("current_li");
  });
  mode_body[mode_to].classList.remove("non_visi");
  mode_li[mode_to].classList.add("current_li");
  wakeup(mode_to,first_flag);
  if(first_flag){
    GetBefore(document.getElementById("pdai"),document.getElementById("myChart3"),document.getElementById("pokper3"),document.getElementById("tango3"),"pc");
  }
}

const wakeup = (mode,first_flag = false)=>{
  switch(mode){
    case "today":
      let nowtime = new Date();
      let First_Day = new Date("2022/1/21");
      let timestamp = nowtime - First_Day;
      pass_day =  Math.floor(timestamp/(24 * 60 * 60 * 1000));
      document.getElementById("pass_day").innerText = `${nowtime.getFullYear()}/${nowtime.getMonth()+1}/${nowtime.getDate()}　第${pass_day}回`
      if(JSON.parse(localStorage.getItem("flag")) == null){
        document.getElementById("not_yet").classList.remove("non_visi");
        document.getElementById("yet").classList.add("non_visi");
      }else if(pass_day == JSON.parse(localStorage.getItem("pass_day")) & JSON.parse(localStorage.getItem("flag")).game_end){
        document.getElementById("yet").classList.remove("non_visi");
        document.getElementById("not_yet").classList.add("non_visi");
        if(first_flag){
          today_wakeup(pass_day);
        }
      }else{
        document.getElementById("not_yet").classList.remove("non_visi");
        document.getElementById("yet").classList.add("non_visi");
      }
      break;
    case "history":
      break;
    case "kotonoha":
      document.getElementById("kotonoha_sum_bun").innerText = `${a_data_sep.bun.length.toLocaleString()} 単語`;
      document.getElementById("kotonoha_sum_uni").innerText = `${a_data_sep.uni.length.toLocaleString()} 単語`;
      document.getElementById("kotonoha_sum_user").innerText= `${a_data_sep.user.length.toLocaleString()} 単語`;
      document.getElementById("kotonoha_sum_len").innerText = `${csv_data.a_data.length.toLocaleString()} 単語`;
      change_page(0,"bun");
      change_page(0,"uni");
      change_page(0,"user");
      break;
  }
}

// ことのは辞書用
const change_page = (num,page)=>{
  switch(num){
    case 0:
      document.getElementById(page+"_data").innerHTML = `<li>${a_data_sep[page].slice(0,64).toString().replace(/,/g,"</li><li>")}</li>`;
      current_page[page] = 0;
      document.getElementById(page+"_num").innerText = `${current_page[page]+1}/${max_page[page]}`
      break;
    case 1:
    case -1:
      if(0<=current_page[page] + num &current_page[page] + num <max_page[page]){
        current_page[page] += num;
        document.getElementById(page+"_data").innerHTML = `<li>${a_data_sep[page].slice(64*current_page[page],64*(current_page[page]+1)).toString().replace(/,/g,"</li><li>")}</li>`;
        document.getElementById(page+"_num").innerText = `${current_page[page]+1}/${max_page[page]}`
      }
      break;
  }

}

const today_wakeup = (pass_day)=>{
  let tango = JSON.parse(localStorage.getItem("tango"));
  document.getElementById("tango").innerText = `「${tango.kanzi}」（${tango.yomi}）`

  if(pass_day in csv_data.h_data){
    // 集計表示
    document.getElementById("play_num").innerText = csv_data.h_data[pass_day].reduce(sum).toLocaleString();
    document.getElementById("okper").innerText = Math.floor((1 - Number(csv_data.h_data[pass_day][10])/csv_data.h_data[pass_day].reduce(sum))*10000)/100
    document.getElementById("sikou_num").innerText = `試行回数：${history.anser.length}回`

    Chart.defaults.plugins.legend.display = false;

    labels = ["1","2","3","4","5","6","7","8","9","10","X"];
    var color = Array(5);
    var col2 = Array(5);
    color.fill('#557443');
    col2.fill("#AE8B31");
    color.push(...col2);
    color.push("#B4534B");
    data = {
      labels: labels,
      datasets: [{
        backgroundColor: color,
        borderColor: 'rgb(128,197,222)',
        data: csv_data.h_data[pass_day],
        borderWidth: 0

      }]
    }
    config = {
      showTooltips: false,
      type: 'bar',
      data: data,
      options: {
        responsive: false,
        scales: {
        y: {
            beginAtZero: true
          },
        },
      }
    };
    myChart = new Chart(
      document.getElementById('myChart'),
      config
    );

    // 回答表示・残り候補数表示
    var adl = document.getElementById("ad_l");
    var adr = document.getElementById("ad_r");
    var nokori_div = document.getElementById("nokori_div");

    for (let step = 0; step < history.anser.length; step++) {
      var _anser = Array.from(history.anser[step]);
      var row = document.createElement("div");
      row.setAttribute("class",(step < 5)?"rect":"circle");

      // 残り候補数
      var nokoris = CheckRemaining_all(history.hb[step],history.anser[step]);
      var _head = document.createElement("h4");
      _head.innerText = `${history.anser[step]}・残り候補数：${nokoris[0]}個`
      nokori_div.appendChild(_head)
      var _text = document.createElement("p");
      if(nokoris[0] > 20){
        _text.innerText = nokoris[1].slice(0,20)+"　など"
      }else{
        _text.innerText = nokoris[1].slice(0,20)
      }
      nokori_div.appendChild(_text);


      for(let index = 0;index < 5;index++){
        var div = document.createElement("div");
        div.innerText = _anser[index];
        div.setAttribute("class","dis_text " +history.hb[step][index])
        row.appendChild(div)
      }
      if(step<5){
        adl.appendChild(row)
      }else{
        adr.appendChild(row)
      }
    }
    // 前日等のデータ表示
    GetBefore(document.getElementById("dai"),document.getElementById("myChart2"),document.getElementById("okper2"),document.getElementById("tango2"),"phone");
  }else{
    console.log("here",pass_day)
  }
};

const CheckRemaining_all = (history_of_hb,history_of_anser) =>{
  //history_of_hb_text 作製
  var history_of_hb_text = {"hit":[],"blow":[],"all":[]}
  history_of_hb.forEach((e,index)=>{
    if(e == "BLOW"){
      history_of_hb_text.blow.push(history_of_anser[index]);
    }else if(e == "HIT"){
      history_of_hb_text.hit.push(history_of_anser[index]);
    }else{
      if(!history_of_hb_text["all"].includes(history_of_anser[index])){
        history_of_hb_text.all.push(history_of_anser[index]);
      }
    }
  });
  // blow hit 重複削除
  history_of_hb_text["hit"].forEach((element) => {
    if(history_of_hb_text["blow"].length != 0 & history_of_hb_text["blow"].includes(element)){
      history_of_hb_text["blow"].splice(history_of_hb_text["blow"].indexOf(element),1);
    };
    if(history_of_hb_text["all"].length != 0 & history_of_hb_text["all"].includes(element)){
      history_of_hb_text["all"].splice(history_of_hb_text["all"].indexOf(element),1);
    };
  });
  history_of_hb_text["blow"].forEach((element) => {
    if(history_of_hb_text["all"].length != 0 & history_of_hb_text["all"].includes(element)){
      history_of_hb_text["all"].splice(history_of_hb_text["all"].indexOf(element),1);
    };
  });

  // none 含んでいない
  history_of_hb_text["all"].forEach((e)=>{
    filter_array = filter_array.filter((word)=>!word.includes(e));
  })
  // blow 含んでいる事
  history_of_hb_text["blow"].forEach((e) =>{
    filter_array = filter_array.filter((word)=>word.includes(e));
  })
  // hit 含んでいること
  history_of_hb_text["hit"].forEach((e) =>{
    filter_array = filter_array.filter((word)=>word.includes(e));
  })

  // hbリストを参照
  hit_blow_list = []
  history_of_hb.forEach((e,index2)=>{
    // 各文字の評価(HIT BLOW)
    if(e == "BLOW"){
      filter_array = filter_array.filter((word)=>history_of_anser[index2] != word[index2]);
      if(hit_blow_list.includes(history_of_anser[index2])){
        // HIT or BLOWが同じ試行で同じたんごに対して、2個出た場合
        filter_array = filter_array.filter((word) => word.indexOf(history_of_anser[index2]) != word.lastIndexOf(history_of_anser[index2]));
      }
      hit_blow_list.push(history_of_anser[index2]);
    }else if(e == "NO" & history_of_hb_text["blow"].includes(history_of_anser[index2])){
      // 二重処理の場合,NOの箇所に含んでいない
      filter_array = filter_array.filter((word)=>history_of_anser[index2] != word[index2]);
    }else if(e == "HIT"){
      filter_array = filter_array.filter((word)=>history_of_anser[index2] == word[index2]);
      if(hit_blow_list.includes(history_of_anser[index2])){
        // HIT or BLOWが同じ試行で同じたんごに対して、2個出た場合
        filter_array = filter_array.filter((word) => word.indexOf(history_of_anser[index2]) != word.lastIndexOf(history_of_anser[index2]));
      }
      hit_blow_list.push(history_of_anser[index2]);
    }else if(e == "NO" & history_of_hb_text["hit"].includes(history_of_anser[index2])){
      // 二重処理の場合,NOの箇所に含んでいない
      filter_array = filter_array.filter((word)=>history_of_anser[index2] != word[index2]);
    }
  })
  return [filter_array.length,filter_array]
}

const GetBefore = (sel,chart,per,tango,mode)=>{
  Object.keys(csv_data.h_data).forEach(e=>{
    var op = document.createElement("option")
    op.setAttribute("value",e);
    if(csv_data.t_data[e] != undefined){
      var per_op = Math.floor((1 - Number(csv_data.h_data[e][10])/csv_data.h_data[e].reduce(sum))*10000)/100;
      op.innerText = `第${e}回 正答率${per_op}%「${csv_data.t_data[e][0]}」（${csv_data.t_data[e][1]}）`
    }else{
      var per_op = Math.floor((1 - Number(csv_data.h_data[e][10])/csv_data.h_data[e].reduce(sum))*10000)/100
      op.innerText = `第${e}回 正答率${per_op}%「現在更新中です」`;
    }
    
    sel.appendChild(op);
  });

  if(mode == "phone"){
    sel.addEventListener("change",(e)=>{
      var index =  e.target.value;
      per.innerText = Math.floor((1 - Number(csv_data.h_data[index][10])/csv_data.h_data[index].reduce(sum))*10000)/100
      if(csv_data.t_data[index] != undefined){
        tango.innerText = `「${csv_data.t_data[index][0]}」（${csv_data.t_data[index][1]}）`;
      }else{
        tango.innerText = `現在更新中です`;
      }
      Chart.defaults.plugins.legend.display = false;

      labels = ["1","2","3","4","5","6","7","8","9","10","X"];
      var color = Array(5);
      var col2 = Array(5);
      color.fill('#557443');
      col2.fill("#AE8B31");
      color.push(...col2);
      color.push("#B4534B");
      data = {
        labels: labels,
        datasets: [{
          backgroundColor: color,
          borderColor: 'rgb(128,197,222)',
          data: csv_data.h_data[index],
          borderWidth: 0
  
        }]
      }
      config = {
        showTooltips: false,
        type: 'bar',
        data: data,
        options: {
          responsive: false,
          scales: {
          y: {
              beginAtZero: true
            },
          },
        }
      };
      if(C2 != "A"){
        C2.destroy();
      }
      C2 = new Chart(
        chart,
        config
      );
    })
  }else{
    sel.addEventListener("change",(e)=>{
      var index =  e.target.value;
      console.log(Object.values(csv_data.h_data[index]))
      per.innerText = Math.floor((1 - Number(csv_data.h_data[index][10])/csv_data.h_data[index].reduce(sum))*10000)/100
      Chart.defaults.plugins.legend.display = false;
      if(csv_data.t_data[index] != undefined){
        tango.innerText = `「${csv_data.t_data[index][0]}」（${csv_data.t_data[index][1]}）`;
      }else{
        tango.innerText = `現在更新中です`;
      }

      labels = ["1","2","3","4","5","6","7","8","9","10","X"];
      var color = Array(5);
      var col2 = Array(5);
      color.fill('#557443');
      col2.fill("#AE8B31");
      color.push(...col2);
      color.push("#B4534B");
      data = {
        labels: labels,
        datasets: [{
          backgroundColor: color,
          borderColor: 'rgb(128,197,222)',
          data: csv_data.h_data[index],
          borderWidth: 0
  
        }]
      }
      config = {
        showTooltips: false,
        type: 'bar',
        data: data,
        options: {
          responsive: false,
          scales: {
          y: {
              beginAtZero: true
            },
          },
        }
      };
      if(C3 != "A"){
        C3.destroy();
      }
      C3 = new Chart(
        chart,
        config
      );
    })
  }
}
let src = {"hatena":"./public/img/hatena.svg","bar":"./public/img/bar_graph.svg","set":"./public/img/set.svg","batu":"./public/img/x.svg"};
let img_show = {"hatena":true,"bar":false,"set":false};
let $img_btn = {"hatena":document.getElementById("img_hatena"),"bar":document.getElementById("img_bar_graph"),"set":document.getElementById("img_setting")}
let $div = {"body":document.getElementById("body"),"hatena":document.getElementById("hatena"),"bar":document.getElementById("graph"),"set":document.getElementById("setting")}
let myChart = "A"


$img_btn.hatena.setAttribute("src",src.batu);

// いったんすべてのnavの表示を消す
const allNonVisi = ()=>{
  Object.keys($div).forEach((key) => {
    $div[key].classList.add("non_visi");
  });
  Object.keys($img_btn).forEach((key) => {
    $img_btn[key].setAttribute("src",src[key]);
  });
}

// nav用イベントリスナー作製
Object.keys($img_btn).forEach((key) => {
  $img_btn[key].addEventListener("click",(e)=>{
    if(img_show[e.target.dataset.mode]){
      allNonVisi();
      img_show[e.target.dataset.mode] = false;
      $div.body.classList.remove("non_visi");
      $img_btn[e.target.dataset.mode].setAttribute("src",src[e.target.dataset.mode]);
    }else{
      allNonVisi();
      Object.keys(img_show).forEach((key) => {
        if(key == e.target.dataset.mode){
          img_show[key] = true;
        }else{
          img_show[key] = false;
        }
      });
      $div[e.target.dataset.mode].classList.remove("non_visi");
      $img_btn[e.target.dataset.mode].setAttribute("src",src.batu);
      if(e.target.dataset.mode == "bar"){
        $div["body"].classList.remove("non_visi");
        document.getElementById("emoji_place").innerText = createEmoji();
      }
    }
  });
});

// 戦歴表示機能
const showHistory = (dir) =>{
  // history_of_game = {"try_count":0,"win_count":0,"current_streak":0,"max_streak":0,"history":[0,0,0,0,0,0,0,0,0,0]}
  document.getElementById("try_count").innerText = dir.try_count;
  win_rate = String(Math.floor((dir.win_count/dir.try_count)*100))+"%";
  if(!win_rate){
    win_rate = 0;
  }
  document.getElementById("win_rate").innerText = win_rate;
  document.getElementById("current_streak").innerText =dir.current_streak;
  document.getElementById("max_streak").innerText =dir.max_streak;

  // chart
  Chart.defaults.plugins.legend.display = false;
  labels = ["1","2","3","4","5","6","7","8","9","10"];
  console.log(dir.history)
  data = {
    labels: labels,
    datasets: [{
      backgroundColor: 'rgb(128,197,222)',
      borderColor: 'rgb(128,197,222)',
      data: dir.history,
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
        }
      },
    }
  };

  if(myChart != "A"){
    myChart.destroy();
  }
  myChart = new Chart(
    document.getElementById('myChart'),
    config
  );
}


// graph コピー機能及びツイート機能
// コピー クリップボードに送信
document.getElementById("graph_copy").addEventListener("click",(element)=>{
  var promise = navigator.clipboard.writeText(createEmoji());
  if(promise){
    alertShow("クリップボードにコピー完了",500);
  }
})

// ツイート
document.getElementById("graph_tw").addEventListener("click",(element)=>{
	s = createEmoji();
	if (s != "") {
    s = encodeURIComponent(s);
    //投稿画面を開く
    url = "https://twitter.com/intent/tweet?text=" + s;
    window.open(url,"_blank");
		}
	});

// 閉じるボタンでもgraphを閉じられるように
document.getElementById("graph_close").addEventListener("click",(el)=>{
  mode = "bar"
  allNonVisi();
  img_show[mode] = false;
  $div.body.classList.remove("non_visi");
  $img_btn[mode].setAttribute("src",src[mode]);
});

// 閉じるボタンでも説明をを閉じられるように
document.getElementById("hatena_close").addEventListener("click",(el)=>{
  mode = "hatena"
  allNonVisi();
  img_show[mode] = false;
  $div.body.classList.remove("non_visi");
  $img_btn[mode].setAttribute("src",src[mode]);
});

// タイトル名からゲーム画面に戻れるように
document.getElementById("title").addEventListener("click",(el)=>{
  allNonVisi();
  Object.keys(img_show).forEach((key) => {
    img_show[key] = false;
    $img_btn[key].setAttribute("src",src[key]);
  });

  $div.body.classList.remove("non_visi");
});

// aタグでのリンクの実装が出来なかったため
document.getElementById("linek").addEventListener("click",(e)=>{
  window.open("https://www.powerlanguage.co.uk/wordle/","_brank")
})

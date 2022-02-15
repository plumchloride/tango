lang_en = false;

document.getElementById("hatena").addEventListener("click",(e)=>{
  // 文字切り替え処理
  if(e.target.id == "switch_lang" | e.target.id == "switch_lang_u"){
    if(lang_en){
      lang_en = false;
      document.getElementById("hatena").innerHTML = HATENA_TEXT_JP;
      document.getElementById("Decision_button").innerText="決定";
      document.getElementById("input_text").setAttribute("placeholder","キーボード入力用");
      document.getElementById("setting").innerHTML = SET_TEXT_JP;
      document.getElementById("kt_all").innerText = "全種"
      document.getElementById("kt_normal").innerText = "50音"
      document.getElementById("kt_ga").innerText = "濁点等"
      document.getElementById("kt_none").innerText = "非表示"

      // グラフ画面変更
      change_graph_lang(["今日は正解していません","コピー","ツイート","URL付きでツイート","戦歴","プレイ<br>回数","勝率","現在の<br>連勝数","最大<br>連勝数","正解分布表示","<u>閉じる</u>","正解です","不正解です"])
    }else{
      lang_en = true;
      document.getElementById("hatena").innerHTML = HATENA_TEXT_EN;
      document.getElementById("Decision_button").innerText="decision";
      document.getElementById("input_text").setAttribute("placeholder","input column");
      document.getElementById("setting").innerHTML = SET_TEXT_EN;
      document.getElementById("kt_all").innerText = "All"
      document.getElementById("kt_normal").innerText = "top half"
      document.getElementById("kt_ga").innerText = "bottom half"
      document.getElementById("kt_none").innerText = "hidden"

      // グラフ画面変更
      change_graph_lang(["Not yet correct today","Copy","Tweet","Tweet with URL","STATISTICS","Play<br>times","Win%","Current<br>Streak","Max<br>Streak","GUESS DISTRIBUTION","<u>close</u>","You're correct","You're Incorrect"])
    }
    // 現在の言語を保存
    localStorage.setItem("lang", lang_en);
    // 色保存
    ChangeColor();
  }

  // 表示閉じる処理
  if(e.target.id == "hatena_close" | e.target.id == "hatena_close_u"){
    mode = "hatena"
    allNonVisi();
    img_show[mode] = false;
    $div.body.classList.remove("non_visi");
    $img_btn[mode].setAttribute("src",src[mode]);
  }
})



const change_graph_lang= (text)=>{
  if(!end_tf){
    document.getElementById("result").innerText = text[0];
  }else{
    if(copy_win){
      document.getElementById("result").innerText = text[11];
    }else{
      document.getElementById("result").innerText = text[12];
    }
  }
  document.getElementById("graph_copy").innerText = text[1];
  document.getElementById("graph_tw").innerText = text[2];
  document.getElementById("graph_tw_url").innerText = text[3];
  document.getElementById("history_h2").innerText = text[4];
  document.getElementById("his_1").innerHTML = text[5];
  document.getElementById("his_2").innerHTML = text[6];
  document.getElementById("his_3").innerHTML = text[7];
  document.getElementById("his_4").innerHTML = text[8];
  document.getElementById("gr_title").innerText = text[9];
  document.getElementById("graph_close").innerHTML = text[10];

}


const HATENA_TEXT_EN = `
      <h2 id="switch_lang"><small><u id="switch_lang_u">日本語に切り替え</u></small></h2>
      <h2>How to play</h2>
      <p>Guess the <strong>tango(たんご)</strong> in 10 tries.</p>
      <p>Each guess must be a valid 5 letter word,<strong>"kotonoha(ことのは)"</strong></p>
      <p>After each guess, the color of the tiles will change to show evaluate the words you guessed.</p>
      <h2>Examples</h2>
      <div class="row">
        <div class="display_num word_hit">キ</div>
        <div class="display_num word_none">ョ</div>
        <div class="display_num word_hit">ウ</div>
        <div class="display_num word_blow">シ</div>
        <div class="display_num word_none">ツ</div>
      </div>
      <div style="font-size: 0.9em;">
        <p>The letter <strong class="hit_ex">「キ・ウ」</strong> is <strong class="hit_ex">in word and in the correct spot</strong>.</p>
        <p>The letter <strong class="blow_ex">「シ」</strong> is <strong class="blow_ex">in word but in the wrong spot</strong>。</p>
        <p>The letter <strong>「ョ・ツ」</strong> is not in the word.</p>
      </div>
      <h2>In the beginning</h2>
      <p>I was greatly inspired by <a href="https://www.powerlanguage.co.uk/wordle/" target="_blank">Wordle</a> to create this app.</p>
      <p>This is a word guessing game that can be played once a day.</p>
      <p>The answer is the same for all users. Let's avoid spoilers.</p>
      <p>Due to the nature of the Japanese language, <strong>it is tremendously more difficult than Wordle</strong>.</p>
      <h2>Assistance in playing and Post-production impressions<br>(Only Japanese)</h2>
      <p>＞ <a href="https://note.com/plumchloride/n/n1fcddc29b00c" target="_blank">note記事</a></p>
      <h2>About word updates and dictionary data<br>(Only Japanese)</h2>
      <p>＞ <a href="https://note.com/plumchloride/n/n8d25cad96348" target="_blank">note記事</a></p>
      <h2>Input Method</h2>
      <p>There are two input methods: UI keyboard and keyboard.</p>
      <p>The area currently circled in orange is the frame for the text to be entered. The area in light blue is the text currently being entered on the UI keyboard, and the text will be inserted or deleted in the corresponding area.</p>
      <h2>CAUTION</h2>
      <p>Japanese has a huge number of words, so even if a word exists, it may not be registered in <strong>Kotonoha</strong>.</p>
      <p> When you enter the <strong>kotonoha</strong> that uses two or three of the same characters (ex:シュクシャ・シシオドシ), the evaluation will be displayed from the left for the number of characters included in the answer. However, this is not the case for green highlighting. <br> If the <strong>tango</strong> is "シュクシャ" and the <strong>kotonoha</strong> is "シシオドシ", the first character of "シ" is highlighted in green, the second character is highlighted in yellow, and the third character is highlighted in gray. </p>
      <p>We do not have a clear filtering system for the words in the questions. The words in this app do not contain "political, religious, sexist, or sexual" intentions.</p>

      <h2 id="hatena_close"><u style="cursor: pointer;" id="hatena_close_u">Close Description</u></h2>
      <hr>
      <div></div>
      <p><small>Tango is generated daily from a dictionary using random numbers. You can get it by analyzing the internal JavaScript, but please refrain from doing so.</small></p>
      <img alt="クリエイティブ・コモンズ・ライセンス" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
`

const HATENA_TEXT_JP = `
    <h2 id="switch_lang"><small><u id="switch_lang_u">Switch to English</u></small></h2>
      <h2>遊び方</h2>
      <p>10回の試行で決められた<strong>たんご</strong>を当てて下さい。</p>
      <p>それぞれの試行は本アプリの辞書で定められた5文字の<strong>ことのは</strong>であることが必要です。</p>
      <p>各試行のたびに文字のタイルの色が変わり、試行した単語に対して評価を行っています。</p>
      <h2>例</h2>
      <div class="row">
        <div class="display_num word_hit">キ</div>
        <div class="display_num word_none">ョ</div>
        <div class="display_num word_hit">ウ</div>
        <div class="display_num word_blow">シ</div>
        <div class="display_num word_none">ツ</div>
      </div>
      <div style="font-size: 0.9em;">
        <p><strong class="hit_ex">「キ・ウ」</strong>はたんごに<strong class="hit_ex">含まれており場所も正しい</strong>です。</p>
        <p><strong class="blow_ex">「シ」</strong>はたんごに含まれているが<strong class="blow_ex">場所が違います</strong>。</p>
        <p><strong>「ョ・ツ」</strong>はたんごに含まれていません。</p>
      </div>
      <h2>初めに</h2>
      <p>本家<a href="https://www.powerlanguage.co.uk/wordle/" target="_blank">Wordle</a>様より大きな影響を受けて日本語版の Wordle として作成しました。</p>
      <p>1日1回遊ぶことが出来る単語推理ゲームです。</p>
      <p>答えは全ユーザーで共通です。ネタバレは避けましょう</p>
      <p><strong>日本語の特性上本家Wordleよりもだいぶ難易度が高いです</strong>。</p>
      <h2>プレイ指南書・作製後感想</h2>
      <p>＞ <a href="https://note.com/plumchloride/n/n1fcddc29b00c" target="_blank">note記事</a></p>
      <h2>単語更新・辞書データについて</h2>
      <p>＞ <a href="https://note.com/plumchloride/n/n8d25cad96348" target="_blank">note記事</a></p>
      <h2>入力方法</h2>
      <p>入力方法はUIキーボードとキーボードの二種類あります。</p>
      <p>現在オレンジ色で囲われている箇所が入力するテキストの枠です。その中で水色に囲われている箇所がUIキーボードにおける現在入力中の文字であり、該当箇所に文字の挿入及び削除がされます。</p>
      <h2>注意</h2>
      <p>日本語は単語数が膨大なため、存在する単語でも<strong>ことのは</strong>に登録されていない可能性があります。ご了承下さい。</p>
      <p>同じ文字を２個、３個使う<strong>ことのは</strong>（例：シュクシャ・シシオドシ）を入力した際には、答えに含まれる文字数分だけ左から評価の表示を行います。ただし緑ハイライトの場合はその限りではありません。<br><strong>たんご</strong>が「シュクシャ」、入力した<strong>ことのは</strong>が「シシオドシ」の場合「シ」の１文字目が緑２文字目が黄色、３文字目がグレーにハイライトされます。</p>
      <p>出題単語に対するフィルタリングを明確には行っていません。本アプリにて出題される単語は「政治・宗教的・性差別・性的」な意図を含みません。</p>

      <h2 id="hatena_close"><u style="cursor: pointer;" id="hatena_close_u">説明を閉じる</u></h2>
      <hr>
      <div></div>
      <p><small>たんごは乱数を用いて毎日辞書より生成しています。内部のJavaScriptを解析すると取得出来ますが、そのような行動はお控え下さい。</small></p>
      <img alt="クリエイティブ・コモンズ・ライセンス" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
`

const SET_TEXT_EN = `
<h2>Color change</h2>
<p>The resulting color of the text output will not change.</p>
<div id="change_colour">
  <label>
    <input type="radio" id="colour_0" name="colour" value="0" onclick="ChangeColor('rgb(167,210,141)','rgb(252, 201, 72)')">
    <div class="colour_ex_box" style="background-color: rgb(167,210,141);"></div><div class="colour_ex_box" style="background-color: rgb(252, 201, 72);"></div>
  </label>
  <br>
  <label>
    <input type="radio" id="colour_1" name="colour" value="1" onclick="ChangeColor('#F5793A','#85C0F9')">
    <div class="colour_ex_box" style="background-color: #F5793A;"></div><div class="colour_ex_box" style="background-color: #85C0F9;"></div>
  </label>
  <br>
  <label>
    <input type="radio" id="colour_2" name="colour" value="2" onclick="ChangeColor('rgb(115, 145, 97)','rgb(188, 230, 163)')">
    <div class="colour_ex_box" style="background-color: rgb(115, 145, 97);"></div><div class="colour_ex_box" style="background-color: rgb(188, 230, 163);"></div>
  </label>
</div>
<br>
<h2>Register new words</h2>
<p>If you want to register a new word, please submit it <a href="https://docs.google.com/forms/d/e/1FAIpQLSeqAiw5vTc2a2tA2S4614rF42P4Wi-VF9tyyH6GDrmzaaaanw/viewform?usp=sf_link" target="_blank">Google Form</a>. It may take some time for the new word to be added to the dictionary, but it will be added under certain conditions.</p>
<h2>License</h2>
<div style="font-size: 0.9em;">
  <p>This work is licensed under the BSD License.<br>This work is also licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) License.</p>
  <p>This work also uses software from the following author: The UniDic Consortium "UniDic-cwj_3.1.0" [<a  href = "https://ccd.ninjal.ac.jp/unidic/"target="_blank">https://ccd.ninjal.ac.jp/unidic/</a>].<br>
  "UniDic-cwj_3.1.0" is licensed under the BSD License and Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) License.</p>
  <p>This work also uses software from the following author: 国立国語研究所(2004)『分類語彙表増補改訂版データベース』(ver.1.0)<br>国立国語研究所(2004)『分類語彙表増補改訂版データベース』(ver.1.0) is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) License.</p>
</div>
<h2>Bug Reports</h2>
<p>If you encounter any bugs and want to share them, please post them <a href="https://github.com/plumchloride/tango/issues/new?assignees=&labels=bug&template=bug_report.md&title=" target="_blank">Issues on GitHub</a>.</p>
<h2>Other</h2>
<p>The code can be found on GitHub below.</p>
<p><a href="https://github.com/plumchloride/tango" target="_blank"><img id="github_img" src="https://gh-card.dev/repos/plumchloride/tango.svg"></a></p>


<div style="display: flex;justify-content: center;">
  <address>
    &copy; 2022 Rikito Ohnishi
  </address>
</div>
`
const SET_TEXT_JP = `
<h2>色変更</h2>
<p>結果としてテキスト出力される色は変わりません。</p>
<div id="change_colour">
  <label>
    <input type="radio" id="colour_0" name="colour" value="0" onclick="ChangeColor('rgb(167,210,141)','rgb(252, 201, 72)')">
    <div class="colour_ex_box" style="background-color: rgb(167,210,141);"></div><div class="colour_ex_box" style="background-color: rgb(252, 201, 72);"></div>
  </label>
  <br>
  <label>
    <input type="radio" id="colour_1" name="colour" value="1" onclick="ChangeColor('#F5793A','#85C0F9')">
    <div class="colour_ex_box" style="background-color: #F5793A;"></div><div class="colour_ex_box" style="background-color: #85C0F9;"></div>
  </label>
  <br>
  <label>
    <input type="radio" id="colour_2" name="colour" value="2" onclick="ChangeColor('rgb(115, 145, 97)','rgb(188, 230, 163)')">
    <div class="colour_ex_box" style="background-color: rgb(115, 145, 97);"></div><div class="colour_ex_box" style="background-color: rgb(188, 230, 163);"></div>
  </label>
</div>
<br>
<h2>残り候補数</h2>
<p>現在取り組み中</p>
<h2>新規単語登録</h2>
<p>新規単語を登録したい場合は<a href="https://docs.google.com/forms/d/e/1FAIpQLSeqAiw5vTc2a2tA2S4614rF42P4Wi-VF9tyyH6GDrmzaaaanw/viewform?usp=sf_link" target="_blank">このフォーム</a>から投稿して下さい。反映まで時間をいただくと思いますが、一定の条件のもと辞書に追加いたします。</p>
<h2>バグ報告</h2>
<p>バグ等が発生し共有をしたい場合は<a href="https://github.com/plumchloride/tango/issues/new?assignees=&labels=bug&template=bug_report.md&title=" target="_blank">GitHub上のissues</a>もしくは作者の<a href="https://twitter.com/plum_chloride" target="_blank">Twitter</a>宛てにに投稿して下さい。</p>
<h2>ライセンス</h2>
<div style="font-size: 0.9em;">
  <p>本アプリケーションは <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">クリエイティブ・コモンズ 表示 - 非営利 - 継承 4.0 国際 ライセンス</a>の下に提供されています。<br>本アプリケーションはくわえて、BSDライセンスの下に提供されています。</p>
  <p>また本アプリケーションは次の著作者によるソフトウェアを使用しています：The UniDic Consortium「UniDic-cwj_3.1.0」 [<a  href = "https://ccd.ninjal.ac.jp/unidic/"target="_blank">https://ccd.ninjal.ac.jp/unidic/</a>]<br>
    「UniDic-cwj_3.1.0」はBSDライセンスおよびクリエイティブ・コモンズ 表示-非営利-継承4.0 非移植(CC BY-NC-SA 4.0)のもと提供されています。</p>
  <p>また本アプリケーションは次の著作者によるソフトウェアを使用しています：国立国語研究所(2004)『分類語彙表増補改訂版データベース』(ver.1.0)<br>国立国語研究所(2004)『分類語彙表増補改訂版データベース』(ver.1.0)はクリエイティブ・コモンズ 表示-非営利-継承4.0 非移植(CC BY-NC-SA 4.0)のもと提供されています。</p>
</div>
<h2>その他</h2>
<p>コードに関しては以下のGitHubに掲載されています。</p>
<p><a href="https://github.com/plumchloride/tango" target="_blank"><img id="github_img" src="https://gh-card.dev/repos/plumchloride/tango.svg"></a></p>
<h2>その他報告</h2>
<p>もし感想を送る場合やバグ報告の際は<a href="https://twitter.com/plum_chloride" target="_blank">こちらのTwitter</a>より連絡して下さい</p>

<div style="display: flex;justify-content: center;">
  <address>
    &copy; 2022 Rikito Ohnishi
  </address>
</div>
`
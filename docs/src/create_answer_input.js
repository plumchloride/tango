let hiragana = ["あ","い","う","え","お","か","き","く","け","こ","さ","し","す","せ","そ","た","ち","つ","て","と","な","に","ぬ","ね","の","は","ひ","ふ","へ","ほ",
                "ま","み","む","め","も","や","ゆ","よ","ら","り","る","れ","ろ","わ","を","ん",
                "が","ぎ","ぐ","げ","ご","ざ","じ","ず","ぜ","ぞ","だ","ぢ","づ","で","ど","ば","び","ぶ","べ","ぼ","ぱ","ぴ","ぷ","ぺ","ぽ","ぁ","ぃ","ぅ","ぇ","ぉ","っ","ゃ","ゅ","ょ","ー"];
let katakana = ["ア","イ","ウ","エ","オ","カ","キ","ク","ケ","コ","サ","シ","ス","セ","ソ","タ","チ","ツ","テ","ト","ナ","ニ","ヌ","ネ","ノ","ハ","ヒ","フ","ヘ","ホ",
                "マ","ミ","ム","メ","モ","ヤ","ユ","ヨ","ラ","リ","ル","レ","ロ","ワ","ヲ","ン",
                "ガ","ギ","グ","ゲ","ゴ","ザ","ジ","ズ","ゼ","ゾ","ダ","ヂ","ヅ","デ","ド","バ","ビ","ブ","ベ","ボ","パ","ピ","プ","ペ","ポ","ァ","ィ","ゥ","ェ","ォ","ッ","ャ","ュ","ョ","ー"];
$input = document.getElementById("input_text");
$input.addEventListener('input',(e)=>{
  if(end_tf){return};
  $input = document.getElementById("input_text");
  _anser = $input.value.split('');
  before_anser = [];
  _anser.forEach(element => {
    if(hiragana.indexOf(element) == -1){
      // カタカナや英語だった場合はそのまま（確定時にテキスト種別を取得する。）
      before_anser.push(element);
    }else{
      // ひらがなをカタカナに
      before_anser.push(katakana[hiragana.indexOf(element)]);
    }
  });
  b_ans = before_anser.slice(0,5);
  b_ans.push("　","　","　","　","　");
  anser = b_ans.slice(0,5);
  $input.value = before_anser.slice(0,5).toString().replace(/,/g, "");
  DisplayUpdate();
})
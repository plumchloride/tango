let title = "";
let pronunciation = "";

// シード値付きの乱数
// https://sbfl.net/blog/2017/06/01/javascript-reproducible-random/
class Random {
  constructor(seed = 88675123) {
    this.x = 415845311;
    this.y = 845103456;
    this.z = 561321120;
    this.w = seed;
  }
  
  // XorShift
  next() {
    const t = this.x ^ (this.x << 11);
    this.x = this.y;
    this.y = this.z;
    this.z = this.w;
    return this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8));
  }
  
  // min 以上 max 以下の乱数を生成する
  nextInt(min, max) {
    const r = Math.abs(this.next());
    return min + (r % (max + 1 - min));
  }
}
const GetRandom = ()=>{
  jst = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
  seed = (parseInt(String(jst.getFullYear())+String(jst.getMonth())+String(jst.getDate())) +801)*2001;
  rand = new Random(seed);
  random_num = rand.nextInt(0,Q_data["title"].length);
  return random_num;
}

const GetTodayWord = ()=>{
  random_num = GetRandom();
  title = Q_data["title"][random_num];
  pronunciation  = Q_data["pronunciation"][random_num];
  console.log(title +":"+pronunciation);
  wake_up_progress.getWord = true;
  Progress();
}
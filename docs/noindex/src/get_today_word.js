let title = "";
let pronunciation = "";
let pass_day = 0;

// シード値付きの乱数
// https://sbfl.net/blog/2017/06/01/javascript-reproducible-random/
class Random {
  constructor(seed,x) {
    this.x = x;
    this.y = 4120343;
    this.z = 856135;
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
  const First_Day = Date.UTC(2022,1,21);
  const Now_Day = Date.UTC(jst.getFullYear(),jst.getMonth()+1,jst.getDate());
  timestamp = Now_Day - First_Day;
  pass_day =  Math.floor(timestamp/(24 * 60 * 60 * 1000));
  year = parseInt(String(jst.getFullYear()));
  month = parseInt(String(jst.getMonth()));
  day = parseInt(String(jst.getDate()));
  seed = year+month*801+day*13;
  rand = new Random(seed,day*2001);
  random_num = rand.nextInt(0,Q_data["title"].length);
  return random_num;
}

const GetTodayWord = ()=>{
  random_num = GetRandom();
  title = Q_data["title"][random_num];
  pronunciation  = Q_data["pronunciation"][random_num];
  wake_up_progress.getWord = true;
  //

  Progress();
}
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
  nowtime = new Date();
  First_Day = new Date("2022/1/21");
  Now_Day = new Date();
  timestamp = Now_Day - First_Day;
  pass_day =  Math.floor(timestamp/(24 * 60 * 60 * 1000));
  year = parseInt(String(nowtime.getFullYear()));
  month = parseInt(String(nowtime.getMonth()));
  day = parseInt(String(nowtime.getDate()));
  // console.log(`${year}/${month+1}/${day}`)
  seed = year+month*801+day*13;
  rand = new Random(seed,day*2001);
  random_num = rand.nextInt(0,Q_data["title"].length);
  return random_num;
}

const GetRandom_before = ()=>{
  b_nowtime = new Date();
  b_nowtime = new Date(b_nowtime.setDate(b_nowtime.getDate() - 1));
  b_year = parseInt(String(b_nowtime.getFullYear()));
  b_month = parseInt(String(b_nowtime.getMonth()));
  b_day = parseInt(String(b_nowtime.getDate()));
  b_seed = b_year+b_month*801+b_day*13;
  b_rand = new Random(b_seed,b_day*2001);
  b_random_num = b_rand.nextInt(0,Q_data["title"].length);
  return b_random_num;
}

const GetTodayWord = ()=>{
  random_num = GetRandom();
  title = Q_data["title"][random_num];
  pronunciation  = Q_data["pronunciation"][random_num];
  wake_up_progress.getWord = true;
  Progress();
}

// 昨日の単語
const getYesterdayTango = ()=>{
  random_num = GetRandom_before();
  b_title = Q_data["title"][random_num];
  b_pronunciation  = Q_data["pronunciation"][random_num];
  document.getElementById("before_tango").innerText = `「${b_title}」（${b_pronunciation}）`
}
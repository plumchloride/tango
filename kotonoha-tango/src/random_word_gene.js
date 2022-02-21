let CRA_before_check = false;
let CRA_rand;
const createRandomAnsower = ()=>{
  CRA_nowtime = new Date();
  CRA_day = parseInt(String(CRA_nowtime.getDate()));
  CRA_sec = parseInt(String(CRA_nowtime.getSeconds()));
  CRA_mil = parseInt(String(CRA_nowtime.getMilliseconds()));
  if(!CRA_before_check){
    CRA_seed = CRA_day*801+CRA_sec*13+CRA_mil;
    CRA_rand = new Random(CRA_seed,CRA_sec*13+CRA_mil*2001);
    CRA_before_check = true
  }
  CRA_random_num = CRA_rand.nextInt(0,A_data.length);
  CRA_text = A_data[CRA_random_num];
  alertShow(`${CRA_text}`,1000);
  CRA_array = CRA_text.split('');
  anser = CRA_array;
  $input = document.getElementById("input_text");
  $input.value = CRA_text;
  DisplayUpdate();
}
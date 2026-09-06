const KEY="mycoin_exchange_demo_v4";
let s=JSON.parse(localStorage.getItem(KEY)||"null")||{
 user:null,b:0,cash:0,p:1,last:1,startValue:0,f:false,h:[],prices:[1]
};
const $=id=>document.getElementById(id);
const save=()=>localStorage.setItem(KEY,JSON.stringify(s));
const ru=n=>"₹"+Number(n).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});

function createAccount(){
 const n=$("name").value.trim();
 if(n.length<2)return alert("कम से कम 2 अक्षर का नाम डालें।");
 const clean=n.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,8)||"USER";
 s={user:{name:n,id:"MYC-"+clean+"-"+Math.floor(1000+Math.random()*9000)},b:0,cash:0,p:1,last:1,startValue:0,f:false,h:[],prices:[1]};
 save();render();location.hash="wallet";
}
function logout(){
 if(!s.user)return;
 if(!confirm("Demo ID और उसका local data हटाना है?"))return;
 localStorage.removeItem(KEY);
 s={user:null,b:0,cash:0,p:1,last:1,startValue:0,f:false,h:[],prices:[1]};
 render();
}
function add(icon,text){
 s.h.unshift({icon,text,t:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})});
 s.h=s.h.slice(0,50);
}
function faucet(){
 if(!s.user)return alert("पहले Demo ID बनाइए।");
 if(s.f)return msg("fmsg","Faucet पहले ही claim हो चुका है।",1);
 s.b=1000;s.f=true;s.startValue=1000*s.p;
 add("🎁","Received 1,000 MYC");save();render();msg("fmsg","1,000 Demo MYC wallet में आ गए।");
}
function move(){
 s.last=s.p;
 s.p=Math.max(.01,s.p*(1+(Math.random()*.24-.12)));
 s.prices.push(s.p);
 if(s.prices.length>50)s.prices.shift();
}
function buy(){
 if(!s.user)return msg("tmsg","पहले Demo ID बनाइए।",1);
 const a=+$("amount").value;
 if(!(a>0))return msg("tmsg","सही MYC amount डालें।",1);
 const cost=a*s.p;
 if(s.cash<cost)return msg("tmsg",`BUY के लिए ${ru(cost)} virtual cash चाहिए। पहले MYC SELL करें।`,1);
 s.cash-=cost;s.b+=a;move();
 add("🟢",`Bought ${a} MYC @ ${ru(s.last)}`);
 save();render();msg("tmsg",`BUY successful: ${a} MYC`);
}
function sell(){
 if(!s.user)return msg("tmsg","पहले Demo ID बनाइए।",1);
 const a=+$("amount").value;
 if(!(a>0))return msg("tmsg","सही MYC amount डालें।",1);
 if(a>s.b)return msg("tmsg","इतना MYC balance में नहीं है।",1);
 const got=a*s.p;
 s.b-=a;s.cash+=got;move();
 add("🔴",`Sold ${a} MYC @ ${ru(s.last)}`);
 save();render();msg("tmsg",`SELL successful: ${a} MYC = ${ru(got)} virtual cash`);
}
function clearHistory(){s.h=[];save();render()}
function msg(id,t,e){
 const x=$(id);x.textContent=t;x.className="msg "+(e?"error":"success");
 setTimeout(()=>{x.textContent=""},3500);
}
function esc(x){return x.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function drawChart(){
 const c=$("chart"),ctx=c.getContext("2d"),w=c.width,h=c.height;
 ctx.clearRect(0,0,w,h);
 ctx.strokeStyle="#263754";ctx.lineWidth=1;
 for(let i=1;i<5;i++){let y=i*h/5;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
 const arr=s.prices, min=Math.min(...arr)*.97,max=Math.max(...arr)*1.03;
 ctx.beginPath();
 arr.forEach((v,i)=>{
   const x=i*(w-30)/Math.max(1,arr.length-1)+15;
   const y=h-20-(v-min)/(max-min||1)*(h-40);
   i?ctx.lineTo(x,y):ctx.moveTo(x,y);
 });
 ctx.strokeStyle="#62a3ff";ctx.lineWidth=4;ctx.stroke();
}
function render(){
 const a=$("signup"),w=$("walletbox");
 if(!s.user){a.classList.remove("hide");w.classList.add("hide")}
 else{
   a.classList.add("hide");w.classList.remove("hide");
   $("uid").textContent=s.user.id;
   $("bal").textContent=s.b.toLocaleString("en-IN")+" MYC";
   $("price").textContent=ru(s.p);$("tradeprice").textContent=ru(s.p);
   $("cash").textContent=ru(s.cash);
 }
 const mycValue=s.b*s.p,total=mycValue+s.cash;
 const pl=total-(s.startValue||0);
 $("portfolio").textContent=ru(total);$("mycvalue").textContent=ru(mycValue);
 $("cash2").textContent=ru(s.cash);$("total").textContent=ru(total);
 $("pl").textContent="P/L "+(pl>=0?"+":"")+ru(pl);
 $("bar").style.width=Math.min(100,Math.max(0,(total/Math.max(1000,total))*100))+"%";
 const change=((s.p-s.last)/s.last)*100;
 $("change").textContent=(change>=0?"+":"")+change.toFixed(2)+"%";
 $("trend").textContent=change>0.05?"UP":change<-0.05?"DOWN":"FLAT";
 $("trend").className="pill "+(change>0.05?"up":change<-0.05?"down":"");
 $("history").innerHTML=s.h.length?s.h.map(x=>`<li><span>${x.icon} ${esc(x.text)}</span><small>${x.t}</small></li>`).join(""):"<li>No transactions yet.</li>";
 drawChart();
}
document.addEventListener("DOMContentLoaded",render);
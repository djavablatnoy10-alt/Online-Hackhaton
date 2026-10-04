const arena=document.getElementById("arena"),target=document.getElementById("target"),start=document.getElementById("start"),scoreEl=document.getElementById("score"),timeEl=document.getElementById("time"),status=document.getElementById("status"),bestEl=document.getElementById("best");
let score=0,time=20,running=false,timer=null,best=Number(localStorage.getItem("signalBest")||0);

bestEl.textContent=best;
function moveTarget(){
  const pad=12,maxX=Math.max(pad,arena.clientWidth-target.offsetWidth-pad),maxY=Math.max(pad,arena.clientHeight-target.offsetHeight-pad);
  target.style.left=Math.floor(pad+Math.random()*(maxX-pad))+"px";
  target.style.top=Math.floor(pad+Math.random()*(maxY-pad))+"px";
}
function finish(){
  running=false;clearInterval(timer);target.style.display="none";start.disabled=false;start.textContent="Играть снова";
  status.textContent=`Сеанс завершён. Поймано сигналов: ${score}.`;
  if(score>best){best=score;bestEl.textContent=best;localStorage.setItem("signalBest",String(best));status.textContent+= " Новый рекорд!";
}
}
start.addEventListener("click",()=>{
  score=0;time=20;running=true;scoreEl.textContent="0";timeEl.textContent="20";status.textContent="Поймай как можно больше сигналов.";
  start.disabled=true;start.textContent="Игра идёт";target.style.display="block";moveTarget();clearInterval(timer);
  timer=setInterval(()=>{time--;timeEl.textContent=String(time);if(time<=0)finish()},1000);
});
target.addEventListener("click",()=>{if(!running)return;score++;scoreEl.textContent=String(score);moveTarget()});
window.addEventListener("resize",()=>{if(running)moveTarget()});

const start=document.getElementById("start"),stabilize=document.getElementById("stabilize"),bar=document.getElementById("bar"),countEl=document.getElementById("count"),timeEl=document.getElementById("time"),status=document.getElementById("status"),core=document.getElementById("core"),bestEl=document.getElementById("best");
let running=false,count=0,time=10,timer=null,best=Number(localStorage.getItem("reactorBest")||0);bestEl.textContent=best;
function end(win){
  running=false;clearInterval(timer);stabilize.disabled=true;start.disabled=false;start.textContent="Запустить снова";
  status.textContent=win==="record"?"Система стабилизирована! Новый рекорд по времени.":win==="win"?"Система стабилизирована!":`Время вышло. Стабилизация: ${count}/12.`;
}
start.addEventListener("click",()=>{
  running=true;count=0;time=10;countEl.textContent="0";timeEl.textContent="10";bar.style.width="0%";status.textContent="Нажимай 12 раз за 10 секунд.";
  start.disabled=true;start.textContent="Игра идёт";stabilize.disabled=false;clearInterval(timer);
  timer=setInterval(()=>{time--;timeEl.textContent=String(time);if(time<=0&&running)end(false)},1000);
});
stabilize.addEventListener("click",()=>{
  if(!running)return;count++;countEl.textContent=`${count}/12`;bar.style.width=`${Math.min(100,count/12*100)}%`;core.classList.add("hot");setTimeout(()=>core.classList.remove("hot"),120);
  if(count>=12){
  const isRecord=best===0||time<best;
  if(isRecord){best=time;bestEl.textContent=best;localStorage.setItem("reactorBest",String(best))}
  end(isRecord?"record":"win");
}
});
stabilize.disabled=true;

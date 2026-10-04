const board=document.getElementById("board"),restart=document.getElementById("restart"),status=document.getElementById("status"),movesEl=document.getElementById("moves"),progress=document.getElementById("progress"),bestEl=document.getElementById("best");
const symbols=["🌙","🔴","🤖","🛰️","⭐","🌍"];
let first=null,lock=false,matches=0,moves=0,best=Number(localStorage.getItem("memoryBest")||0);bestEl.textContent=best;
function setup(){
  board.innerHTML="";first=null;lock=false;matches=0;moves=0;movesEl.textContent="0";progress.style.width="0%";status.textContent="Найди все 6 пар.";
  const deck=[...symbols,...symbols].sort(()=>Math.random()-.5);
  deck.forEach(s=>{
    const b=document.createElement("button");b.type="button";b.className="memory-card";b.dataset.symbol=s;b.textContent=s;
    b.addEventListener("click",()=>flip(b));board.appendChild(b);
  });
}
function flip(card){
  if(lock||card===first||card.classList.contains("matched")||card.classList.contains("flipped"))return;
  card.classList.add("flipped");
  if(!first){first=card;return}
  moves++;movesEl.textContent=String(moves);
  if(first.dataset.symbol===card.dataset.symbol){
    first.classList.add("matched");card.classList.add("matched");matches++;first=null;
    progress.style.width=`${matches/6*100}%`;status.textContent=matches===6?"Победа! Все пары найдены.":`Пары: ${matches}/6`;
    if(matches===6&&(best===0||moves<best)){best=moves;bestEl.textContent=best;localStorage.setItem("memoryBest",String(best));status.textContent+=" Новый рекорд по ходам!"}
    return;
  }
  lock=true;const old=first;setTimeout(()=>{old.classList.remove("flipped");card.classList.remove("flipped");first=null;lock=false},650);
}
restart.addEventListener("click",setup);setup();

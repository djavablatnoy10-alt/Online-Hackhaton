const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
const current=location.pathname.split("/").pop()||"index.html";
$$(".nav a").forEach(a=>{if(a.getAttribute("href")===current)a.classList.add("active")});
$$(".mobile-nav a").forEach(a=>{if(a.getAttribute("href")===current)a.classList.add("active")});

const menuBtn=$("#menuBtn"),mobileNav=$("#mobileNav");
function closeMenu(){if(!mobileNav||!menuBtn)return;mobileNav.classList.remove("open");mobileNav.setAttribute("aria-hidden","true");menuBtn.setAttribute("aria-expanded","false");menuBtn.textContent="☰"}
function openMenu(){if(!mobileNav||!menuBtn)return;mobileNav.classList.add("open");mobileNav.setAttribute("aria-hidden","false");menuBtn.setAttribute("aria-expanded","true");menuBtn.textContent="×"}
menuBtn?.addEventListener("click",()=>mobileNav.classList.contains("open")?closeMenu():openMenu());
mobileNav?.addEventListener("click",e=>{if(e.target.closest("a"))closeMenu()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeMenu();closeModal()}});
document.addEventListener("click",e=>{if(mobileNav?.classList.contains("open")&&!mobileNav.contains(e.target)&&!menuBtn?.contains(e.target))closeMenu()});

let soundOn=false,audioCtx=null;
function ping(){if(!soundOn)return;if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type="sine";o.frequency.value=640;g.gain.setValueAtTime(.0001,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.035,audioCtx.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.13);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+.14)}
$("#soundBtn")?.addEventListener("click",()=>{soundOn=!soundOn;$("#soundBtn").textContent=soundOn?"◉":"◌";ping()});

const modal=$("#modal");
function closeModal(){if(!modal)return;modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow=""}
function openModal(title,text,fact="",kicker="ARCHIVE"){if(!modal)return;$("#modalKicker").textContent=kicker;$("#modalTitle").textContent=title;$("#modalText").textContent=text;$("#modalFact").textContent=fact;modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";$("#modalClose")?.focus()}
$("#modalClose")?.addEventListener("click",closeModal);$(".backdrop")?.addEventListener("click",closeModal);
$$("[data-modal]").forEach(b=>b.addEventListener("click",()=>openModal(b.dataset.title||"Досье",b.dataset.text||"",b.dataset.fact||"",b.dataset.kicker||"DOSSIER")));

/* Archive filters */
const archiveCards=$$(".archive-card"),filterButtons=$$(".filter"),search=$("#archiveSearch");
function filterArchive(){const active=$(".filter.active")?.dataset.filter||"all",q=(search?.value||"").trim().toLowerCase();archiveCards.forEach(card=>{const okWorld=active==="all"||card.dataset.world===active;const okText=!q||card.textContent.toLowerCase().includes(q);card.dataset.hidden=String(!(okWorld&&okText))})}
filterButtons.forEach(b=>b.addEventListener("click",()=>{filterButtons.forEach(x=>x.classList.remove("active"));b.classList.add("active");filterArchive()}));search?.addEventListener("input",filterArchive);

/* Map */
const mapWorld=$("#mapWorld"),mapLocations=$("#mapLocations"),mapTitle=$("#mapTitle"),mapMeta=$("#mapMeta");
const moonData={title:"Луна",meta:"LUNAR ARCHIVE",locations:[["APOLLO","Посадочная техника","Исторические объекты лунных миссий."],["SCIENCE","Научные приборы","Оборудование научных экспериментов."],["LEGACY","Цифровой объект","Интерактивная точка архива."]]};
const marsData={title:"Марс",meta:"MARS ARCHIVE",locations:[["VIKING","Viking","Посадочная техника раннего исследования Марса."],["PATHFINDER","Sojourner","Мобильный ровер миссии Mars Pathfinder."],["LEGACY","Robot legacy","Точка об истории марсианской робототехники."]]};
let mapData="moon";
function renderMap(world){mapData=world;const d=world==="moon"?moonData:marsData;if(mapTitle)mapTitle.textContent=d.title;if(mapMeta)mapMeta.textContent=d.meta;mapWorld?.classList.toggle("mars",world==="mars");if(!mapLocations)return;
mapLocations.innerHTML=d.locations.map((x,i)=>`<button class="location${i===0?" active":""}" data-index="${i}" type="button"><b>${x[0]}</b><span>${x[1]}</span></button>`).join("");
$$(".location",mapLocations).forEach(b=>b.addEventListener("click",()=>selectLocation(+b.dataset.index)));selectLocation(0)}
function selectLocation(i){const d=mapData==="moon"?moonData:marsData,x=d.locations[i]||d.locations[0];$$(".location",mapLocations).forEach((b,n)=>b.classList.toggle("active",n===i));$$(".map-pin").forEach((p,n)=>p.classList.toggle("active",n===i));if($("#mapInfo"))$("#mapInfo").textContent=x[1]+" — "+x[2]}
$$(".world-tab").forEach(b=>b.addEventListener("click",()=>{$$(".world-tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderMap(b.dataset.world)}));
if(mapWorld&&mapLocations)renderMap("moon");

/* Signal Hunt */
const signal=$(".signal"),signalStart=$("#signalStart"),signalScore=$(" #signalScore".trim()),signalTimer=$("#signalTimer"),signalNote=$("#signalNote");
let signalScoreVal=0,signalTime=20,signalRunning=false,signalTimerId=null;
function placeSignal(){if(!signal)return;const arena=$(".arena");const maxX=Math.max(5,arena.clientWidth-45),maxY=Math.max(5,arena.clientHeight-45);signal.style.left=Math.round(5+Math.random()*(maxX-5))+"px";signal.style.top=Math.round(5+Math.random()*(maxY-5))+"px";signal.style.display="block"}
function endSignal(msg){signalRunning=false;clearInterval(signalTimerId);signal.style.display="none";signalNote.textContent=msg;signalStart.disabled=false;signalStart.textContent="Играть снова"}
signal?.addEventListener("click",()=>{if(!signalRunning)return;signalScoreVal++;signalScore.textContent=String(signalScoreVal);placeSignal();ping()});
signalStart?.addEventListener("click",()=>{signalScoreVal=0;signalTime=20;signalRunning=true;signalScore.textContent="0";signalTimer.textContent="20";signalNote.textContent="Поймай сигнал до окончания времени.";signalStart.disabled=true;signalStart.textContent="Идёт игра";placeSignal();clearInterval(signalTimerId);signalTimerId=setInterval(()=>{signalTime--;signalTimer.textContent=String(signalTime);if(signalTime<=0)endSignal(`Время! Ты поймал сигналов: ${signalScoreVal}.`)},1000)});

/* Memory */
const memory=$(".memory-grid"),memoryRestart=$("#memoryRestart"),memoryStatus=$("#memoryStatus"),memorySymbols=["🌙","🔴","🤖","🛰️","⭐","🌍"];
let firstCard=null,lockBoard=false,matches=0;
function setupMemory(){if(!memory)return;memory.innerHTML="";matches=0;firstCard=null;lockBoard=false;memoryStatus.textContent="0/6 пар";const deck=[...memorySymbols,...memorySymbols].sort(()=>Math.random()-.5);deck.forEach((symbol,i)=>{const b=document.createElement("button");b.className="memory-card";b.type="button";b.dataset.symbol=symbol;b.dataset.index=i;b.textContent=symbol;b.addEventListener("click",()=>flipMemory(b));memory.appendChild(b)})}
function flipMemory(card){if(lockBoard||card.classList.contains("flipped")||card.classList.contains("matched"))return;card.classList.add("flipped");if(!firstCard){firstCard=card;return}if(firstCard.dataset.symbol===card.dataset.symbol){firstCard.classList.add("matched");card.classList.add("matched");matches++;memoryStatus.textContent=matches===6?"Победа!":"Пар: "+matches+"/6";firstCard=null;ping();return}lockBoard=true;setTimeout(()=>{card.classList.remove("flipped");firstCard.classList.remove("flipped");firstCard=null;lockBoard=false},650)}
memoryRestart?.addEventListener("click",setupMemory);setupMemory();

/* Reactor */
const reactorCore=$("#reactorCore"),reactorBar=$("#reactorBar"),reactorStart=$("#reactorStart"),reactorNote=$("#reactorNote"),reactorClicks=$("#reactorClicks");
let reactorRunning=false,reactorCount=0,reactorTimer=null,reactorTime=10;
function endReactor(win){reactorRunning=false;clearInterval(reactorTimer);reactorStart.disabled=false;reactorStart.textContent="Запустить снова";reactorNote.textContent=win?"Стабилизация завершена!":"Время вышло — реактор не успел стабилизироваться."}
reactorStart?.addEventListener("click",()=>{reactorRunning=true;reactorCount=0;reactorTime=10;reactorClicks.textContent="0/12";reactorBar.style.width="0%";reactorNote.textContent="Нажимай «Стабилизировать» 12 раз за 10 секунд.";reactorStart.disabled=true;reactorStart.textContent="Игра идёт";clearInterval(reactorTimer);reactorTimer=setInterval(()=>{reactorTime--;if(reactorTime<=0&&reactorRunning)endReactor(false)},1000)});
$("#stabilizeBtn")?.addEventListener("click",()=>{if(!reactorRunning)return;reactorCount++;reactorClicks.textContent=`${reactorCount}/12`;reactorBar.style.width=`${Math.min(100,reactorCount/12*100)}%`;reactorCore?.classList.toggle("hot",reactorCount%2===0);setTimeout(()=>reactorCore?.classList.remove("hot"),100);if(reactorCount>=12)endReactor(true);ping()});

/* Quiz */
const questions=[
  ["Где находится часть техники после лунных миссий?",["На Луне","Только на Земле","На Венере"],0],
  ["Какая миссия связана с посадочными станциями Viking?",["Марс","Юпитер","Титан"],0],
  ["В каком году работал Sojourner на Марсе?",["1997","1969","2018"],0],
  ["Что делал Sojourner?",["Исследовал поверхность Марса","Строил ракету","Измерял океан Земли"],0],
  ["Зачем нужен цифровой архив?",["Чтобы сохранять и объяснять историю","Чтобы удалять старые данные","Чтобы заменить все музеи"],0],
  ["Что помогает сделать историю техники интереснее школьникам?",["Интерактив и игры","Только длинные таблицы","Только термины"],0],
  ["Что можно показать на интерактивной карте?",["Места объектов и миссий","Пароли экипажа","Личные данные инженеров"],0],
  ["Что происходит с техникой после завершения миссии?",["Она может стать историческим наследием","Она обязательно возвращается на Землю","Она всегда сразу уничтожается"],0]
];

/* Варианты ответов перемешиваются при каждом запуске квиза.
   Правильный вариант определяется по тексту, поэтому его позиция не фиксирована. */
let quizQuestions=[];
let qi=0,score=0,answered=false,quizFinished=false;

function shuffleArray(arr){
  const copy=[...arr];
  for(let i=copy.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [copy[i],copy[j]]=[copy[j],copy[i]];
  }
  return copy;
}

function buildQuiz(){
  quizQuestions=questions.map(([text,options,correctIndex])=>{
    const correctAnswer=options[correctIndex];
    return {
      text,
      options:shuffleArray(options),
      correctAnswer
    };
  });
  qi=0;
  score=0;
  quizFinished=false;
}

const qCard=$("#qCard");

function renderQuiz(){
  if(!qCard)return;
  answered=false;
  const q=quizQuestions[qi];

  $("#qNum").textContent=`${qi+1} / ${quizQuestions.length}`;
  $("#qScore").textContent=`Счёт: ${score}`;
  $("#qProgress").style.width=`${qi/quizQuestions.length*100}%`;
  $("#qQuestion").textContent=q.text;
  $("#qOptions").innerHTML="";

  q.options.forEach(optionText=>{
    const b=document.createElement("button");
    b.type="button";
    b.className="option";
    b.textContent=optionText;
    b.dataset.correct=String(optionText===q.correctAnswer);
    b.addEventListener("click",()=>answerQuiz(optionText));
    $("#qOptions").appendChild(b);
  });

  $("#qResult").textContent="";
  $("#nextQuestion").classList.add("hidden");
  $("#nextQuestion").textContent="Следующий вопрос";
}

function answerQuiz(selectedAnswer){
  if(answered||quizFinished)return;

  answered=true;
  const q=quizQuestions[qi];

  $$(".option",$("#qOptions")).forEach(b=>{
    const isCorrect=b.dataset.correct==="true";
    if(isCorrect)b.classList.add("correct");
    if(b.textContent===selectedAnswer&&!isCorrect)b.classList.add("wrong");
  });

  if(selectedAnswer===q.correctAnswer){
    score++;
    $("#qResult").textContent="✓ Верно!";
  }else{
    $("#qResult").textContent="Не совсем. Правильный вариант отмечен.";
  }

  $("#qScore").textContent=`Счёт: ${score}`;
  $("#nextQuestion").textContent=qi===quizQuestions.length-1?"Показать результат":"Следующий вопрос";
  $("#nextQuestion").classList.remove("hidden");
  ping();
}

$("#nextQuestion")?.addEventListener("click",()=>{
  if(!answered&&!quizFinished)return;

  if(quizFinished){
    buildQuiz();
    renderQuiz();
    return;
  }

  if(qi<quizQuestions.length-1){
    qi++;
    renderQuiz();
    return;
  }

  quizFinished=true;
  const pct=Math.round(score/quizQuestions.length*100);
  $("#qNum").textContent=`${quizQuestions.length} / ${quizQuestions.length}`;
  $("#qProgress").style.width="100%";
  $("#qQuestion").textContent=`Готово! ${score} из ${quizQuestions.length}`;
  $("#qOptions").innerHTML=`<div class="fact">Результат: ${pct}%. ${pct>=75?"Отличная работа, архивариус!":"Попробуй ещё раз — следующая попытка может быть лучше."}</div>`;
  $("#qResult").textContent="Нажми кнопку ниже, чтобы пройти квиз заново.";
  $("#nextQuestion").textContent="Пройти снова";
});

buildQuiz();
renderQuiz();

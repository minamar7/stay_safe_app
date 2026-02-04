// =========================
// Stay Safe Elite App JS
// =========================
let currentLang = 'en';
let xp = parseInt(localStorage.getItem('xp')) || 0;
let streak = parseInt(localStorage.getItem('streak')) || 1;
let isElite = localStorage.getItem('isElite') === 'true';
let currentQuizData = {};
let currentIndex = 0;
let currentScore = 0;
let activeQuestions = [];

// =========================
// Language Translations
// =========================
const translations = {
  en: { daily:"🛡️ Daily Training", start:"START QUIZ", days:"DAYS", finish:"Congrats! You completed the training.", achievements:"🏆 Achievements", map:"TRAINING MAP", prem_desc:"Unlock all security tools." },
  el: { daily:"🛡️ Καθημερινή Εκπαίδευση", start:"ΞΕΚΙΝΑ ΤΟ ΤΕΣΤ", days:"ΗΜΕΡΕΣ", finish:"Συγχαρητήρια! Ολοκλήρωσες την εκπαίδευση.", achievements:"🏆 Επιτεύγματα", map:"ΧΑΡΤΗΣ ΕΚΠΑΙΔΕΥΣΗΣ", prem_desc:"Ξεκλειδώστε όλα τα εργαλεία ασφαλείας." },
  de: { daily:"🛡️ Tägliches Training", start:"QUIZ STARTEN", days:"TAGE", finish:"Glückwunsch! Training abgeschlossen.", achievements:"🏆 Erfolge", map:"TRAININGSKARTE", prem_desc:"Alle Sicherheitstools freischalten." }
  // Μπορείς να προσθέσεις όλες τις άλλες γλώσσες εδώ
};

// =========================
// Init App
// =========================
function initApp(lang){
  currentLang = lang;
  const set = (id,val)=>{ const el=document.getElementById(id); if(el) el.innerText=val; };
  set('txt_daily', translations[lang].daily);
  set('quiz_btn', translations[lang].start);
  set('txt_days', translations[lang].days);
  set('txt_achievements', translations[lang].achievements);
  set('txt_map', translations[lang].map);
  set('txt_prem_desc', translations[lang].prem_desc);

  document.getElementById('onboarding')?.classList.add('hidden');
  document.getElementById('main_app')?.classList.remove('hidden');

  loadQuizzes(lang);
  updateUI();
}

// =========================
// Load Quizzes
// =========================
function loadQuizzes(lang){
  Promise.all([
    fetch(`quizzes/questions_free_${lang}.json`).then(r=>r.json()),
    fetch(`quizzes/questions_premium_${lang}.json`).then(r=>r.json())
  ]).then(([freeData, premData])=>{
    currentQuizData = {...freeData[lang].levels,...premData[lang].levels};
  }).catch(err=>console.error("Quiz load error",err));
}

// =========================
// Update UI
// =========================
function updateUI(){
  const level = Math.floor(xp/100)+1;
  document.getElementById('level_val')?.innerText = level;
  document.getElementById('xp_fill')?.style.setProperty('width',(xp%100)+'%');
  document.getElementById('streak_val')?.innerText = streak;

  if(level>=2) document.getElementById('badge1')?.classList.add('unlocked');
  if(level>=5) document.getElementById('badge2')?.classList.add('unlocked');
  if(level>=8) document.getElementById('badge3')?.classList.add('unlocked');

  if(level>=7) document.getElementById('step2')?.classList.add('active');
  if(level>=10) document.getElementById('step3')?.classList.add('active');

  if(isElite){
    document.getElementById('prem_locked')?.classList.add('hidden');
    document.getElementById('prem_unlocked')?.classList.remove('hidden');
  }
}

// =========================
// Quiz Logic
// =========================
function startQuiz(){
  const level = Math.floor(xp/100)+1;
  if(level>=7 && !isElite){ openModal(); return; }

  document.getElementById('quiz_btn')?.classList.add('hidden');
  currentScore = 0;
  currentIndex = 0;
  activeQuestions = generateQuestions(level,5);
  renderQuestion();
}

function generateQuestions(level,count){
  const levelQuestions = currentQuizData[level] || [];
  return [...levelQuestions].sort(()=>0.5-Math.random()).slice(0,count);
}

function renderQuestion(){
  if(currentIndex>=activeQuestions.length){ finishQuiz(); return; }
  const q = activeQuestions[currentIndex];
  const quizText = document.getElementById('quiz_text');
  const optionsDiv = document.getElementById('quiz_options');
  if(!quizText||!optionsDiv) return;

  quizText.innerHTML=`<b>Q:</b> ${q.q}`;
  optionsDiv.innerHTML="";
  q.o.forEach((opt,i)=>{
    const btn = document.createElement('button');
    btn.className='main-cta';
    btn.textContent=opt;
    btn.onclick=()=>checkAnswer(i);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selected){
  const q=activeQuestions[currentIndex];
  const buttons=document.querySelectorAll('#quiz_options button');
  buttons.forEach((btn,i)=>{
    if(i===q.a) btn.style.background='var(--success)';
    if(i===selected && i!==q.a) btn.style.background='var(--danger)';
    btn.disabled=true;
  });

  if(selected===q.a){ xp+=50; localStorage.setItem('xp',xp); confetti({particleCount:50,spread:30}); currentScore++; }

  currentIndex++;
  setTimeout(renderQuestion,1500);
}

function finishQuiz(){
  document.getElementById('quiz_text')!.innerText=translations[currentLang].finish;
  document.getElementById('quiz_options')!.innerHTML="";
  document.getElementById('quiz_btn')!.classList.remove('hidden');
  updateUI();
}

// =========================
// Navigation
// =========================
function nav(screen,btn){
  document.querySelectorAll('section[id^="screen_"]').forEach(s=>s.classList.add('hidden'));
  document.getElementById('screen_'+screen)?.classList.remove('hidden');
  document.querySelectorAll('.nav-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
}

// =========================
// Premium Modal
// =========================
function openModal(){ document.getElementById('premiumModal')?.style.setProperty('display','block'); }
function closeModal(){ document.getElementById('premiumModal')?.style.setProperty('display','none'); }
function buyPremium(){ isElite=true; localStorage.setItem('isElite','true'); closeModal(); confetti({particleCount:200,spread:100}); updateUI(); }

// =========================
// Alerts, Checkup & SOS
// =========================
const alertsData = [
  {id:1,desc:"Phishing email detected",status:"New",date:"02/04"},
  {id:2,desc:"Fake banking SMS",status:"Resolved",date:"01/30"},
  {id:3,desc:"Malware app detected",status:"New",date:"02/03"}
];

function renderAlerts(){
  const list=document.getElementById('alert_list'); if(!list) return;
  list.innerHTML=alertsData.map(a=>`
    <li>
      <div>${a.desc} <span class="status">[${a.status}]</span></div>
      <div style="font-size:0.8rem; color:var(--muted); margin-top:5px;">${a.date}</div>
      ${a.status==="New"?`<button onclick="markResolved(${a.id})">Resolve</button>`:""}
    </li>`).join('');
}

function markResolved(id){ const a=alertsData.find(a=>a.id===id); if(a) a.status="Resolved"; renderAlerts(); }

const checkupData=["✅ No suspicious apps detected","⚠️ Some apps request unnecessary permissions","✅ Wi-Fi networks are secure"];
function runCheckup(){ const score=Math.floor(Math.random()*21)+80; document.getElementById('privacy_score')!.innerText=score+'%'; const list=document.getElementById('checkup_list'); if(list) list.innerHTML=checkupData.map(i=>`<li>${i}</li>`).join(''); confetti({particleCount:50,spread:30}); }

function sendSOS(){ alert("SOS sent!"); confetti({particleCount:100,spread:60,colors:['#facc15','#38bdf8','#22c55e']}); }

// =========================
// Premium Tabs
// =========================
function switchPremiumTab(e,tab){
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  e.target.classList.add('active');
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.add('hidden'));
  document.getElementById(tab+'_tab')?.classList.remove('hidden');
}

// =========================
// Daily Streak
// =========================
let lastDate = localStorage.getItem('lastDate')||'';
const today=new Date().toISOString().slice(0,10);
if(today!==lastDate){ streak++; localStorage.setItem('streak',streak); localStorage.setItem('lastDate',today); }

// =========================
// DOM Ready
// =========================
document.addEventListener('DOMContentLoaded',()=>{
  initApp(currentLang);
  renderAlerts();
  const firstTab=document.querySelector('.tab-btn'); if(firstTab) firstTab.click();
});

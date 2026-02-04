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
  en: { daily: "🛡️ Daily Training", start: "START QUIZ", days: "DAYS", finish: "Congrats! You completed the training.", achievements: "🏆 Achievements", map: "TRAINING MAP", prem_desc: "Unlock all security tools." },
  el: { daily: "🛡️ Καθημερινή Εκπαίδευση", start: "ΞΕΚΙΝΑ ΤΟ ΤΕΣΤ", days: "ΗΜΕΡΕΣ", finish: "Συγχαρητήρια! Ολοκλήρωσες την εκπαίδευση.", achievements: "🏆 Επιτεύγματα", map: "ΧΑΡΤΗΣ ΕΚΠΑΙΔΕΥΣΗΣ", prem_desc: "Ξεκλειδώστε όλα τα εργαλεία ασφαλείας." },
  // Προσθέστε και άλλες γλώσσες εδώ...
};

// =========================
// Init App
// =========================
function initApp(lang){
  currentLang = lang;
  // Update static texts
  document.getElementById('txt_daily').innerText = translations[lang].daily;
  document.getElementById('quiz_btn').innerText = translations[lang].start;
  document.getElementById('txt_days').innerText = translations[lang].days;
  document.getElementById('txt_achievements').innerText = translations[lang].achievements;
  document.getElementById('txt_map').innerText = translations[lang].map;
  document.getElementById('txt_prem_desc').innerText = translations[lang].prem_desc;

  document.getElementById('onboarding').classList.add('hidden');
  document.getElementById('main_app').classList.remove('hidden');

  loadQuizzes(lang);
  updateUI();
}

// =========================
// Load Quizzes (Free + Premium)
// =========================
function loadQuizzes(lang){
  fetch(`quizzes/questions_free_${lang}.json`)
    .then(res => res.json())
    .then(freeData => {
      fetch(`quizzes/questions_premium_${lang}.json`)
        .then(res2 => res2.json())
        .then(premData => {
          currentQuizData = {...freeData[lang].levels, ...premData[lang].levels};
        });
    });
}

// =========================
// Update UI (XP, Streak, Badges, Steps)
// =========================
function updateUI(){
  let level = Math.floor(xp/100)+1;
  document.getElementById('level_val').innerText = level;
  document.getElementById('xp_fill').style.width = (xp%100) + "%";
  document.getElementById('streak_val').innerText = streak;

  if(level>=2) document.getElementById('badge1').classList.add('unlocked');
  if(level>=5) document.getElementById('badge2').classList.add('unlocked');
  if(level>=8) document.getElementById('badge3').classList.add('unlocked');

  if(level>=7) document.getElementById('step2').classList.add('active');
  if(level>=10) document.getElementById('step3').classList.add('active');

  if(isElite){
    document.getElementById('badge3').classList.add('unlocked');
    document.getElementById('prem_locked').classList.add('hidden');
    document.getElementById('prem_unlocked').classList.remove('hidden');
    document.getElementById('ad_box').classList.add('hidden');
  }
}

// =========================
// Quiz Logic
// =========================
function startQuiz(){
  let level = Math.floor(xp/100)+1;
  if(level >= 7 && !isElite){
    alert("You need Elite membership to continue!"); 
    openModal();
    return;
  }
  document.getElementById('quiz_btn').classList.add('hidden');
  currentScore = 0;
  currentIndex = 0;
  activeQuestions = generateQuestions(level,5); // 5 questions per quiz
  renderQuestion();
}

function generateQuestions(level,count){
  const levelQuestions = currentQuizData[level] || currentQuizData["1"];
  let shuffled = [...levelQuestions].sort(()=>0.5-Math.random());
  return shuffled.slice(0,count);
}

function renderQuestion(){
  if(currentIndex >= activeQuestions.length){
    finishQuiz();
    return;
  }
  const q = activeQuestions[currentIndex];
  document.getElementById('quiz_text').innerHTML = `<b>Q:</b> ${q.q}`;
  const optionsDiv = document.getElementById('quiz_options');
  optionsDiv.innerHTML = "";
  q.o.forEach((opt,i)=>{
    let btn = document.createElement('button');
    btn.className = 'main-cta';
    btn.style.marginBottom='10px';
    btn.textContent = opt;
    btn.onclick = ()=>checkAnswer(i);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selected){
  const q = activeQuestions[currentIndex];
  const buttons = document.querySelectorAll('#quiz_options button');
  buttons.forEach((btn,i)=>{
    if(i===q.a) btn.style.background='var(--success)';
    if(i===selected && i!==q.a) btn.style.background='var(--danger)';
    btn.disabled = true;
  });
  if(selected===q.a){
    xp += 50;
    localStorage.setItem('xp', xp);
    confetti({particleCount:50,spread:30});
    currentScore++;
  }
  setTimeout(()=>{
    currentIndex++;
    renderQuestion();
  },700);
}

function finishQuiz(){
  document.getElementById('quiz_options').innerHTML="";
  document.getElementById('quiz_text').innerText = translations[currentLang].finish;
  document.getElementById('quiz_btn').classList.remove('hidden');
  document.getElementById('quiz_btn').innerText = translations[currentLang].start;
  updateUI();
  showAd();
}

// =========================
// Navigation
// =========================
function nav(screen,btn){
  document.querySelectorAll('section[id^="screen_"]').forEach(s=>s.classList.add('hidden'));
  document.getElementById('screen_'+screen).classList.remove('hidden');
  document.querySelectorAll('.nav-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
}

// =========================
// Premium Modal
// =========================
function openModal(){ document.getElementById('premiumModal').style.display='block'; }
function closeModal(){ document.getElementById('premiumModal').style.display='none'; }
function buyPremium(){
  isElite = true;
  localStorage.setItem('isElite','true');
  closeModal();
  confetti({particleCount:200,spread:100});
  updateUI();
}

// =========================
// Ads for Free Users
// =========================
function showAd(){
  if(isElite) return;
  console.log("Showing Ad for Free user...");
  // AdMob / Google Ads calls here
}

// =========================
// Onboarding Streak Update
// =========================
let lastDate = localStorage.getItem('lastDate') || '';
const today = new Date().toISOString().slice(0,10);
if(today !== lastDate){
  streak++;
  localStorage.setItem('streak', streak);
  localStorage.setItem('lastDate', today);
}
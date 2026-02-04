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
  en: { 
    daily: "🛡️ Daily Training", 
    start: "START QUIZ", 
    days: "DAYS", 
    finish: "Congrats! You completed the training.", 
    achievements: "🏆 Achievements", 
    map: "TRAINING MAP", 
    prem_desc: "Unlock all security tools." 
  },
  el: { 
    daily: "🛡️ Καθημερινή Εκπαίδευση", 
    start: "ΞΕΚΙΝΑ ΤΟ ΤΕΣΤ", 
    days: "ΗΜΕΡΕΣ", 
    finish: "Συγχαρητήρια! Ολοκλήρωσες την εκπαίδευση.", 
    achievements: "🏆 Επιτεύγματα", 
    map: "ΧΑΡΤΗΣ ΕΚΠΑΙΔΕΥΣΗΣ", 
    prem_desc: "Ξεκλειδώστε όλα τα εργαλεία ασφαλείας." 
  }
};

// =========================
// Init App
// =========================
function initApp(lang){
  currentLang = lang;

  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
  };

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
    fetch(`quizzes/questions_free_${lang}.json`).then(r => r.json()),
    fetch(`quizzes/questions_premium_${lang}.json`).then(r => r.json())
  ]).then(([freeData, premData]) => {
    currentQuizData = {
      ...freeData[lang].levels,
      ...premData[lang].levels
    };
  }).catch(err => {
    console.error("Quiz load error", err);
  });
}

// =========================
// Update UI
// =========================
function updateUI(){
  let level = Math.floor(xp / 100) + 1;

  document.getElementById('level_val')?.innerText = level;
  document.getElementById('xp_fill')?.style.setProperty('width', (xp % 100) + "%");
  document.getElementById('streak_val')?.innerText = streak;

  if (isElite) {
    document.getElementById('prem_locked')?.classList.add('hidden');
    document.getElementById('prem_unlocked')?.classList.remove('hidden');
  }
}

// =========================
// Quiz Logic
// =========================
function startQuiz(){
  let level = Math.floor(xp / 100) + 1;

  if (level >= 7 && !isElite) {
    openModal();
    return;
  }

  document.getElementById('quiz_btn')?.classList.add('hidden');
  currentScore = 0;
  currentIndex = 0;
  activeQuestions = generateQuestions(level, 5);
  renderQuestion();
}

function generateQuestions(level, count){
  const levelQuestions = currentQuizData[level] || [];
  return [...levelQuestions].sort(() => 0.5 - Math.random()).slice(0, count);
}

function renderQuestion(){
  if (currentIndex >= activeQuestions.length) {
    finishQuiz();
    return;
  }

  const q = activeQuestions[currentIndex];
  const quizText = document.getElementById('quiz_text');
  const optionsDiv = document.getElementById('quiz_options');

  if (!quizText || !optionsDiv) return;

  quizText.innerHTML = `<b>Q:</b> ${q.q}`;
  optionsDiv.innerHTML = "";

  q.o.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'main-cta';
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(i);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selected){
  const q = activeQuestions[currentIndex];
  if (selected === q.a) {
    xp += 50;
    localStorage.setItem('xp', xp);
  }
  currentIndex++;
  setTimeout(renderQuestion, 800);
}

function finishQuiz(){
  document.getElementById('quiz_text')!.innerText = translations[currentLang].finish;
  document.getElementById('quiz_options')!.innerHTML = "";
  document.getElementById('quiz_btn')!.classList.remove('hidden');
  updateUI();
}

// =========================
// Navigation
// =========================
function nav(screen, btn){
  document.querySelectorAll('section[id^="screen_"]').forEach(s => s.classList.add('hidden'));
  document.getElementById('screen_' + screen)?.classList.remove('hidden');

  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
}

// =========================
// Premium Modal
// =========================
function openModal(){
  document.getElementById('premiumModal')?.style.setProperty('display', 'block');
}
function closeModal(){
  document.getElementById('premiumModal')?.style.setProperty('display', 'none');
}
function buyPremium(){
  isElite = true;
  localStorage.setItem('isElite', 'true');
  closeModal();
  updateUI();
}

// =========================
// Alerts
// =========================
const alertsData = [
  { id: 1, desc: "Phishing email detected", status: "New", date: "02/04" },
  { id: 2, desc: "Fake banking SMS", status: "Resolved", date: "01/30" }
];

function renderAlerts(){
  const list = document.getElementById('alert_list');
  if (!list) return;

  list.innerHTML = alertsData.map(a => `
    <li>
      <strong>${a.desc}</strong>
      <div>${a.status} • ${a.date}</div>
    </li>
  `).join('');
}

// =========================
// Checkup
// =========================
function runCheckup(){
  document.getElementById('privacy_score')!.innerText = '92%';
}

// =========================
// SOS
// =========================
function sendSOS(){
  alert("SOS sent successfully!");
}

// =========================
// Premium Tabs
// =========================
function switchPremiumTab(e, tab){
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');

  document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
  document.getElementById(tab + '_tab')?.classList.remove('hidden');
}

// =========================
// DOM READY — ΤΟ ΣΗΜΑΝΤΙΚΟ
// =========================
document.addEventListener('DOMContentLoaded', () => {
  initApp(currentLang);
  renderAlerts();

  const firstTab = document.querySelector('.tab-btn');
  if (firstTab) firstTab.click();
});
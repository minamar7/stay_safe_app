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
// Load Quizzes
// =========================
function loadQuizzes(lang){
  fetch(`quizzes/questions_free_${lang}.json`)
    .then(res => res.json())
    .then(freeData => {
      fetch(`quizzes/questions_premium_${lang}.json`)
        .then(res2 => res2.json())
        .then(premData => {
          currentQuizData = {
            ...freeData[lang].levels,
            ...premData[lang].levels
          };
        });
    });
}

// =========================
// Update UI
// =========================
function updateUI(){
  const level = Math.floor(xp / 100) + 1;

  document.getElementById('level_val').innerText = level;
  document.getElementById('xp_fill').style.width = (xp % 100) + "%";
  document.getElementById('streak_val').innerText = streak;

  if(level >= 2) document.getElementById('badge1').classList.add('unlocked');
  if(level >= 5) document.getElementById('badge2').classList.add('unlocked');
  if(level >= 8) document.getElementById('badge3').classList.add('unlocked');

  if(level >= 7) document.getElementById('step2').classList.add('active');
  if(level >= 10) document.getElementById('step3').classList.add('active');

  if(isElite){
    document.getElementById('prem_locked').classList.add('hidden');
    document.getElementById('prem_unlocked').classList.remove('hidden');
  }
}

// =========================
// Premium Tabs (FIXED)
// =========================
function switchPremiumTab(event, tab){

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');

  document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));

  if(tab === 'alerts') document.getElementById('alerts_tab').classList.remove('hidden');
  if(tab === 'checkup') document.getElementById('checkup_tab').classList.remove('hidden');
  if(tab === 'sos') document.getElementById('sos_tab').classList.remove('hidden');
}

// =========================
// Alerts
// =========================
const alertsData = [
  {id:1, desc:"Phishing email targeting your region", status:"New", date:"02/04"},
  {id:2, desc:"New malicious app on Play Store", status:"New", date:"02/03"},
  {id:3, desc:"Fake banking SMS campaigns", status:"Resolved", date:"01/30"}
];

function renderAlerts(){
  const list = document.getElementById('alert_list');
  if(!list) return;

  list.innerHTML = alertsData.map(a => `
    <li>
      <div>${a.desc} <b>[${a.status}]</b></div>
      <small>${a.date}</small>
      ${a.status === "New" ? `<button onclick="markResolved(${a.id})">Resolve</button>` : ""}
    </li>
  `).join('');
}

function markResolved(id){
  const a = alertsData.find(x => x.id === id);
  if(a) a.status = "Resolved";
  renderAlerts();
}

// =========================
// Checkup
// =========================
const checkupData = [
  "✅ No suspicious apps detected",
  "⚠️ Some apps request unnecessary permissions",
  "✅ Wi-Fi networks are secure"
];

function runCheckup(){
  const score = Math.floor(Math.random()*21)+80;
  document.getElementById('privacy_score').innerText = score + '%';

  const list = document.getElementById('checkup_list');
  list.innerHTML = checkupData.map(i => `<li>${i}</li>`).join('');
}

// =========================
// SOS
// =========================
function sendSOS(){
  alert("SOS sent to your emergency contacts!");
  confetti({particleCount:80, spread:60});
}

// =========================
// DOM READY (ΚΡΙΣΙΜΟ)
// =========================
document.addEventListener('DOMContentLoaded', () => {

  updateUI();
  renderAlerts();

  // default premium tab
  const firstTab = document.querySelector('.tab-btn');
  if(firstTab){
    firstTab.click();
  }

});
// =========================
// Stay Safe Elite App JS
// =========================

let currentLang = 'en';
let xp = parseInt(localStorage.getItem('xp')) || 0;
let streak = parseInt(localStorage.getItem('streak')) || 1;
let isElite = localStorage.getItem('isElite') === 'true';

let currentQuizData = {};
let currentIndex = 0;
let activeQuestions = [];

// =========================
// Translations
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
// Init App (LANG SELECT)
// =========================
function initApp(lang) {
  currentLang = lang;

  const t = translations[lang];

  setText('txt_daily', t.daily);
  setText('quiz_btn', t.start);
  setText('txt_days', t.days);
  setText('txt_achievements', t.achievements);
  setText('txt_map', t.map);
  setText('txt_prem_desc', t.prem_desc);

  hide('onboarding');
  show('main_app');

  loadQuizzes(lang);
  updateUI();
}

// helpers
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerText = val;
}
function hide(id) {
  document.getElementById(id)?.classList.add('hidden');
}
function show(id) {
  document.getElementById(id)?.classList.remove('hidden');
}

// =========================
// Load Quizzes
// =========================
function loadQuizzes(lang) {
  Promise.all([
    fetch(`quizzes/questions_free_${lang}.json`).then(r => r.json()),
    fetch(`quizzes/questions_premium_${lang}.json`).then(r => r.json())
  ])
    .then(([freeData, premData]) => {
      currentQuizData = {
        ...freeData[lang].levels,
        ...premData[lang].levels
      };
    })
    .catch(err => console.error("Quiz load error:", err));
}

// =========================
// UI
// =========================
function updateUI() {
  const level = Math.floor(xp / 100) + 1;

  setText('level_val', level);
  setText('streak_val', streak);

  const xpFill = document.getElementById('xp_fill');
  if (xpFill) xpFill.style.width = (xp % 100) + '%';

  if (isElite) {
    hide('prem_locked');
    show('prem_unlocked');
  }
}

// =========================
// Quiz
// =========================
function startQuiz() {
  const level = Math.floor(xp / 100) + 1;

  if (level >= 7 && !isElite) {
    openModal();
    return;
  }

  document.getElementById('quiz_btn')?.classList.add('hidden');

  currentIndex = 0;
  activeQuestions = generateQuestions(level, 5);
  renderQuestion();
}

function generateQuestions(level, count) {
  const list = currentQuizData[level] || [];
  return [...list].sort(() => 0.5 - Math.random()).slice(0, count);
}

function renderQuestion() {
  if (currentIndex >= activeQuestions.length) {
    finishQuiz();
    return;
  }

  const q = activeQuestions[currentIndex];
  const quizText = document.getElementById('quiz_text');
  const options = document.getElementById('quiz_options');

  if (!quizText || !options) return;

  quizText.innerHTML = `<b>Q:</b> ${q.q}`;
  options.innerHTML = "";

  q.o.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'main-cta';
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(i);
    options.appendChild(btn);
  });
}

function checkAnswer(selected) {
  const q = activeQuestions[currentIndex];
  if (selected === q.a) {
    xp += 50;
    localStorage.setItem('xp', xp);
  }
  currentIndex++;
  setTimeout(renderQuestion, 700);
}

function finishQuiz() {
  setText('quiz_text', translations[currentLang].finish);
  document.getElementById('quiz_options').innerHTML = "";
  document.getElementById('quiz_btn')?.classList.remove('hidden');
  updateUI();
}

// =========================
// Navigation
// =========================
function nav(screen, btn) {
  document.querySelectorAll('section[id^="screen_"]').forEach(s => s.classList.add('hidden'));
  document.getElementById('screen_' + screen)?.classList.remove('hidden');

  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// =========================
// Premium Modal
// =========================
function openModal() {
  document.getElementById('premiumModal').style.display = 'block';
}
function closeModal() {
  document.getElementById('premiumModal').style.display = 'none';
}
function buyPremium() {
  isElite = true;
  localStorage.setItem('isElite', 'true');
  closeModal();
  updateUI();
}

// =========================
// Alerts
// =========================
const alertsData = [
  { desc: "Phishing email detected", status: "New", date: "02/04" },
  { desc: "Fake banking SMS", status: "Resolved", date: "01/30" }
];

function renderAlerts() {
  const list = document.getElementById('alert_list');
  if (!list) return;

  list.innerHTML = alertsData.map(a =>
    `<li><b>${a.desc}</b><div>${a.status} • ${a.date}</div></li>`
  ).join('');
}

// =========================
// Checkup & SOS
// =========================
function runCheckup() {
  setText('privacy_score', '92%');
}
function sendSOS() {
  alert("SOS sent successfully!");
}

// =========================
// Premium Tabs
// =========================
function switchPremiumTab(e, tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');

  document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
  document.getElementById(tab + '_tab')?.classList.remove('hidden');
}

// =========================
// DOM READY
// =========================
document.addEventListener('DOMContentLoaded', () => {
  renderAlerts();
  updateUI();
});
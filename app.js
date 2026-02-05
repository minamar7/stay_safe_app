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
  de: { daily:"🛡️ Tägliches Training", start:"QUIZ STARTEN", days:"TAGE", finish:"Glückwunsch! Training abgeschlossen.", achievements:"🏆 Erfolge", map:"TRAININGSKARTE", prem_desc:"Alle Sicherheitstools freιστ." },
  fr: { daily:"🛡️ Entraînement quotidien", start:"COMMENCER", days:"JOURS", finish:"Félicitations!", achievements:"🏆 Succès", map:"CARTE", prem_desc:"Débloquez tout." },
  es: { daily:"🛡️ Entrenamiento diario", start:"EMPEZAR", days:"DÍAS", finish:"¡Felicidades!", achievements:"🏆 Logros", map:"MAPA", prem_desc:"Desbloquear todo." }
  // Πρόσθεσε εδώ και τις υπόλοιπες γλώσσες αν θες
};

// =========================
// Init App
// =========================
function initApp(lang){
  currentLang = lang;
  localStorage.setItem('userLang', lang); // Αποθήκευση επιλογής γλώσσας

  const t = translations[lang] || translations['en'];
  const set = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
  
  set('txt_daily', t.daily);
  set('quiz_btn', t.start);
  set('txt_days', t.days);
  set('txt_achievements', t.achievements);
  set('txt_map', t.map);
  set('txt_prem_desc', t.prem_desc);

  document.getElementById('onboarding')?.classList.add('hidden');
  document.getElementById('main_app')?.classList.remove('hidden');

  loadQuizzes(lang);
  updateUI();
}

// =========================
// Load Quizzes
// =========================
function loadQuizzes(lang){
  // ΠΡΟΣΟΧΗ: Τα paths πρέπει να είναι σωστά αν το app.js είναι στο /src
  Promise.all([
    fetch(`./quizzes/questions_free_${lang}.json`).then(r => r.json()),
    fetch(`./quizzes/questions_premium_${lang}.json`).then(r => r.json())
  ]).then(([freeData, premData]) => {
    // Ενοποίηση των επιπέδων (levels)
    currentQuizData = {...freeData[lang].levels, ...premData[lang].levels};
    console.log("Quizzes loaded for:", lang);
  }).catch(err => {
    console.error("Quiz load error - falling back to English", err);
    if(lang !== 'en') loadQuizzes('en');
  });
}

// =========================
// Update UI
// =========================
function updateUI(){
  const level = Math.floor(xp/100) + 1;
  const set = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };

  set('level_val', level);
  set('streak_val', streak);
  
  const xpFill = document.getElementById('xp_fill');
  if(xpFill) xpFill.style.width = (xp % 100) + '%';

  // Badges Unlocking
  if(level >= 2) document.getElementById('badge1')?.classList.add('unlocked');
  if(level >= 5) document.getElementById('badge2')?.classList.add('unlocked');
  if(level >= 8) document.getElementById('badge3')?.classList.add('unlocked');

  // Map Steps
  if(level >= 5) document.getElementById('step2')?.classList.add('active');
  if(level >= 10) document.getElementById('step3')?.classList.add('active');

  // Elite Status
  if(isElite){
    document.getElementById('prem_locked')?.classList.add('hidden');
    document.getElementById('prem_unlocked')?.classList.remove('hidden');
    document.getElementById('ad_box')?.classList.add('hidden');
  }
}

// =========================
// Quiz Logic
// =========================
function startQuiz(){
  const level = Math.floor(xp/100) + 1;
  if(level >= 7 && !isElite){ openModal(); return; }

  document.getElementById('quiz_btn')?.classList.add('hidden');
  currentScore = 0;
  currentIndex = 0;
  activeQuestions = generateQuestions(level, 5);
  renderQuestion();
}

function generateQuestions(level, count){
  const levelQuestions = currentQuizData[level] || [];
  if(levelQuestions.length === 0) return [];
  return [...levelQuestions].sort(() => 0.5 - Math.random()).slice(0, count);
}

function renderQuestion(){
  if(currentIndex >= activeQuestions.length){ finishQuiz(); return; }
  const q = activeQuestions[currentIndex];
  const quizText = document.getElementById('quiz_text');
  const optionsDiv = document.getElementById('quiz_options');
  if(!quizText || !optionsDiv) return;

  quizText.innerHTML = `<b>Q:</b> ${q.q}`;
  optionsDiv.innerHTML = "";
  
  q.o.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'main-cta';
    btn.style.marginBottom = "10px";
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(i);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selected){
  const q = activeQuestions[currentIndex];
  const buttons = document.querySelectorAll('#quiz_options button');
  
  buttons.forEach((btn, i) => {
    if(i === q.a) btn.style.background = 'var(--success)';
    if(i === selected && i !== q.a) btn.style.background = 'var(--danger)';
    btn.disabled = true;
  });

  if(selected === q.a){ 
    xp += 20; // 20 XP ανά σωστή απάντηση
    localStorage.setItem('xp', xp); 
    confetti({particleCount: 30, spread: 20, origin: { y: 0.8 }}); 
    currentScore++; 
  }

  currentIndex++;
  setTimeout(renderQuestion, 1500);
}

function finishQuiz(){
  const t = translations[currentLang] || translations['en'];
  document.getElementById('quiz_text').innerText = t.finish;
  document.getElementById('quiz_options').innerHTML = "";
  const btn = document.getElementById('quiz_btn');
  if(btn) {
    btn.classList.remove('hidden');
    btn.innerText = "TRY AGAIN";
  }
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
// Premium Modal & Functions
// =========================
function openModal(){ document.getElementById('premiumModal').style.display = 'block'; }
function closeModal(){ document.getElementById('premiumModal').style.display = 'none'; }
function buyPremium(){ 
  isElite = true; 
  localStorage.setItem('isElite', 'true'); 
  closeModal(); 
  confetti({particleCount: 150, spread: 70}); 
  updateUI(); 
}

// =========================
// Alerts & Checkup
// =========================
const alertsData = [
  {id:1, desc:"Phishing email detected", status:"New", date:"02/04"},
  {id:2, desc:"Fake banking SMS", status:"Resolved", date:"01/30"},
  {id:3, desc:"Malware app detected", status:"New", date:"02/03"}
];

function renderAlerts(){
  const list = document.getElementById('alert_list'); if(!list) return;
  list.innerHTML = alertsData.map(a => `
    <li style="background:rgba(255,255,255,0.05); margin-bottom:10px; padding:15px; border-radius:15px; list-style:none;">
      <div style="display:flex; justify-content:space-between;">
        <span>${a.desc}</span>
        <span style="color:${a.status==='New'?'var(--gold)':'var(--success)'}">${a.status}</span>
      </div>
      <div style="font-size:0.8rem; color:var(--muted); margin-top:5px;">${a.date}</div>
      ${a.status === "New" ? `<button class="main-cta" style="padding:5px 10px; font-size:12px; margin-top:10px;" onclick="markResolved(${a.id})">Resolve</button>` : ""}
    </li>`).join('');
}

function markResolved(id){ 
  const a = alertsData.find(x => x.id === id); 
  if(a) a.status = "Resolved"; 
  renderAlerts(); 
}

function runCheckup(){ 
  const score = Math.floor(Math.random() * 21) + 80; 
  document.getElementById('privacy_score').innerText = score + '%'; 
  const list = document.getElementById('checkup_list'); 
  const checkupData = ["✅ No suspicious apps detected", "⚠️ Some apps request unnecessary permissions", "✅ Wi-Fi networks are secure"];
  if(list) list.innerHTML = checkupData.map(i => `<li>${i}</li>`).join(''); 
  confetti({particleCount: 50, spread: 30}); 
}

function sendSOS(){ 
  alert("SOS signal sent to emergency contacts!"); 
  confetti({particleCount: 100, colors: ['#ff0000', '#ffffff']}); 
}

function switchPremiumTab(e, tab){
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  e.currentTarget.classList.add('active');
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
  document.getElementById(tab + '_tab')?.classList.remove('hidden');
}

// =========================
// Daily Streak Logic
// =========================
function checkStreak() {
    let lastDate = localStorage.getItem('lastDate') || '';
    const today = new Date().toISOString().slice(0, 10);
    if (today !== lastDate) {
        streak++;
        localStorage.setItem('streak', streak);
        localStorage.setItem('lastDate', today);
    }
}

// =========================
// DOM Ready
// =========================
document.addEventListener('DOMContentLoaded', () => {
  checkStreak();
  // Φόρτωση αποθηκευμένης γλώσσας ή English
  const savedLang = localStorage.getItem('userLang') || 'en';
  initApp(savedLang);
  renderAlerts();
});

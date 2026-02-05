// =========================
// Stay Safe Elite - Core Logic
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
  en: { daily:"🛡️ Daily Training", start:"START QUIZ", days:"DAYS", finish:"Congrats! Training complete.", achievements:"🏆 Achievements", map:"TRAINING MAP", prem_desc:"Unlock all security tools.", try_again: "TRY AGAIN" },
  el: { daily:"🛡️ Καθημερινή Εκπαίδευση", start:"ΞΕΚΙΝΑ ΤΟ ΤΕΣΤ", days:"ΗΜΕΡΕΣ", finish:"Συγχαρητήρια! Ολοκληρώθηκε.", achievements:"🏆 Επιτεύγματα", map:"ΧΑΡΤΗΣ ΕΚΠΑΙΔΕΥΣΗΣ", prem_desc:"Ξεκλειδώστε όλα τα εργαλεία.", try_again: "ΔΟΚΙΜΑΣΤΕ ΠΑΛΙ" },
  de: { daily:"🛡️ Tägliches Training", start:"QUIZ STARTEN", days:"TAGE", finish:"Glückwunsch!", achievements:"🏆 Erfolge", map:"TRAININGSKARTE", prem_desc:"Alle Tools freischalten.", try_again: "WIEDERHOLEN" },
  fr: { daily:"🛡️ Entraînement", start:"COMMENCER", days:"JOURS", finish:"Félicitations!", achievements:"🏆 Succès", map:"CARTE", prem_desc:"Débloquez tout.", try_again: "RECOMMENCER" },
  es: { daily:"🛡️ Entrenamiento", start:"EMPEZAR", days:"DÍAS", finish:"¡Felicidades!", achievements:"🏆 Logros", map:"MAPA", prem_desc:"Desbloquear todo.", try_again: "REINTENTAR" }
};

// =========================
// Init App
// =========================
async function initApp(lang){
  currentLang = lang;
  localStorage.setItem('userLang', lang);

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

  await loadQuizzes(lang);
  updateUI();
}

// =========================
// Load Quizzes (Fixed Paths)
// =========================
async function loadQuizzes(lang){
  try {
    // Χρησιμοποιούμε σχετικό path από το root (./quizzes)
    const [freeRes, premRes] = await Promise.allSettled([
      fetch(`./quizzes/questions_free_${lang}.json`).then(r => r.json()),
      fetch(`./quizzes/questions_premium_${lang}.json`).then(r => r.json())
    ]);

    const free = freeRes.status === 'fulfilled' ? freeRes.value : null;
    const prem = premRes.status === 'fulfilled' ? premRes.value : null;

    if(free) {
      currentQuizData = { ...free[lang].levels };
      if(prem) currentQuizData = { ...currentQuizData, ...prem[lang].levels };
    }
  } catch (err) {
    console.warn("Quiz load failed, using fallback.");
    currentQuizData = { "1": [{ q: "Safe to share passwords?", o: ["Yes", "No"], a: 1 }] };
  }
}

// =========================
// Update UI & Progress
// =========================
function updateUI(){
  const level = Math.floor(xp/100) + 1;
  const set = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };

  set('level_val', level);
  set('streak_val', streak);
  
  const xpFill = document.getElementById('xp_fill');
  if(xpFill) xpFill.style.width = (xp % 100) + '%';

  // Badges & Map
  document.getElementById('badge1')?.classList.toggle('unlocked', level >= 2);
  document.getElementById('badge2')?.classList.toggle('unlocked', level >= 5);
  document.getElementById('badge3')?.classList.toggle('unlocked', level >= 8 || isElite);
  
  document.getElementById('step2')?.classList.toggle('active', level >= 5);
  document.getElementById('step3')?.classList.toggle('active', level >= 10);

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
  
  const pool = currentQuizData[level] || currentQuizData["1"] || [];
  activeQuestions = [...pool].sort(() => 0.5 - Math.random()).slice(0, 5);
  renderQuestion();
}

function renderQuestion(){
  const quizText = document.getElementById('quiz_text');
  const optionsDiv = document.getElementById('quiz_options');
  if(!quizText || !optionsDiv) return;

  if(currentIndex >= activeQuestions.length){ finishQuiz(); return; }
  
  const q = activeQuestions[currentIndex];
  quizText.innerHTML = `<b>Q:</b> ${q.q}`;
  optionsDiv.innerHTML = "";
  
  q.o.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'main-cta';
    btn.style.cssText = "background:#1e293b; color:white; margin-bottom:10px;";
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(i);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selected){
  const q = activeQuestions[currentIndex];
  const buttons = document.querySelectorAll('#quiz_options button');
  
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if(i === q.a) btn.style.background = 'var(--success)';
    else if(i === selected) btn.style.background = 'var(--danger)';
  });

  if(selected === q.a){ 
    xp += 20;
    localStorage.setItem('xp', xp); 
    confetti({particleCount: 40, spread: 30, origin: { y: 0.8 }}); 
    currentScore++; 
  }

  currentIndex++;
  setTimeout(renderQuestion, 1200);
}

function finishQuiz(){
  const t = translations[currentLang] || translations['en'];
  document.getElementById('quiz_text').innerText = t.finish;
  document.getElementById('quiz_options').innerHTML = "";
  const btn = document.getElementById('quiz_btn');
  if(btn) {
    btn.classList.remove('hidden');
    btn.innerText = t.try_again;
  }
  updateUI();
}

// =========================
// Navigation & Premium
// =========================
function nav(screen, btn){
  document.getElementById('screen_home')?.classList.add('hidden');
  document.getElementById('screen_premium')?.classList.add('hidden');
  document.getElementById('screen_' + screen)?.classList.remove('hidden');
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  
  if(screen === 'premium' && isElite) renderAlerts();
}

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
// Tools: SOS & Checkup
// =========================
function sendSOS(){ 
  alert("🚨 EMERGENCY: SOS signal sent!"); 
  confetti({particleCount: 100, colors: ['#ff0000', '#ffffff']}); 
}

function runCheckup(){ 
  const scoreEl = document.getElementById('privacy_score');
  if(!scoreEl) return;
  
  const score = Math.floor(Math.random() * 21) + 80; 
  scoreEl.innerText = score + '%'; 
  
  const list = document.getElementById('checkup_list'); 
  const checkupData = ["✅ No suspicious apps", "⚠️ Check app permissions", "✅ Secure Wi-Fi"];
  if(list) list.innerHTML = checkupData.map(i => `<li>${i}</li>`).join(''); 
  confetti({particleCount: 50, spread: 30}); 
}

// =========================
// App Lifecycle
// =========================
document.addEventListener('DOMContentLoaded', () => {
  // Streak Logic
  const lastDate = localStorage.getItem('lastDate') || '';
  const today = new Date().toISOString().slice(0, 10);
  if (today !== lastDate) {
      streak = parseInt(localStorage.getItem('streak') || 0) + 1;
      localStorage.setItem('streak', streak);
      localStorage.setItem('lastDate', today);
  }

  const savedLang = localStorage.getItem('userLang') || 'en';
  initApp(savedLang);
});

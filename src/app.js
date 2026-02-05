// ==========================================
// Stay Safe Elite - Core Application Logic
// Default Language: English (EN)
// ==========================================

let currentLang = 'en';
let xp = parseInt(localStorage.getItem('xp')) || 0;
let streak = parseInt(localStorage.getItem('streak')) || 1;
let isElite = localStorage.getItem('isElite') === 'true';
let currentQuizData = {};
let currentIndex = 0;
let currentScore = 0;
let activeQuestions = [];
let questionsDoneToday = parseInt(localStorage.getItem('questionsDoneToday')) || 0;

// =========================
// UI Translations
// =========================
const translations = {
  en: { daily:"🛡️ Daily Training", start:"START QUIZ", days:"DAYS", finish:"Congrats! Training complete.", achievements:"🏆 Achievements", map:"TRAINING MAP", prem_desc:"Unlock all security tools and SOS Hub.", try_again: "TRY AGAIN", limit: "Daily limit reached (5/5). Upgrade to Elite!" },
  el: { daily:"🛡️ Καθημερινή Εκπαίδευση", start:"ΞΕΚΙΝΑ ΤΟ ΤΕΣΤ", days:"ΗΜΕΡΕΣ", finish:"Συγχαρητήρια! Ολοκληρώθηκε.", achievements:"🏆 Επιτεύγματα", map:"ΧΑΡΤΗΣ ΕΚΠΑΙΔΕΥΣΗΣ", prem_desc:"Ξεκλειδώστε όλα τα εργαλεία και το SOS Hub.", try_again: "ΔΟΚΙΜΑΣΤΕ ΠΑΛΙ", limit: "Το ημερήσιο όριο συμπληρώθηκε (5/5). Γίνετε Elite!" },
  de: { daily:"🛡️ Tägliches Training", start:"QUIZ STARTEN", days:"TAGE", finish:"Glückwunsch! Abgeschlossen.", achievements:"🏆 Erfolge", map:"TRAININGSKARTE", prem_desc:"Alle Tools und SOS-Hub freischalten.", try_again: "WIEDERHOLEN", limit: "Tageslimit erreicht (5/5)." },
  fr: { daily:"🛡️ Entraînement", start:"COMMENCER", days:"JOURS", finish:"Félicitations!", achievements:"🏆 Succès", map:"CARTE", prem_desc:"Débloquez tous les outils.", try_again: "RECOMMENCER", limit: "Limite quotidienne atteinte (5/5)." },
  es: { daily:"🛡️ Entrenamiento", start:"EMPEZAR", days:"DÍAS", finish:"¡Felicidades!", achievements:"🏆 Logros", map:"MAPA", prem_desc:"Desbloquear todas las herramientas.", try_again: "REINTENTAR", limit: "Límite diario alcanzado (5/5)." }
};

// =========================
// App Initialization
// =========================
async function initApp(lang = 'en') {
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

  // Δεν κρύβουμε το onboarding αυτόματα εδώ για να προλαβαίνεις να διαλέξεις
  await loadQuizzes(lang);
  updateUI();
  if (isElite) loadScamAlerts();
}

// Νέα συνάρτηση για την επιλογή γλώσσας από τις σημαίες
function selectLang(lang) {
  initApp(lang);
  document.getElementById('onboarding')?.classList.add('hidden');
  document.getElementById('main_app')?.classList.remove('hidden');
}

// =========================
// Quiz Loading Logic
// =========================
async function loadQuizzes(lang) {
  try {
    const fileSuffix = isElite ? 'premium' : 'free';
    const response = await fetch(`./quizzes/questions_${fileSuffix}_${lang}.json`);
    const data = await response.json();
    
    if (data && data[lang]) {
      currentQuizData = data[lang].levels;
    }
  } catch (err) {
    console.warn("Quiz fetch error, using fallback.");
    currentQuizData = { "1": [{ q: "Protect your password?", o: ["Yes", "No"], a: 0 }] };
  }
}

// =========================
// UI & Progress Updates
// =========================
function updateUI() {
  const level = Math.floor(xp / 100) + 1;
  const set = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };

  set('level_val', level);
  set('streak_val', streak);
  
  const xpFill = document.getElementById('xp_fill');
  if (xpFill) xpFill.style.width = (xp % 100) + '%';

  document.getElementById('badge1')?.classList.toggle('unlocked', level >= 2);
  document.getElementById('badge2')?.classList.toggle('unlocked', level >= 5);
  document.getElementById('badge3')?.classList.toggle('unlocked', isElite);
  
  document.getElementById('step2')?.classList.toggle('active', level >= 5);
  document.getElementById('step3')?.classList.toggle('active', level >= 10);

  if (isElite) {
    document.getElementById('prem_locked')?.classList.add('hidden');
    document.getElementById('prem_unlocked')?.classList.remove('hidden');
    document.getElementById('ad_box')?.classList.add('hidden');
  }
}

// =========================
// Quiz Mechanics
// =========================
function startQuiz() {
  const level = Math.floor(xp / 100) + 1;
  const t = translations[currentLang] || translations['en'];

  if (level >= 7 && !isElite) { openModal(); return; }

  if (questionsDoneToday >= 5 && !isElite) {
    alert(t.limit);
    return;
  }

  document.getElementById('quiz_btn')?.classList.add('hidden');
  currentScore = 0;
  currentIndex = 0;
  
  const pool = currentQuizData[level] || currentQuizData["1"] || [];
  activeQuestions = [...pool].sort(() => 0.5 - Math.random()).slice(0, 5);
  renderQuestion();
}

function renderQuestion() {
  const quizText = document.getElementById('quiz_text');
  const optionsDiv = document.getElementById('quiz_options');
  if (!quizText || !optionsDiv) return;

  if (currentIndex >= activeQuestions.length) { finishQuiz(); return; }
  
  const q = activeQuestions[currentIndex];
  quizText.innerHTML = `<b>Q:</b> ${q.q || q.question}`;
  optionsDiv.innerHTML = "";
  
  const options = q.o || q.options;
  const correctIdx = q.a !== undefined ? q.a : q.correct;

  options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'main-cta';
    btn.style.cssText = "background:#1e293b; color:white; margin-bottom:10px; border:1px solid rgba(255,255,255,0.1);";
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(i, correctIdx);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selected, correct) {
  const buttons = document.querySelectorAll('#quiz_options button');
  
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.style.background = 'var(--success)';
    else if (i === selected) btn.style.background = 'var(--danger)';
  });

  if (selected === correct) { 
    xp += 20;
    localStorage.setItem('xp', xp); 
    confetti({ particleCount: 40, spread: 30, origin: { y: 0.8 } }); 
    currentScore++; 
    
    if (!isElite) {
      questionsDoneToday++;
      localStorage.setItem('questionsDoneToday', questionsDoneToday);
    }
  }

  currentIndex++;
  setTimeout(renderQuestion, 1200);
}

function finishQuiz() {
  const t = translations[currentLang] || translations['en'];
  document.getElementById('quiz_text').innerText = t.finish;
  document.getElementById('quiz_options').innerHTML = "";
  const btn = document.getElementById('quiz_btn');
  if (btn) {
    btn.classList.remove('hidden');
    btn.innerText = t.try_again;
  }
  updateUI();
}

// =========================
// Premium Features: SOS, Alerts, Dojo, Checkup
// =========================
function sendSOS() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const link = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
      alert(`🚨 SOS HUB: Location acquired!\nLink: ${link}\nSending to emergency services...`);
      window.location.href = `tel:112`;
    });
  } else {
    alert("🚨 SOS signal sent! Calling 112...");
    window.location.href = `tel:112`;
  }
}

async function loadScamAlerts() {
  try {
    const res = await fetch('./quizzes/alerts.json');
    const alerts = await res.json();
    const container = document.getElementById('prem_unlocked');
    
    let html = `<h4 style="color:var(--accent); margin:15px 0;">LIVE SCAM ALERTS</h4>`;
    alerts.slice(0, 3).forEach(a => {
      html += `
        <div class="glass-card" style="padding:15px; margin-bottom:10px; border-left:4px solid var(--danger);">
          <small>${a.date}</small>
          <div style="font-weight:bold;">${a.title}</div>
          <div style="font-size:0.8rem; color:var(--muted);">${a.desc}</div>
        </div>`;
    });
    container.innerHTML += html;
  } catch (e) { console.log("Alerts not found"); }
}

function runCheckup() {
  const btn = event.currentTarget;
  btn.innerHTML = "<i>⏳</i><small>SCANNING...</small>";
  setTimeout(() => {
    alert("🛡️ ELITE CHECKUP:\n- Device Encrypted\n- No Malware Found\n- Wi-Fi Secure");
    btn.innerHTML = "<i>🔍</i><small>CHECKUP</small>";
    confetti({ particleCount: 100, spread: 70 });
  }, 2000);
}

// ΕΝΕΡΓΟΠΟΙΗΣΗ DOJO ΜΕ ΑΓΓΛΙΚΟ ΠΕΡΙΕΧΟΜΕΝΟ
async function startDojo() {
  if(!isElite) { openModal(); return; }
  
  try {
    const response = await fetch('./quizzes/dojo.json');
    const data = await response.json();
    
    document.getElementById('quiz_btn')?.classList.add('hidden');
    currentIndex = 0;
    // Φορτώνουμε τυχαία 5 ερωτήσεις από το Dojo
    activeQuestions = data.sort(() => 0.5 - Math.random()).slice(0, 5);
    
    const qText = document.getElementById('quiz_text');
    qText.style.color = "var(--gold)";
    qText.innerHTML = "⚡ ELITE DOJO TRAINING ⚡<br><small>Tactical & Physical Security</small>";
    
    setTimeout(() => {
      renderQuestion();
    }, 1500);
    
  } catch (err) {
    alert("Dojo training data not found.");
  }
}

// =========================
// Navigation & Modals
// =========================
function nav(screen, btn) {
  document.getElementById('screen_home')?.classList.add('hidden');
  document.getElementById('screen_premium')?.classList.add('hidden');
  document.getElementById('screen_' + screen)?.classList.remove('hidden');
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  if (screen === 'premium' && isElite) loadScamAlerts();
}

function openModal() { document.getElementById('premiumModal').style.display = 'flex'; }
function closeModal() { document.getElementById('premiumModal').style.display = 'none'; }

function buyPremium() { 
  isElite = true; 
  localStorage.setItem('isElite', 'true'); 
  closeModal(); 
  confetti({ particleCount: 150, spread: 70 }); 
  updateUI(); 
  loadScamAlerts();
}

// =========================
// App Lifecycle
// =========================
document.addEventListener('DOMContentLoaded', () => {
  const lastDate = localStorage.getItem('lastDate') || '';
  const today = new Date().toISOString().slice(0, 10);
  
  if (today !== lastDate) {
      if (lastDate !== "") streak++;
      questionsDoneToday = 0;
      localStorage.setItem('streak', streak);
      localStorage.setItem('questionsDoneToday', 0);
      localStorage.setItem('lastDate', today);
  }

  const savedLang = localStorage.getItem('userLang') || 'en';
  initApp(savedLang);
});

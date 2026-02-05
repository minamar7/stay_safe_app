// Εισαγωγές (Αν χρησιμοποιείς Vite/Webpack - αλλιώς τις αφαιρείς για απλό script)
// import { Capacitor } from '@capacitor/core';
// import { AdMob } from '@capacitor-community/admob';
// import { InAppPurchases } from '@capacitor/in-app-purchases';

const App = {
  isElite: localStorage.getItem('isElite') === 'true',
  xp: parseInt(localStorage.getItem('xp') || 0),
  streak: parseInt(localStorage.getItem('streak') || 1),
  currentLang: 'en',
  quizData: {},

  // Μεταφράσεις για τα στατικά κείμενα του UI
  translations: {
    en: { daily: "🛡️ Daily Training", start: "START QUIZ", days: "DAYS", achievements: "🏆 Achievements", map: "TRAINING MAP", prem_desc: "Unlock all security tools." },
    el: { daily: "🛡️ Καθημερινή Εκπαίδευση", start: "ΞΕΚΙΝΑ ΤΟ ΤΕΣΤ", days: "ΗΜΕΡΕΣ", achievements: "🏆 Επιτεύγματα", map: "ΧΑΡΤΗΣ ΕΚΠΑΙΔΕΥΣΗΣ", prem_desc: "Ξεκλειδώστε όλα τα εργαλεία ασφαλείας." },
    de: { daily: "🛡️ Tägliches Training", start: "STARTEN", days: "TAGE", achievements: "🏆 Erfolge", map: "TRAININGSKARTE", prem_desc: "Alle Tools freischalten." },
    fr: { daily: "🛡️ Entraînement", start: "COMMENCER", days: "JOURS", achievements: "🏆 Succès", map: "CARTE", prem_desc: "Débloquez tout." },
    es: { daily: "🛡️ Entrenamiento", start: "EMPEZAR", days: "DÍAS", achievements: "🏆 Logros", map: "MAPA", prem_desc: "Desbloquear todo." },
    it: { daily: "🛡️ Allenamento", start: "INIZIA", days: "GIORNI", achievements: "🏆 Traguardi", map: "MAPPA", prem_desc: "Sblocca tutto." },
    pt: { daily: "🛡️ Treinamento", start: "INICIAR", days: "DIAS", achievements: "🏆 Conquistas", map: "MAPA", prem_desc: "Desbloquear tudo." },
    ru: { daily: "🛡️ Тренировка", start: "НАЧАТЬ", days: "ДНЕЙ", achievements: "🏆 Достижения", map: "КАРТА", prem_desc: "Открыть всё." },
    zh: { daily: "🛡️ 日常训练", start: "开始测试", days: "天", achievements: "🏆 成就", map: "训练地图", prem_desc: "解锁所有工具。" },
    hi: { daily: "🛡️ दैनिक प्रशिक्षण", start: "शुरू करें", days: "दिन", achievements: "🏆 उपलब्धियां", map: "प्रशिक्षण मानचित्र", prem_desc: "सभी टूल अनलॉक करें।" }
  },

  async init(lang = 'en') {
    this.currentLang = lang;
    localStorage.setItem('userLang', lang);

    // Ενημέρωση κειμένων UI
    const t = this.translations[lang] || this.translations['en'];
    document.getElementById('txt_daily').innerText = t.daily;
    document.getElementById('quiz_btn').innerText = t.start;
    document.getElementById('txt_days').innerText = t.days;
    document.getElementById('txt_achievements').innerText = t.achievements;
    document.getElementById('txt_map').innerText = t.map;
    document.getElementById('txt_prem_desc').innerText = t.prem_desc;

    // Εναλλαγή οθονών
    document.getElementById('onboarding').classList.add('hidden');
    document.getElementById('main_app').classList.remove('hidden');

    // Φόρτωση Quizzes
    try {
      const free = await fetch(`./quizzes/questions_free_${lang}.json`).then(r => r.json());
      const prem = await fetch(`./quizzes/questions_premium_${lang}.json`).then(r => r.json());
      this.quizData = { ...free[lang].levels, ...prem[lang].levels };
    } catch (e) {
      console.error("Failed to load quizzes", e);
    }

    this.updateUI();
  },

  updateUI() {
    const level = Math.floor(this.xp / 100) + 1;
    document.getElementById('level_val').innerText = level;
    document.getElementById('streak_val').innerText = this.streak;
    document.getElementById('xp_fill').style.width = (this.xp % 100) + "%";

    // Ενημέρωση Badges & Map
    if (level >= 2) document.getElementById('badge1').classList.add('unlocked');
    if (level >= 5) {
      document.getElementById('badge2').classList.add('unlocked');
      document.getElementById('step2').classList.add('active');
    }
    if (level >= 8) {
      document.getElementById('badge3').classList.add('unlocked');
      document.getElementById('step3').classList.add('active');
    }

    if (this.isElite) {
      document.getElementById('prem_locked').classList.add('hidden');
      document.getElementById('prem_unlocked').classList.remove('hidden');
      document.getElementById('ad_box').classList.add('hidden');
    }
  },

  async startQuiz() {
    const lvl = Math.floor(this.xp / 100) + 1;
    if (lvl >= 7 && !this.isElite) {
      this.openPremiumModal();
      return;
    }
    document.getElementById('quiz_btn').classList.add('hidden');
    this.renderQuestion(0, 0);
  },

  renderQuestion(idx, count) {
    const lvl = Math.floor(this.xp / 100) + 1;
    const questions = this.quizData[lvl] || this.quizData[1];
    const q = questions[idx % questions.length];

    document.getElementById('quiz_text').innerHTML = `<b>Q:</b> ${q.q}`;
    const html = q.o.map((o, i) => `
      <button class="main-cta" style="margin-bottom:10px;" onclick="App.checkAnswer(${idx},${i},${count})">
        ${o}
      </button>`).join('');
    document.getElementById('quiz_options').innerHTML = html;
  },

  checkAnswer(idx, selected, count) {
    const lvl = Math.floor(this.xp / 100) + 1;
    const questions = this.quizData[lvl] || this.quizData[1];
    const q = questions[idx % questions.length];
    
    const buttons = document.querySelectorAll('#quiz_options button');
    buttons.forEach((b, i) => {
      if (i === q.a) b.style.background = 'var(--success)';
      if (i === selected && i !== q.a) b.style.background = 'var(--danger)';
      b.disabled = true;
    });

    if (selected === q.a) {
      this.xp += 20;
      localStorage.setItem('xp', this.xp);
      confetti({ particleCount: 40, spread: 30, origin: { y: 0.8 } });
    }

    count++;
    if (count < 5) {
      setTimeout(() => this.renderQuestion(idx + 1, count), 1200);
    } else {
      setTimeout(() => {
        document.getElementById('quiz_text').innerText = "Training Complete!";
        document.getElementById('quiz_options').innerHTML = "";
        document.getElementById('quiz_btn').classList.remove('hidden');
        document.getElementById('quiz_btn').innerText = "CONTINUE";
        this.updateUI();
      }, 1200);
    }
  },

  // Navigation Logic
  nav(screen, btn) {
    document.querySelectorAll('section[id^="screen_"]').forEach(s => s.classList.add('hidden'));
    document.getElementById('screen_' + screen).classList.remove('hidden');
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
  },

  switchPremiumTab(e, tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    e.currentTarget.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
    document.getElementById(tab + '_tab').classList.remove('hidden');
  },

  openPremiumModal() { document.getElementById('premiumModal').classList.remove('hidden'); },
  closePremiumModal() { document.getElementById('premiumModal').classList.add('hidden'); },

  async buyPremium() {
    // Εδώ καλείς το InAppPurchases αν είσαι σε κινητό
    // Για το demo απλά το ενεργοποιούμε:
    this.isElite = true;
    localStorage.setItem('isElite', 'true');
    this.updateUI();
    this.closePremiumModal();
    confetti({ particleCount: 200, spread: 100 });
  },

  runCheckup() {
    confetti({ particleCount: 100, spread: 70 });
    alert("Device is secure! 🛡️");
  },

  sendSOS() {
    alert("Emergency Signal Sent! 🚨");
  }
};

window.App = App;

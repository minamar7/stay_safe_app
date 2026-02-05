/**
 * Stay Safe Elite - Core App Logic
 * Optimized for PWA & Super App Performance
 */

const App = {
  isElite: localStorage.getItem('isElite') === 'true',
  xp: parseInt(localStorage.getItem('xp') || 0),
  streak: parseInt(localStorage.getItem('streak') || 1),
  currentLang: 'en',
  quizData: {},

  // Στατικές μεταφράσεις για το UI
  translations: {
    en: { daily: "🛡️ Daily Training", start: "START QUIZ", days: "DAYS", achievements: "🏆 Achievements", map: "TRAINING MAP", prem_desc: "Unlock all security tools and Emergency Hub.", finish: "Training Complete!" },
    el: { daily: "🛡️ Καθημερινή Εκπαίδευση", start: "ΞΕΚΙΝΑ ΤΟ ΤΕΣΤ", days: "ΗΜΕΡΕΣ", achievements: "🏆 Επιτεύγματα", map: "ΧΑΡΤΗΣ ΕΚΠΑΙΔΕΥΣΗΣ", prem_desc: "Ξεκλειδώστε όλα τα εργαλεία και το Κέντρο Ανάγκης.", finish: "Η εκπαίδευση ολοκληρώθηκε!" },
    de: { daily: "🛡️ Tägliches Training", start: "QUIZ STARTEN", days: "TAGE", achievements: "🏆 Erfolge", map: "TRAININGSKARTE", prem_desc: "Alle Tools und Notruf-Hub freischalten.", finish: "Training abgeschlossen!" },
    fr: { daily: "🛡️ Entraînement", start: "DÉMARRER", days: "JOURS", achievements: "🏆 Succès", map: "CARTE", prem_desc: "Débloquez tous les outils.", finish: "Formation terminée!" },
    es: { daily: "🛡️ Entrenamiento", start: "EMPEZAR", days: "DÍAS", achievements: "🏆 Logros", map: "MAPA", prem_desc: "Desbloquea todas las herramientas.", finish: "¡Entrenamiento completado!" },
    it: { daily: "🛡️ Allenamento", start: "INIZIA", days: "GIORNI", achievements: "🏆 Traguardi", map: "MAPPA", prem_desc: "Sblocca tutti gli strumenti.", finish: "Allenamento completato!" },
    pt: { daily: "🛡️ Treinamento", start: "INICIAR", days: "DIAS", achievements: "🏆 Conquistas", map: "MAPA", prem_desc: "Desbloquear todas as ferramentas.", finish: "Treino concluído!" },
    ru: { daily: "🛡️ Тренировка", start: "НАЧАТЬ", days: "ДНЕЙ", achievements: "🏆 Достижения", map: "КАΡΤΑ", prem_desc: "Открыть все инструменты.", finish: "Тренировка завершена!" },
    zh: { daily: "🛡️ 日常训练", start: "开始测试", days: "天", achievements: "🏆 成就", map: "训练地图", prem_desc: "解锁所有工具。", finish: "训练完成！" },
    hi: { daily: "🛡️ दैनिक प्रशिक्षण", start: "शुरू करें", days: "दिन", achievements: "🏆 उपलब्धियां", map: "प्रशिक्षण मानचित्र", prem_desc: "सभी टूल अनलॉक करें।", finish: "प्रशिक्षण पूरा हुआ!" }
  },

  // Αρχικοποίηση - Καλείται από το Onboarding
  async initApp(lang = 'en') {
    this.currentLang = lang;
    localStorage.setItem('userLang', lang);

    // Ενημέρωση κειμένων βάσει γλώσσας
    const t = this.translations[lang] || this.translations['en'];
    document.getElementById('txt_daily').innerText = t.daily;
    document.getElementById('quiz_btn').innerText = t.start;
    document.getElementById('txt_days').innerText = t.days;
    document.getElementById('txt_achievements').innerText = t.achievements;
    document.getElementById('txt_map').innerText = t.map;
    document.getElementById('txt_prem_desc').innerText = t.prem_desc;

    // UI Switch
    document.getElementById('onboarding').classList.add('hidden');
    document.getElementById('main_app').classList.remove('hidden');

    // Φόρτωση Δεδομένων
    await this.loadQuizzes(lang);
    this.updateUI();
  },

  async loadQuizzes(lang) {
    try {
      const free = await fetch(`./quizzes/questions_free_${lang}.json`).then(r => r.json());
      const prem = await fetch(`./quizzes/questions_premium_${lang}.json`).then(r => r.json());
      this.quizData = { ...free[lang].levels, ...prem[lang].levels };
    } catch (e) {
      console.warn("Quiz files not found, using fallback local data.");
      // Fallback αν τα αρχεία λείπουν
      this.quizData = { "1": [{ q: "Is sharing passwords safe?", o: ["Yes", "No"], a: 1 }] };
    }
  },

  updateUI() {
    const level = Math.floor(this.xp / 100) + 1;
    document.getElementById('level_val').innerText = level;
    document.getElementById('streak_val').innerText = this.streak;
    document.getElementById('xp_fill').style.width = (this.xp % 100) + "%";

    // Achievements & Map Updates
    if (level >= 2) document.getElementById('badge1').classList.add('unlocked');
    if (level >= 5) {
      document.getElementById('badge2').classList.add('unlocked');
      document.getElementById('step2').classList.add('active');
    }
    if (level >= 8) {
      document.getElementById('badge3').classList.add('unlocked');
      document.getElementById('step3').classList.add('active');
    }

    // Elite Status UI
    if (this.isElite) {
      document.getElementById('prem_locked').classList.add('hidden');
      document.getElementById('prem_unlocked').classList.remove('hidden');
      document.getElementById('ad_box').classList.add('hidden');
      document.getElementById('badge3').classList.add('unlocked');
    }
  },

  startQuiz() {
    const lvl = Math.floor(this.xp / 100) + 1;
    if (lvl >= 7 && !this.isElite) {
      this.openModal();
      return;
    }
    document.getElementById('quiz_btn').classList.add('hidden');
    this.renderQuestion(0, 0);
  },

  renderQuestion(idx, count) {
    const lvl = Math.floor(this.xp / 100) + 1;
    const questions = this.quizData[lvl] || this.quizData["1"];
    const q = questions[idx % questions.length];

    document.getElementById('quiz_text').innerHTML = `<b>Q:</b> ${q.q}`;
    const html = q.o.map((o, i) => `
      <button class="main-cta" style="background:#1e293b; color:white; margin-bottom:10px;" onclick="App.checkAnswer(${idx},${i},${count})">
        ${o}
      </button>`).join('');
    document.getElementById('quiz_options').innerHTML = html;
  },

  checkAnswer(idx, selected, count) {
    const lvl = Math.floor(this.xp / 100) + 1;
    const questions = this.quizData[lvl] || this.quizData["1"];
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
      setTimeout(() => this.renderQuestion(idx + 1, count), 1000);
    } else {
      setTimeout(() => {
        const t = this.translations[this.currentLang];
        document.getElementById('quiz_text').innerText = t.finish;
        document.getElementById('quiz_options').innerHTML = "";
        document.getElementById('quiz_btn').classList.remove('hidden');
        document.getElementById('quiz_btn').innerText = t.start;
        this.updateUI();
      }, 1200);
    }
  },

  nav(screen, btn) {
    document.getElementById('screen_home').classList.add('hidden');
    document.getElementById('screen_premium').classList.add('hidden');
    document.getElementById('screen_' + screen).classList.remove('hidden');
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
  },

  openModal() { document.getElementById('premiumModal').style.display = 'block'; },
  closeModal() { document.getElementById('premiumModal').style.display = 'none'; },

  buyPremium() {
    // Εδώ μπορεί να μπει το logic για In-App Purchase
    this.isElite = true;
    localStorage.setItem('isElite', 'true');
    this.updateUI();
    this.closeModal();
    confetti({ particleCount: 200, spread: 100 });
  }
};

// Global Export
window.App = App;

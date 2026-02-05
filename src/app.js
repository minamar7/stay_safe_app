// src/app.js

// ---------------------------
// GLOBAL STATE
// ---------------------------
let currentLang = 'en';
let streak = 1;
let level = 1;
let xp = 0;
let maxXP = 100;

// ---------------------------
// TRANSLATIONS
// ---------------------------
const translations = {
    en: {
        txt_days: "DAYS",
        txt_daily: "🛡️ Daily Training",
        txt_achievements: "🏆 Achievements",
        txt_map: "TRAINING MAP",
        txt_prem_desc: "Unlock all security tools and Emergency Hub.",
        quiz_ready: "Are you ready for today's challenges?",
        start_quiz: "START QUIZ"
    },
    el: {
        txt_days: "ΗΜΕΡΕΣ",
        txt_daily: "🛡️ Καθημερινή Εκπαίδευση",
        txt_achievements: "🏆 Επιτεύγματα",
        txt_map: "ΧΑΡΤΗΣ ΕΚΠΑΙΔΕΥΣΗΣ",
        txt_prem_desc: "Ξεκλειδώστε όλα τα εργαλεία ασφαλείας και το Emergency Hub.",
        quiz_ready: "Είσαι έτοιμος για τις προκλήσεις της ημέρας;",
        start_quiz: "ΞΕΚΙΝΗΣΕ QUIZ"
    },
    // Άλλες γλώσσες μπορούν να προστεθούν...
};

// ---------------------------
// LANGUAGE SELECT
// ---------------------------
function selectLang(lang) {
    currentLang = lang;
    document.getElementById('txt_days').innerText = translations[lang].txt_days;
    document.getElementById('txt_daily').innerText = translations[lang].txt_daily;
    document.getElementById('txt_achievements').innerText = translations[lang].txt_achievements;
    document.getElementById('txt_map').innerText = translations[lang].txt_map;
    document.getElementById('txt_prem_desc').innerText = translations[lang].txt_prem_desc;
    document.getElementById('quiz_text').innerText = translations[lang].quiz_ready;
    document.getElementById('quiz_btn').innerText = translations[lang].start_quiz;
    document.getElementById('onboarding').classList.add('hidden');
    document.getElementById('main_app').classList.remove('hidden');
}

// ---------------------------
// NAVIGATION
// ---------------------------
function nav(screen, btn) {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('screen_home').classList.add('hidden');
    document.getElementById('screen_premium').classList.add('hidden');
    if(screen === 'home') document.getElementById('screen_home').classList.remove('hidden');
    else if(screen === 'premium') document.getElementById('screen_premium').classList.remove('hidden');
}

// ---------------------------
// PREMIUM MODAL
// ---------------------------
function openModal() {
    document.getElementById('premiumModal').style.display = 'block';
}
function closeModal() {
    document.getElementById('premiumModal').style.display = 'none';
}
function buyPremium() {
    alert("🎉 Congratulations! Premium unlocked!");
    document.getElementById('prem_locked').classList.add('hidden');
    document.getElementById('prem_unlocked').classList.remove('hidden');
    closeModal();
}

// ---------------------------
// QUIZ FUNCTIONALITY
// ---------------------------
const quizQuestions = [
    { q: "Check security of your surroundings?", options: ["Yes", "No"], answer: 0 },
    { q: "Do you have emergency contacts?", options: ["Yes", "No"], answer: 0 },
    { q: "Wear safety gear?", options: ["Yes", "No"], answer: 0 }
];

function startQuiz() {
    const quizContainer = document.getElementById('quiz_container');
    quizContainer.innerHTML = '';
    quizQuestions.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'quiz-item';
        div.innerHTML = `<p>${item.q}</p>` +
            item.options.map((opt, idx) =>
                `<button onclick="answerQuiz(${i}, ${idx})">${opt}</button>`).join('');
        quizContainer.appendChild(div);
    });
}

function answerQuiz(qIdx, optIdx) {
    if(optIdx === quizQuestions[qIdx].answer) {
        addXP(20);
        confetti();
    } else {
        alert("⚠️ Try better next time!");
    }
}

// ---------------------------
// XP & LEVEL
// ---------------------------
function addXP(amount) {
    xp += amount;
    if(xp >= maxXP) {
        xp -= maxXP;
        level++;
        streak++;
        confetti();
    }
    updateXPBar();
}

function updateXPBar() {
    const fill = document.getElementById('xp_fill');
    fill.style.width = `${(xp/maxXP)*100}%`;
    document.getElementById('level_val').innerText = level;
    document.getElementById('streak_val').innerText = streak;
}

// ---------------------------
// TOOLS / PREMIUM
// ---------------------------
function runCheckup() {
    alert("🔍 Running full system checkup...");
}
function sendSOS() {
    alert("🚨 SOS sent to emergency contacts!");
}
function loadScamAlerts() {
    alert("⚠️ Loading scam alerts...");
}
function startDojo() {
    alert("⚡ Dojo challenge started!");
}

// ---------------------------
// BADGES
// ---------------------------
function updateBadges() {
    if(streak >= 1) document.getElementById('badge1').classList.add('unlocked');
    if(streak >= 5) document.getElementById('badge2').classList.add('unlocked');
    if(streak >= 10) document.getElementById('badge3').classList.add('unlocked');
}

// ---------------------------
// CONFETTI
// ---------------------------
function confetti() {
    if(window.confetti) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

// ---------------------------
// INIT
// ---------------------------
document.addEventListener('DOMContentLoaded', () => {
    updateXPBar();
    updateBadges();
});

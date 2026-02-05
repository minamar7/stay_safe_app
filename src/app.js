// app.js

// ====== GLOBAL VARIABLES ======
let currentLang = 'en';
let currentLevel = 1;
let streak = 1;
let xp = 0;

let quizData = {
    1: [
        {q: "What's the first thing to do in a fire?", options:["Call 100","Hide","Evacuate"], answer: 2},
        {q: "Best way to secure your password?", options:["123456","Use strong unique password","Password123"], answer: 1},
        {q: "Check emails carefully to avoid?", options:["Spam","Phishing","Downloads"], answer: 1},
        {q: "Which is safer online?", options:["Public WiFi","VPN"], answer: 1},
        {q: "Keep software updated?", options:["Yes","No"], answer: 0}
    ],
    2: [
        {q: "You find unattended bag in public?", options:["Ignore","Report to security","Take it"], answer: 1},
        {q: "What is two-factor authentication?", options:["Extra login step","Ignore it","Password only"], answer: 0},
        {q: "Best way to exit suspicious website?", options:["Close tab","Click links","Download"], answer: 0},
        {q: "Securely sharing files?", options:["Encrypted cloud","Email public link","USB random"], answer: 0},
        {q: "Suspicious email with link?", options:["Click","Delete"], answer: 1}
    ],
    3: [
        {q: "Emergency number for fire?", options:["199","112","100"], answer: 0},
        {q: "Suspicious phone call?", options:["Give info","Hang up"], answer: 1},
        {q: "Public charging stations?", options:["Safe","Potential risk"], answer: 1},
        {q: "Strong password includes?", options:["Numbers, letters, symbols","Name only"], answer: 0},
        {q: "When in doubt online?", options:["Verify sources","Click anything"], answer: 0}
    ]
};

let currentQuiz = [];
let currentQuestionIndex = 0;

// ====== SELECT LANGUAGE ======
function selectLang(lang) {
    currentLang = lang;
    document.getElementById('onboarding').classList.add('hidden');
    document.getElementById('main_app').classList.remove('hidden');
    loadUI();
}

// ====== LOAD UI ======
function loadUI() {
    document.getElementById('streak_val').textContent = streak;
    document.getElementById('level_val').textContent = currentLevel;
    document.getElementById('xp_fill').style.width = xp + "%";
}

// ====== QUIZ LOGIC ======
function startQuiz() {
    currentQuiz = quizData[currentLevel] || quizData[1];
    currentQuestionIndex = 0;
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex >= currentQuiz.length) {
        endQuiz();
        return;
    }

    const q = currentQuiz[currentQuestionIndex];
    const quizText = document.getElementById('quiz_text');
    const quizOptions = document.getElementById('quiz_options');
    quizText.textContent = q.q;
    quizOptions.innerHTML = '';

    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.className = 'quiz-option';
        btn.onclick = () => checkAnswer(i);
        quizOptions.appendChild(btn);
    });
}

function checkAnswer(selected) {
    const q = currentQuiz[currentQuestionIndex];
    const buttons = document.querySelectorAll('.quiz-option');

    buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.answer) {
            btn.style.backgroundColor = '#22c55e'; // green
            btn.style.color = '#fff';
        } else if (i === selected) {
            btn.style.backgroundColor = '#ef4444'; // red
            btn.style.color = '#fff';
        }
    });

    if (selected === q.answer) {
        xp += 20;
    }

    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
        loadUI();
    }, 1000);
}

function endQuiz() {
    alert("Quiz completed! 🎉");
    streak++;
    xp += 10;
    if (xp >= 100) {
        currentLevel++;
        xp = 0;
    }
    loadUI();
}

// ====== NAVIGATION ======
function nav(screen, btn) {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    document.getElementById('screen_home').classList.add('hidden');
    document.getElementById('screen_premium').classList.add('hidden');

    if (screen === 'home') document.getElementById('screen_home').classList.remove('hidden');
    else if (screen === 'premium') document.getElementById('screen_premium').classList.remove('hidden');
}

// ====== PREMIUM MODAL ======
function openModal() {
    document.getElementById('premiumModal').style.display = 'flex';
}
function closeModal() {
    document.getElementById('premiumModal').style.display = 'none';
}
function buyPremium() {
    alert("Premium unlocked! 💎");
    closeModal();
    document.getElementById('prem_locked').classList.add('hidden');
    document.getElementById('prem_unlocked').classList.remove('hidden');
}

// ====== EMERGENCY FUNCTIONS ======
function runCheckup() { alert("Running security checkup..."); }
function sendSOS() { alert("Sending SOS..."); }
function loadScamAlerts() { alert("Loading scam alerts..."); }
function startDojo() { alert("Starting Dojo training..."); }

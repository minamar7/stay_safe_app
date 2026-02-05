// app.js

let currentLang = 'en';
let currentLevel = 1;
let currentStreak = 1;
let xp = 0;
let maxDailyQuestions = 5;

let dailyQuestions = {
    1: [
        { q: "What is the safest way to protect your passwords?", a: ["Use a password manager", "Write them on paper", "Share with friends"], correct: 0 },
        { q: "You receive an unknown email link. What do you do?", a: ["Click it", "Ignore or check sender", "Forward to friend"], correct: 1 },
        { q: "Public Wi-Fi is safe for banking?", a: ["Yes", "No", "Sometimes"], correct: 1 },
        { q: "Do you update software regularly?", a: ["Yes", "No", "Only when needed"], correct: 0 },
        { q: "Use same password everywhere?", a: ["Yes", "No", "Only for trusted sites"], correct: 1 }
    ],
    2: [
        { q: "Two-factor authentication increases security?", a: ["Yes", "No", "Depends"], correct: 0 },
        { q: "You find a USB in office parking. What do you do?", a: ["Plug it in", "Give to IT", "Ignore"], correct: 1 },
        { q: "Strong password should be?", a: ["Short & simple", "Long & complex", "Birthday"], correct: 1 },
        { q: "Regular backups are important?", a: ["Yes", "No", "Only once a year"], correct: 0 },
        { q: "Public charging stations are safe?", a: ["Yes", "No", "Sometimes"], correct: 1 }
    ]
    // Μπορείς να προσθέσεις περισσότερα levels
};

let currentQuestionIndex = 0;
let selectedQuiz = 'daily'; // 'daily' ή 'scenario'

// ----- LANGUAGE -----
function selectLang(lang) {
    currentLang = lang;

    // Κρύβουμε onboarding
    document.getElementById('onboarding').classList.add('hidden');

    // Εμφανίζουμε main app
    document.getElementById('main_app').classList.remove('hidden');

    // Επιλέγουμε default tab
    nav('home', document.getElementById('nav_home'));

    // Φορτώνουμε daily quiz
    loadDailyQuiz();
}

// ----- NAVIGATION -----
function nav(screen, btn) {
    document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if(screen === 'home') {
        document.getElementById('screen_home').classList.remove('hidden');
        document.getElementById('screen_premium').classList.add('hidden');
    } else {
        document.getElementById('screen_home').classList.add('hidden');
        document.getElementById('screen_premium').classList.remove('hidden');
    }
}

// ----- QUIZ -----
function loadDailyQuiz() {
    currentQuestionIndex = 0;
    selectedQuiz = 'daily';
    showQuestion();
}

function showQuestion() {
    const qContainer = document.getElementById('quiz_container');
    const quizText = document.getElementById('quiz_text');
    const quizOptions = document.getElementById('quiz_options');
    const questions = dailyQuestions[currentLevel];

    if(currentQuestionIndex >= maxDailyQuestions || currentQuestionIndex >= questions.length){
        quizText.textContent = "✅ Daily Quiz Complete!";
        quizOptions.innerHTML = '';
        document.getElementById('quiz_btn').style.display = 'none';
        return;
    }

    const q = questions[currentQuestionIndex];
    quizText.textContent = q.q;
    quizOptions.innerHTML = '';

    q.a.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(i);
        quizOptions.appendChild(btn);
    });
}

function checkAnswer(selected) {
    const questions = dailyQuestions[currentLevel];
    const correct = questions[currentQuestionIndex].correct;
    const options = document.querySelectorAll('.quiz-option');

    options.forEach((btn, i) => {
        if(i === correct) btn.style.backgroundColor = '#16a34a'; // πράσινο σωστό
        else if(i === selected) btn.style.backgroundColor = '#dc2626'; // κόκκινο λάθος
        btn.disabled = true;
    });

    // Update XP / streak
    if(selected === correct) {
        xp += 10;
        currentStreak++;
        document.getElementById('streak_val').textContent = currentStreak;
        document.getElementById('xp_fill').style.width = Math.min(xp,100) + '%';
    } else {
        currentStreak = 1;
        document.getElementById('streak_val').textContent = currentStreak;
    }

    currentQuestionIndex++;
    setTimeout(showQuestion, 1000);
}

// ----- PREMIUM MODAL -----
function openModal() { document.getElementById('premiumModal').style.display = 'block'; }
function closeModal() { document.getElementById('premiumModal').style.display = 'none'; }
function buyPremium() {
    alert('Premium unlocked!'); 
    document.getElementById('prem_locked').classList.add('hidden');
    document.getElementById('prem_unlocked').classList.remove('hidden');
}

// ----- TOOLS (PLACEHOLDERS) -----
function runCheckup(){ alert('Running security checkup...'); }
function sendSOS(){ alert('Sending SOS alert...'); }
function loadScamAlerts(){ alert('Loading scam alerts...'); }
function startDojo(){ alert('Starting Dojo training...'); }

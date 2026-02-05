// ==========================
// Stay Safe Elite - app.js
// ==========================

const MAX_QUESTIONS_PER_DAY = 5;

// Example questions for different levels
const questionsDB = {
    1: [
        { q: "What is 2 + 2?", options: ["3", "4", "5"], answer: 1 },
        { q: "What color is the sky?", options: ["Blue", "Green", "Red"], answer: 0 },
        { q: "Which is a fruit?", options: ["Carrot", "Apple", "Potato"], answer: 1 },
        { q: "What comes after Monday?", options: ["Sunday", "Tuesday", "Friday"], answer: 1 },
        { q: "2 * 3 = ?", options: ["5", "6", "7"], answer: 1 }
    ],
    2: [
        { q: "Capital of France?", options: ["Berlin", "Paris", "Rome"], answer: 1 },
        { q: "5 + 7 = ?", options: ["11", "12", "13"], answer: 1 },
        { q: "Which is a mammal?", options: ["Shark", "Dolphin", "Trout"], answer: 1 },
        { q: "Sun rises from?", options: ["East", "West", "North"], answer: 0 },
        { q: "Which planet is closest to Sun?", options: ["Mercury", "Venus", "Earth"], answer: 0 }
    ],
    3: [
        { q: "What is H2O?", options: ["Oxygen", "Water", "Hydrogen"], answer: 1 },
        { q: "Which is largest?", options: ["Earth", "Mars", "Jupiter"], answer: 2 },
        { q: "Which is a programming language?", options: ["Python", "Snake", "Cobra"], answer: 0 },
        { q: "Light travels at?", options: ["300,000 km/s", "150,000 km/s", "450,000 km/s"], answer: 0 },
        { q: "Speed of sound approx?", options: ["340 m/s", "100 m/s", "500 m/s"], answer: 0 }
    ]
};

let currentLevel = 1;
let dailyQuestionIndex = 0;
let selectedQuestions = [];
let streak = 1;

// ==========================
// Quiz Functions
// ==========================

function startQuiz() {
    dailyQuestionIndex = 0;
    selectedQuestions = shuffleArray(questionsDB[currentLevel]).slice(0, MAX_QUESTIONS_PER_DAY);
    showQuestion();
}

function showQuestion() {
    const container = document.getElementById('quiz_container');
    const quizText = document.getElementById('quiz_text');
    const quizOptions = document.getElementById('quiz_options');
    const quizBtn = document.getElementById('quiz_btn');

    if (dailyQuestionIndex >= selectedQuestions.length) {
        quizText.textContent = "🎉 Daily quiz completed!";
        quizOptions.innerHTML = '';
        quizBtn.textContent = "DONE";
        updateStreak();
        return;
    }

    const q = selectedQuestions[dailyQuestionIndex];
    quizText.textContent = q.q;
    quizOptions.innerHTML = '';

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.className = 'quiz-option';
        btn.onclick = () => checkAnswer(idx);
        quizOptions.appendChild(btn);
    });

    quizBtn.style.display = 'none';
}

function checkAnswer(selectedIdx) {
    const q = selectedQuestions[dailyQuestionIndex];
    const options = document.querySelectorAll('#quiz_options .quiz-option');

    options.forEach((btn, idx) => {
        if (idx === q.answer) {
            btn.style.backgroundColor = 'green';
            btn.style.color = 'white';
        } else if (idx === selectedIdx) {
            btn.style.backgroundColor = 'red';
            btn.style.color = 'white';
        } else {
            btn.style.backgroundColor = '#1e293b';
            btn.style.color = 'white';
        }
        btn.disabled = true;
    });

    setTimeout(() => {
        dailyQuestionIndex++;
        showQuestion();
    }, 800);
}

// Shuffle helper
function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ==========================
// Streak & Level
// ==========================

function updateStreak() {
    streak++;
    document.getElementById('streak_val').textContent = streak;
    // Increment level every 5 streaks
    currentLevel = Math.min(Math.floor(streak / 5) + 1, Object.keys(questionsDB).length);
    document.getElementById('level_val').textContent = currentLevel;
    // Optional XP bar animation
    const xpFill = document.getElementById('xp_fill');
    xpFill.style.width = (streak % 5) * 20 + '%';
}

// ==========================
// Navigation / Modal placeholders
// ==========================
function nav(screen, btn) {
    document.getElementById('screen_home').classList.add('hidden');
    document.getElementById('screen_premium').classList.add('hidden');
    if (screen === 'home') document.getElementById('screen_home').classList.remove('hidden');
    if (screen === 'premium') document.getElementById('screen_premium').classList.remove('hidden');

    document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function openModal() { document.getElementById('premiumModal').style.display = 'block'; }
function closeModal() { document.getElementById('premiumModal').style.display = 'none'; }
function buyPremium() { alert("Premium Purchased!"); }

// Placeholder functions for premium tools
function runCheckup() { alert("Checkup run!"); }
function sendSOS() { alert("SOS sent!"); }
function loadScamAlerts() { alert("Alerts loaded!"); }
function startDojo() { alert("Dojo started!"); }

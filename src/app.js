// app.js

// ---------- LANG & ONBOARDING ----------
let currentLang = 'en';
function selectLang(lang) {
    currentLang = lang;
    document.getElementById('onboarding').classList.add('hidden');
    document.getElementById('main_app').classList.remove('hidden');
    loadDailyQuiz();
}

// ---------- NAVIGATION ----------
function nav(screen, btn) {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    if (screen === 'home') {
        document.getElementById('screen_home').classList.remove('hidden');
        document.getElementById('screen_premium').classList.add('hidden');
    } else {
        document.getElementById('screen_home').classList.add('hidden');
        document.getElementById('screen_premium').classList.remove('hidden');
    }
}

// ---------- PREMIUM MODAL ----------
function openModal() {
    document.getElementById('premiumModal').style.display = 'flex';
}
function closeModal() {
    document.getElementById('premiumModal').style.display = 'none';
}
function buyPremium() {
    alert('Premium unlocked!');
    closeModal();
}

// ---------- QUIZ DATA ----------
const dailyQuestions = {
    1: [
        {q: "What is the universal emergency number?", a:["112","911","100"], correct:0},
        {q: "Should you share passwords with coworkers?", a:["Yes","No"], correct:1},
        {q: "Which color indicates danger in alerts?", a:["Red","Green"], correct:0},
        {q: "How often should you change passwords?", a:["Monthly","Never","Yearly"], correct:0},
        {q: "Should you click unknown links?", a:["Yes","No"], correct:1}
    ],
    2: [
        {q: "Fire emergency number?", a:["199","100","112"], correct:0},
        {q: "Best practice for secure Wi-Fi?", a:["Use strong password","No password","Share with friends"], correct:0},
        {q: "Correct for phishing email?", a:["Click link","Delete and report"], correct:1},
        {q: "Use same password everywhere?", a:["Yes","No"], correct:1},
        {q: "Keep antivirus updated?", a:["Yes","No"], correct:0}
    ],
    // Add more levels...
};

const scenarioQuestions = [
    {q: "You receive a suspicious email asking for your password.", a:["Report it","Reply"], correct:0},
    {q: "You see a fire in the building.", a:["Call 199","Ignore"], correct:0},
    {q: "You notice a stranger tailing employees.", a:["Report to security","Follow them"], correct:0},
    {q: "Your colleague shares sensitive info publicly.", a:["Alert management","Do nothing"], correct:0},
    {q: "Phone call asking for bank info.", a:["Hang up and report","Give info"], correct:0}
];

// ---------- QUIZ STATE ----------
let currentQuiz = 'daily';
let quizIndex = 0;
let quizLevel = 1;
let dailyScore = 0;

// ---------- LOAD QUIZ ----------
function loadDailyQuiz() {
    currentQuiz = 'daily';
    quizIndex = 0;
    dailyScore = 0;
    renderQuiz();
}

function loadScenarioQuiz() {
    currentQuiz = 'scenario';
    quizIndex = 0;
    dailyScore = 0;
    renderQuiz();
}

// ---------- RENDER QUIZ ----------
function renderQuiz() {
    const container = document.getElementById('quiz_container');
    let questionData;
    if(currentQuiz==='daily') {
        questionData = dailyQuestions[quizLevel][quizIndex];
    } else {
        questionData = scenarioQuestions[quizIndex];
    }

    document.getElementById('quiz_text').innerText = questionData.q;
    const optionsDiv = document.getElementById('quiz_options');
    optionsDiv.innerHTML = '';

    questionData.a.forEach((ans, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.innerText = ans;
        btn.onclick = () => checkAnswer(i, questionData.correct, btn);
        optionsDiv.appendChild(btn);
    });
}

// ---------- CHECK ANSWER ----------
function checkAnswer(selected, correct, btn) {
    if(selected === correct) {
        btn.style.backgroundColor = 'green';
        dailyScore++;
    } else {
        btn.style.backgroundColor = 'red';
        // highlight correct
        document.querySelectorAll('.quiz-option')[correct].style.backgroundColor = 'green';
    }
    setTimeout(() => {
        quizIndex++;
        const questions = currentQuiz==='daily' ? dailyQuestions[quizLevel] : scenarioQuestions;
        if(quizIndex < questions.length) {
            renderQuiz();
        } else {
            alert(`Quiz finished! Score: ${dailyScore}/${questions.length}`);
            if(currentQuiz==='daily') {
                quizLevel++;
            }
            loadDailyQuiz();
        }
    }, 800);
}

// ---------- BUTTON HANDLERS ----------
function startQuiz() {
    renderQuiz();
}

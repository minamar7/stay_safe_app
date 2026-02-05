// ==========================
// STAY SAFE ELITE APP.JS
// ==========================

// ---------- LANGUAGES ----------
let currentLang = 'en';
const translations = {
    en: { daily: "Daily Training", achievements: "Achievements", trainingMap: "TRAINING MAP", eliteAccess: "Elite Access", unlockDesc: "Unlock all security tools and Emergency Hub." },
    el: { daily: "Καθημερινή Εκπαίδευση", achievements: "Επιτεύγματα", trainingMap: "ΧΑΡΤΗΣ ΕΚΠΑΙΔΕΥΣΗΣ", eliteAccess: "Elite Πρόσβαση", unlockDesc: "Ξεκλειδώστε όλα τα εργαλεία ασφαλείας και το Emergency Hub." },
    de: { daily: "Tägliches Training", achievements: "Errungenschaften", trainingMap: "TRAININGSKARTE", eliteAccess: "Elite Zugang", unlockDesc: "Alle Sicherheitstools und Emergency Hub freischalten." }
    // Άλλες γλώσσες μπορούν να προστεθούν
};

function selectLang(lang) {
    currentLang = lang;
    document.getElementById('onboarding').classList.add('hidden');
    document.getElementById('main_app').classList.remove('hidden');
    translateApp();
}

function translateApp() {
    document.getElementById('txt_daily').innerText = translations[currentLang].daily;
    document.getElementById('txt_achievements').innerText = "🏆 " + translations[currentLang].achievements;
    document.getElementById('txt_map').innerText = translations[currentLang].trainingMap;
    document.getElementById('txt_prem_desc').innerText = translations[currentLang].unlockDesc;
    document.querySelector("#prem_locked h2").innerText = translations[currentLang].eliteAccess;
}

// ---------- NAVIGATION ----------
function nav(screen, btn) {
    document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('screen_home').classList.toggle('hidden', screen !== 'home');
    document.getElementById('screen_premium').classList.toggle('hidden', screen !== 'premium');
}

// ---------- MODAL ----------
function openModal() { 
    document.getElementById('premiumModal').style.display = 'flex'; 
}
function closeModal() { 
    document.getElementById('premiumModal').style.display = 'none'; 
}
function buyPremium() { 
    alert("Thank you for upgrading!"); 
    closeModal(); 
}

// ---------- CONFETTI ----------
function confetti() { window.confetti && window.confetti(); }

// ==========================
// QUIZ DATA
// ==========================
const freeQuestions = [
    // Levels 1-6, 5 ερωτήσεις ανά level
    [
        { q:"Lock your phone when unattended?", options:["Yes","No"], answer:0 },
        { q:"Use public Wi-Fi without VPN?", options:["Yes","No"], answer:1 },
        { q:"Share passwords with colleagues?", options:["Yes","No"], answer:1 },
        { q:"Report suspicious email?", options:["Yes","No"], answer:0 },
        { q:"Click unknown links?", options:["Yes","No"], answer:1 }
    ],
    // Level 2
    [
        { q:"Update OS regularly?", options:["Yes","No"], answer:0 },
        { q:"Store passwords in plain text?", options:["Yes","No"], answer:1 },
        { q:"Enable 2FA?", options:["Yes","No"], answer:0 },
        { q:"Ignore system warnings?", options:["Yes","No"], answer:1 },
        { q:"Use strong passwords?", options:["Yes","No"], answer:0 }
    ],
    // Levels 3-6 μπορούν να προστεθούν με το ίδιο format
];

const premiumQuestions = [
    // Level 7+
    [
        { q:"You notice suspicious Wi-Fi at airport. Action?", options:["Connect","Avoid"], answer:1 },
        { q:"Stranger asks for your passport info. Action?", options:["Share","Refuse"], answer:1 },
        { q:"ATM seems tampered. Action?", options:["Use it","Report it"], answer:1 },
        { q:"Email claims prize. Action?", options:["Click link","Ignore"], answer:1 },
        { q:"Travel alert received. Action?", options:["Check alert","Ignore"], answer:0 }
    ],
    // Level 8+ more premium scenarios...
];

// ==========================
// QUIZ LOGIC
// ==========================
let currentLevel = 1;
let qIndex = 0;
let score = 0;
let currentQuiz = freeQuestions;

function startQuiz() {
    // Determine quiz type
    currentQuiz = currentLevel <= 6 ? freeQuestions : premiumQuestions;
    qIndex = 0; score = 0;
    showQuestion();
}

function showQuestion() {
    const levelQuestions = currentQuiz[currentLevel <=6 ? currentLevel-1 : currentLevel-7];
    if(!levelQuestions || !levelQuestions[qIndex]) { endLevel(); return; }
    const qObj = levelQuestions[qIndex];

    const container = document.getElementById("quiz_container");
    container.innerHTML = `
        <h2 style="margin:0;">🛡️ ${translations[currentLang].daily}</h2>
        <p style="color:var(--muted); font-size:0.9rem;">${qObj.q}</p>
        <div id="quiz_options">
            ${qObj.options.map((opt,i)=>`<button class="option-btn" onclick="answerQuestion(${i})">${opt}</button>`).join('')}
        </div>
    `;
}

function answerQuestion(selected) {
    const levelQuestions = currentQuiz[currentLevel <=6 ? currentLevel-1 : currentLevel-7];
    const correct = levelQuestions[qIndex].answer;
    const options = document.querySelectorAll(".option-btn");

    options.forEach((btn,i)=>{
        if(i===correct) btn.style.backgroundColor="green";
        else if(i===selected) btn.style.backgroundColor="red";
        btn.disabled=true;
    });

    if(selected===correct) score++;

    setTimeout(()=>{
        qIndex++;
        if(qIndex<levelQuestions.length) showQuestion();
        else endLevel();
    },800);
}

function endLevel() {
    confetti();
    alert(`Level ${currentLevel} complete! Score: ${score}/${currentQuiz[currentLevel <=6 ? currentLevel-1 : currentLevel-7].length}`);
    // Video ad
    const adBox = document.getElementById("ad_box");
    adBox.innerHTML = `<video width="100%" controls autoplay><source src="daily-ad.mp4" type="video/mp4"></video>`;
    currentLevel++;
}
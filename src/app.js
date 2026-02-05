// ==========================
// STAY SAFE ELITE APP.JS
// ==========================

/************* LANGUAGES *************/
let currentLang = 'en';
function selectLang(lang) {
    currentLang = lang;
    document.getElementById('onboarding').classList.add('hidden');
    document.getElementById('main_app').classList.remove('hidden');
}

/************* NAVIGATION *************/
function nav(screen, btn) {
    document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('screen_home').classList.toggle('hidden', screen !== 'home');
    document.getElementById('screen_premium').classList.toggle('hidden', screen !== 'premium');
}

/************* MODAL *************/
function openModal() { document.getElementById('premiumModal').style.display = 'flex'; }
function closeModal() { document.getElementById('premiumModal').style.display = 'none'; }
function buyPremium() { alert("Thank you for upgrading!"); closeModal(); }

/************* CONFETTI *************/
function confetti() { window.confetti && window.confetti(); }

/************* DAILY QUIZ (FREE 1-6) *************/
const dailyQuestions = [
    { q: "Lock your phone when unattended?", options: ["Yes","No"], answer:0 },
    { q: "Use public Wi-Fi without VPN?", options: ["Yes","No"], answer:1 },
    { q: "Share passwords with colleagues?", options: ["Yes","No"], answer:1 },
    { q: "Report suspicious email?", options: ["Yes","No"], answer:0 },
    { q: "Click unknown links?", options: ["Yes","No"], answer:1 },
    { q: "Use 2FA where possible?", options: ["Yes","No"], answer:0 },
    { q: "Leave doors unlocked?", options: ["Yes","No"], answer:1 },
    { q: "Update software regularly?", options: ["Yes","No"], answer:0 },
    { q: "Use strong passwords?", options: ["Yes","No"], answer:0 },
    { q: "Ignore security alerts?", options: ["Yes","No"], answer:1 },
    { q: "Keep backups?", options: ["Yes","No"], answer:0 },
    { q: "Share personal info online?", options: ["Yes","No"], answer:1 },
    { q: "Check emergency exits?", options: ["Yes","No"], answer:0 },
    { q: "Trust strangers with info?", options: ["Yes","No"], answer:1 },
    { q: "Report lost badge?", options: ["Yes","No"], answer:0 },
    { q: "Leave PC unlocked?", options: ["Yes","No"], answer:1 },
    { q: "Encrypt sensitive files?", options: ["Yes","No"], answer:0 },
    { q: "Use same password everywhere?", options: ["Yes","No"], answer:1 },
    { q: "Verify sender emails?", options: ["Yes","No"], answer:0 },
    { q: "Ignore system updates?", options: ["Yes","No"], answer:1 },
    { q: "Log out after work?", options: ["Yes","No"], answer:0 },
    { q: "Click pop-up ads?", options: ["Yes","No"], answer:1 },
    { q: "Use antivirus software?", options: ["Yes","No"], answer:0 },
    { q: "Use default admin password?", options: ["Yes","No"], answer:1 },
    { q: "Store sensitive info securely?", options: ["Yes","No"], answer:0 },
    { q: "Ignore phishing training?", options: ["Yes","No"], answer:1 },
    { q: "Lock workstation screen?", options: ["Yes","No"], answer:0 },
    { q: "Share USB sticks freely?", options: ["Yes","No"], answer:1 },
    { q: "Use strong Wi-Fi password?", options: ["Yes","No"], answer:0 },
    { q: "Write passwords on sticky notes?", options: ["Yes","No"], answer:1 }
];

let dailyLevel = 1;
let dailyQIndex = 0;
let dailyScore = 0;

function startQuiz() {
    dailyQIndex = 0;
    dailyScore = 0;
    showDailyQuestion();
}

function showDailyQuestion() {
    const levelQuestions = dailyQuestions.slice((dailyLevel-1)*5, dailyLevel*5);
    const qObj = levelQuestions[dailyQIndex];
    const quizContainer = document.getElementById("quiz_container");
    quizContainer.innerHTML = `
        <h2 style="margin:0;">🛡️ Daily Training</h2>
        <p style="color:var(--muted); font-size:0.9rem;">${qObj.q}</p>
        <div id="quiz_options">
            ${qObj.options.map((opt,i)=>`<button class="option-btn" onclick="answerDaily(${i})">${opt}</button>`).join('')}
        </div>
    `;
}

function answerDaily(selected) {
    const levelQuestions = dailyQuestions.slice((dailyLevel-1)*5, dailyLevel*5);
    const correct = levelQuestions[dailyQIndex].answer;
    const options = document.querySelectorAll(".option-btn");

    options.forEach((btn,i)=>{
        if(i===correct) btn.style.backgroundColor="green";
        else if(i===selected) btn.style.backgroundColor="red";
        btn.disabled=true;
    });

    if(selected===correct) dailyScore++;

    setTimeout(()=>{
        dailyQIndex++;
        if(dailyQIndex<levelQuestions.length) showDailyQuestion();
        else endDailyLevel();
    },800);
}

function endDailyLevel() {
    confetti();
    alert(`Level ${dailyLevel} complete! Score: ${dailyScore}/5`);
    // Video Ad
    const adBox = document.getElementById("ad_box");
    adBox.innerHTML = `<video width="100%" controls autoplay><source src="daily-ad.mp4" type="video/mp4"></video>`;
    if(dailyLevel<6) dailyLevel++;
}

/************* PREMIUM SCENARIOS 7-10 *************/
const scenarioQuestions = [
    { q:"Traveling abroad, find suspicious package. Action?", options:["Ignore","Report to authorities"], answer:1 },
    { q:"Public Wi-Fi asks password. Action?", options:["Connect freely","Use VPN"], answer:1 },
    { q:"Stranger requests sensitive info. Action?", options:["Share","Decline"], answer:1 },
    { q:"Email from unknown bank. Action?", options:["Click link","Verify email"], answer:1 },
    { q:"Suspicious phone call about account. Action?", options:["Give info","Hang up"], answer:1 },
    { q:"Lost luggage. Sensitive docs inside. Action?", options:["Ignore","Report immediately"], answer:1 },
    { q:"USB found on ground at airport. Action?", options:["Plug in","Report"], answer:1 },
    { q:"Emergency exit blocked. Action?", options:["Ignore","Report"], answer:1 },
    { q:"Fire alarm triggered. Action?", options:["Run","Follow instructions"], answer:1 },
    { q:"Hotel asks for extra info. Action?", options:["Give freely","Check legitimacy"], answer:1 },
    { q:"Cyber attack detected. Action?", options:["Ignore","Inform IT"], answer:1 },
    { q:"Suspicious app installed. Action?", options:["Delete","Keep"], answer:0 },
    { q:"Phishing link clicked. Action?", options:["Ignore","Report"], answer:1 },
    { q:"Lost badge at work. Action?", options:["Ignore","Report"], answer:1 },
    { q:"Emergency number received. Action?", options:["Ignore","Call if needed"], answer:1 },
    { q:"Suspicious vehicle outside. Action?", options:["Ignore","Report"], answer:1 },
    { q:"Unknown friend request. Action?", options:["Accept","Ignore"], answer:1 },
    { q:"Malware alert. Action?", options:["Ignore","Run antivirus"], answer:1 },
    { q:"Travel advisory issued. Action?", options:["Ignore","Follow instructions"], answer:1 },
    { q:"Overhearing confidential info. Action?", options:["Ignore","Report"], answer:1 }
];

const premiumLevels = {7:[0,1,2,3,4],8:[5,6,7,8,9],9:[10,11,12,13,14],10:[15,16,17,18,19]};
let currentPremiumLevel = 7;
let premiumQIndex = 0;
let premiumScore = 0;

function startPremiumScenario() {
    premiumQIndex=0;
    premiumScore=0;
    showPremiumQuestion();
}

function showPremiumQuestion() {
    const qIndex = premiumLevels[currentPremiumLevel][premiumQIndex];
    const qObj = scenarioQuestions[qIndex];
    const quizContainer = document.getElementById("quiz_container");
    quizContainer.innerHTML = `
        <h2 style="margin:0;">🛡️ Premium Scenario</h2>
        <p style="color:var(--muted); font-size:0.9rem;">${qObj.q}</p>
        <div id="quiz_options">
            ${qObj.options.map((opt,i)=>`<button class="option-btn" onclick="answerPremium(${i})">${opt}</button>`).join('')}
        </div>
    `;
}

function answerPremium(selected) {
    const qIndex = premiumLevels[currentPremiumLevel][premiumQIndex];
    const correct = scenarioQuestions[qIndex].answer;
    const options = document.querySelectorAll(".option-btn");

    options.forEach((btn,i)=>{
        if(i===correct) btn.style.backgroundColor="green";
        else if(i===selected) btn.style.backgroundColor="red";
        btn.disabled=true;
    });

    if(selected===correct) premiumScore++;

    setTimeout(()=>{
        premiumQIndex++;
        if(premiumQIndex<premiumLevels[currentPremiumLevel].length) showPremiumQuestion();
        else endPremiumLevel();
    },800);
}

function endPremiumLevel() {
    confetti();
    alert(`Premium Level ${currentPremiumLevel} complete! Score: ${premiumScore}/5`);
    const adBox = document.getElementById("ad_box");
    adBox.innerHTML = `<video width="100%" controls autoplay><source src="premium-ad.mp4" type="video/mp4"></video>`;
    if(currentPremiumLevel<10) currentPremiumLevel++;
}

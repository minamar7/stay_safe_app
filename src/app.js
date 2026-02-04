import { Capacitor } from '@capacitor/core';
import { AdMob } from '@capacitor-community/admob';
import { InAppPurchases } from '@capacitor/in-app-purchases';

const App = {
  isElite: localStorage.getItem('isElite')==='true',
  xp: parseInt(localStorage.getItem('xp')||0),
  streak: parseInt(localStorage.getItem('streak')||1),
  currentLang:'en',
  quizData:{},
  
  async init(lang='en'){
    this.currentLang = lang;

    // Load quizzes
    const free = await fetch(`questions_free_${lang}.json`).then(r=>r.json());
    const prem = await fetch(`questions_premium_${lang}.json`).then(r=>r.json());
    this.quizData = {...free[lang].levels, ...prem[lang].levels};

    this.updateUI();
  },

  updateUI(){
    document.getElementById('level_val').innerText = Math.floor(this.xp/100)+1;
    document.getElementById('xp_fill').style.width = (this.xp%100) + "%";

    if(this.isElite){
      document.getElementById('prem_locked').classList.add('hidden');
      document.getElementById('prem_unlocked').classList.remove('hidden');
      document.getElementById('ad_box').classList.add('hidden');
    }
  },

  async startQuiz(){
    const lvl = Math.floor(this.xp/100)+1;
    if(lvl>=7 && !this.isElite){ alert("Elite required!"); this.openPremiumModal(); return; }
    this.renderQuestion(0,0);
  },

  renderQuestion(idx,count){
    const lvl = Math.floor(this.xp/100)+1;
    const q = this.quizData[lvl][idx % this.quizData[lvl].length];
    document.getElementById('quiz_text').innerHTML = `<b>Q:</b> ${q.q}`;
    const html = q.o.map((o,i)=> `<button class="main-cta" onclick="App.checkAnswer(${idx},${i},${count})">${o}</button>`).join('');
    document.getElementById('quiz_options').innerHTML = html;
  },

  checkAnswer(idx,selected,count){
    const lvl = Math.floor(this.xp/100)+1;
    const q = this.quizData[lvl][idx % this.quizData[lvl].length];
    const buttons = document.querySelectorAll('#quiz_options button');
    buttons.forEach((b,i)=>{
      if(i===q.a) b.style.background='green';
      if(i===selected && i!==q.a) b.style.background='red';
      b.disabled=true;
    });

    if(selected===q.a){ this.xp+=50; localStorage.setItem('xp', this.xp); confetti({particleCount:50, spread:30}); }
    count++;
    if(count<5) setTimeout(()=>this.renderQuestion(idx+1,count),700);
    else setTimeout(()=>{document.getElementById('quiz_text').innerText="Finished!";document.getElementById('quiz_options').innerHTML="";this.updateUI();},1000);
  },

  openPremiumModal(){ document.getElementById('premiumModal').style.display='block'; },
  closePremiumModal(){ document.getElementById('premiumModal').style.display='none'; },

  async buyPremium(){
    const purchase = await InAppPurchases.purchase({productId:"premium_membership"});
    if(purchase){
      this.isElite=true;
      localStorage.setItem('isElite','true');
      this.updateUI();
      confetti({particleCount:200, spread:100});
      this.closePremiumModal();
    }
  },

  async showAds(){
    if(!this.isElite){
      await AdMob.initialize();
      await AdMob.showBanner({adId:"ca-app-pub-xxx/yyy",position:"BOTTOM_CENTER"});
    }
  }
};

window.App = App;
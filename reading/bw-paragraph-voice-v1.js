(()=>{
  let sel=0, pausedTime=0, voiceCache={};
  function labels(){
    return lang==='fr'
      ? {cont:'▶ Continuer la lecture',pause:'⏸ Pause',hint:'Cliquez sur un paragraphe : la lecture de ce paragraphe commence immédiatement.'}
      : lang==='es'
      ? {cont:'▶ Continuar lectura',pause:'⏸ Pausa',hint:'Haz clic en un párrafo: la lectura de ese párrafo empieza inmediatamente.'}
      : {cont:'▶ Continue reading',pause:'⏸ Pause',hint:'Click any paragraph: that paragraph starts reading immediately.'};
  }
  function langCode(){ return lang==='fr'?'fr-FR':lang==='es'?'es-ES':'en-US'; }
  function getReadyVoice(code, cb){
    if(!window.speechSynthesis){ cb(null); return; }
    const key=code.toLowerCase();
    const choose=()=>{
      const voices=window.speechSynthesis.getVoices()||[];
      if(!voices.length) return null;
      const base=key.slice(0,2);
      const exact=voices.find(v=>(v.lang||'').toLowerCase()===key);
      const sameBase=voices.find(v=>(v.lang||'').toLowerCase().slice(0,2)===base);
      return exact||sameBase||null;
    };
    if(voiceCache[key]){ cb(voiceCache[key]); return; }
    let v=choose();
    if(v){ voiceCache[key]=v; cb(v); return; }
    let done=false, tries=0;
    const finish=(voice)=>{ if(done)return; done=true; if(voice)voiceCache[key]=voice; cb(voice||null); };
    const poll=setInterval(()=>{
      tries++;
      const vv=choose();
      if(vv){ clearInterval(poll); finish(vv); }
      else if(tries>=20){ clearInterval(poll); finish(null); }
    },75);
    const once=()=>{
      const vv=choose();
      if(vv){ clearInterval(poll); finish(vv); }
    };
    window.speechSynthesis.addEventListener?.('voiceschanged', once, {once:true});
    window.speechSynthesis.getVoices();
  }
  function speakSelected(){
    const list=[...document.querySelectorAll('#reader .sentence')], p=list[sel];
    if(!p || !window.speechSynthesis) return;
    audioPlayer.pause();
    pausedTime=audioPlayer.currentTime||pausedTime||0;
    window.currentLang=lang;
    window.speechSynthesis.cancel();
    const code=langCode();
    getReadyVoice(code,(voice)=>{
      const u=new SpeechSynthesisUtterance(p.textContent);
      u.lang=code;
      u.rate=.82;
      u.pitch=1;
      if(voice) u.voice=voice;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    });
  }
  function bind(){
    const list=[...document.querySelectorAll('#reader .sentence')], t=labels();
    list.forEach((p,i)=>{
      p.style.cursor='pointer';
      p.onclick=()=>{
        sel=i;
        list.forEach((x,n)=>x.classList.toggle('on',n===i));
        speakSelected();
      };
    });
    let bar=document.getElementById('fragmentBar');
    if(bar) bar.innerHTML=`<span class="small">${t.hint}</span>`;
    playBtn.textContent=t.cont;
    stopBtn.textContent=t.pause;
    playBtn.onclick=()=>{
      if(window.speechSynthesis) window.speechSynthesis.cancel();
      const a=audioPlayer,d=NAMBOK6[lang];
      if(!a.getAttribute('src')){
        a.src=d.audio[0]; a.load();
        a.addEventListener('loadedmetadata',()=>{
          if(pausedTime>0&&pausedTime<a.duration-.2) a.currentTime=pausedTime;
        },{once:true});
      } else if(pausedTime>0&&pausedTime<a.duration-.2){
        a.currentTime=pausedTime;
      }
      a.play().catch(()=>{}); reading=true;
    };
    stopBtn.onclick=()=>{
      pausedTime=audioPlayer.currentTime||pausedTime;
      audioPlayer.pause();
      if(window.speechSynthesis) window.speechSynthesis.cancel();
      reading=false;
    };
  }
  if(window.speechSynthesis){
    window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged',()=>{
      voiceCache={};
      ['fr-FR','es-ES','en-US'].forEach(c=>getReadyVoice(c,()=>{}));
    });
  }
  setTimeout(bind,500);
  document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>setTimeout(()=>{
    sel=0; pausedTime=0; window.currentLang=lang; bind();
  },80)));
})();
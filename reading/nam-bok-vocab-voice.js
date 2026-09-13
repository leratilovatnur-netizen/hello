(function(){
  function karolinVocabVoice(text){
    try{
      if(!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      var current=(typeof lang!=='undefined'?lang:(typeof currentLang!=='undefined'?currentLang:'en'));
      var u=new SpeechSynthesisUtterance(text);
      u.lang=current==='fr'?'fr-FR':current==='es'?'es-ES':'en-US';
      u.rate=0.82;
      u.pitch=1;
      var voices=window.speechSynthesis.getVoices();
      var code=u.lang.toLowerCase();
      var base=code.slice(0,2);
      var preferred=voices.find(function(v){return (v.lang||'').toLowerCase()===code;})||voices.find(function(v){return (v.lang||'').toLowerCase().slice(0,2)===base;});
      if(preferred) u.voice=preferred;
      window.speechSynthesis.speak(u);
    }catch(e){}
  }
  window.speakWord=karolinVocabVoice;
  window.word=karolinVocabVoice;
  if('speechSynthesis' in window){window.speechSynthesis.getVoices();}
})();
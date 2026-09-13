(function(){
  window.speakVocab=function(text){
    try{
      if(!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      var u=new SpeechSynthesisUtterance(text);
      u.lang=currentLang==='fr'?'fr-FR':currentLang==='es'?'es-ES':'en-US';
      u.rate=0.82;
      u.pitch=1;
      var voices=window.speechSynthesis.getVoices();
      var lang=u.lang.toLowerCase();
      var base=lang.slice(0,2);
      var preferred=voices.find(function(v){return (v.lang||'').toLowerCase()===lang;})||voices.find(function(v){return (v.lang||'').toLowerCase().slice(0,2)===base;});
      if(preferred) u.voice=preferred;
      window.speechSynthesis.speak(u);
    }catch(e){}
  };
  if('speechSynthesis' in window){window.speechSynthesis.getVoices();}
})();
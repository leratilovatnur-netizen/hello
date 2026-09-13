function karolinVocabVoice(text){
  if(!window.speechSynthesis)return;
  window.speechSynthesis.cancel();
  const current=(typeof lang!=='undefined'?lang:(typeof currentLang!=='undefined'?currentLang:'en'));
  const locale=current==='fr'?'fr-FR':current==='es'?'es-ES':'en-US';
  const u=new SpeechSynthesisUtterance(text);
  u.lang=locale;
  u.rate=.78;
  u.pitch=1;
  const voices=window.speechSynthesis.getVoices();
  const preferredNames=current==='fr'?['Audrey','Thomas','Amélie']:current==='es'?['Mónica','Paulina','Jorge']:['Samantha','Ava','Allison'];
  let v=voices.find(x=>preferredNames.some(n=>x.name&&x.name.includes(n))&&x.lang&&x.lang.toLowerCase().startsWith(locale.slice(0,2).toLowerCase()));
  if(!v)v=voices.find(x=>x.lang===locale)||voices.find(x=>x.lang&&x.lang.toLowerCase().startsWith(locale.slice(0,2).toLowerCase()));
  if(v)u.voice=v;
  window.speechSynthesis.speak(u);
}
window.speakWord=karolinVocabVoice;
window.word=karolinVocabVoice;

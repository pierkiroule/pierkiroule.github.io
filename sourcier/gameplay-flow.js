(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.SilentBubbleFlow=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

  function createState(){return{energy:0,streak:0,zone:"noise",grace:0};}

  function update(previous,clearance,dt){
    const safe=clearance<=.72,warning=clearance<=1.08;
    const grace=safe?.3:Math.max(0,previous.grace-dt);
    const zone=safe||grace>0?"silence":warning?"edge":"noise";
    const energy=clamp(previous.energy+(zone==="silence"?.16:zone==="edge"?-.09:-.24)*dt,0,1);
    const streak=zone==="silence"?previous.streak+dt:zone==="noise"?0:previous.streak;
    return{energy,streak,zone,grace};
  }

  function label(state){
    if(state.zone==="noise")return"REVIENS AU CALME";
    if(state.streak>=12)return"HARMONIE";
    if(state.streak>=5)return"BEL ÉQUILIBRE";
    return"CALME";
  }

  function nextEcho(echoes,taken,progress){
    const index=echoes.findIndex((value,i)=>!taken[i]&&value>=progress-.018);
    return index<0?1:echoes[index];
  }
  function rewardDuration(collected){return clamp(Math.floor(collected),0,12)*10;}
  return{createState,update,label,nextEcho,rewardDuration};
});

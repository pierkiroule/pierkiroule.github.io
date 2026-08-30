(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.SilentBubbleBreath=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  function createState(){return{noiseFloor:.008,samples:0,rawAudioLevel:0,rawBreath:0,level:0};}
  function update(state,rms,calibrating=false){
    state.rawAudioLevel=rms;
    if(calibrating){state.samples++;state.noiseFloor+=(rms-state.noiseFloor)/Math.min(state.samples,90);state.rawBreath=state.level=0;return 0;}
    state.rawBreath=Math.max(0,rms-state.noiseFloor);
    const targetBreath=clamp((rms-state.noiseFloor*1.35)/Math.max(.018,state.noiseFloor*3),0,1);
    state.level+=(targetBreath-state.level)*(targetBreath>state.level?.16:.08);
    return state.level;
  }
  return{createState,update};
});

(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.SilentBubbleHand=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  function createState(){return{detected:false,changedAt:0,raw:false};}
  function update(state,raw,now,{onDelay=100,offDelay=200}={}){
    if(raw!==state.raw){state.raw=raw;state.changedAt=now;}
    if(raw!==state.detected&&now-state.changedAt>=(raw?onDelay:offDelay))state.detected=raw;
    return state.detected;
  }
  return{createState,update};
});

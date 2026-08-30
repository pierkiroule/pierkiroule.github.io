(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.SilentBubbleFlappy=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  // A deliberately gentle pace leaves children enough time to read the tunnel.
  const DEFAULTS={forwardSpeed:56,lift:215,gravity:180,maxRise:95,maxFall:110,sizeResponse:9};
  function createState(){return{vy:0,scale:1/3};}
  function step(state,pressed,dt,options={}){
    const config={...DEFAULTS,...options},safeDt=Math.max(.001,Math.min(.034,dt));
    state.vy+=(pressed?-config.lift:config.gravity)*safeDt;
    state.vy=Math.max(-config.maxRise,Math.min(config.maxFall,state.vy));
    const targetScale=pressed?1:1/3;
    state.scale+=(targetScale-state.scale)*(1-Math.exp(-config.sizeResponse*safeDt));
    return{dx:config.forwardSpeed*safeDt,dy:state.vy*safeDt,scale:state.scale};
  }
  return{createState,step,DEFAULTS};
});

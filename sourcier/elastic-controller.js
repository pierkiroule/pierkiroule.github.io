(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.SilentBubbleElastic=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

  function createState({range=96,frequency=5.5,damping=.82,curve=1.22}={}){
    return{range,frequency,damping,curve,active:false,anchorX:0,anchorY:0,targetX:0,targetY:0,pullX:0,pullY:0,velocityX:0,velocityY:0,output:{forceX:0,forceY:0,velocityX:0,velocityY:0,boost:false,tension:0}};
  }

  function begin(state,x,y){state.active=true;state.anchorX=state.targetX=x;state.anchorY=state.targetY=y;state.pullX=state.pullY=state.velocityX=state.velocityY=0;return state.output;}
  function move(state,x,y){state.targetX=x;state.targetY=y;}
  function update(state,dt){
    const step=clamp(dt||.016,.001,.04),targetX=state.targetX-state.anchorX,targetY=state.targetY-state.anchorY;
    // A damped spring, stepped in small slices, stays soft and stable on slow phones.
    const slices=Math.max(1,Math.ceil(step/.008)),slice=step/slices,omega=Math.PI*2*state.frequency;
    for(let i=0;i<slices;i++){
      state.velocityX+=(targetX-state.pullX)*omega*omega*slice;state.velocityY+=(targetY-state.pullY)*omega*omega*slice;
      const drag=Math.exp(-2*state.damping*omega*slice);state.velocityX*=drag;state.velocityY*=drag;
      state.pullX+=state.velocityX*slice;state.pullY+=state.velocityY*slice;
    }
    const distance=Math.hypot(state.pullX,state.pullY),tension=clamp(distance/state.range,0,1),strength=tension**state.curve,scale=distance?strength/distance:0;
    state.output={forceX:state.pullX*scale,forceY:state.pullY*scale,velocityX:state.velocityX/state.range,velocityY:state.velocityY/state.range,boost:false,tension};return state.output;
  }
  function release(state){state.active=false;state.output={forceX:0,forceY:0,velocityX:state.velocityX/state.range,velocityY:state.velocityY/state.range,boost:false,tension:0};return state.output;}
  return{createState,begin,move,update,release};
});

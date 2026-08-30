(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.SilentBubbleMotion=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  const DEFAULTS=Object.freeze({smoothing:.36,neutralFollow:2.8,deadZone:.0025,gain:9,maxForce:1,mouthOpen:.52,mouthClosed:.32,mouthSmoothing:.38,cooldown:420});

  function createState(config={}){
    return{config:{...DEFAULTS,...config},seen:false,x:0,y:0,neutralX:0,neutralY:0,smoothedX:0,smoothedY:0,velocityX:0,velocityY:0,mouth:0,mouthArmed:true,lastBoost:-Infinity,output:{forceX:0,forceY:0,velocityX:0,velocityY:0,boost:false}};
  }

  // Both touch and face controllers submit a relative 2-D sample here. The slowly
  // following neutral point turns movement into energy without mapping pose to position.
  function update(state,sample,now,dt){
    const c=state.config,safeDt=clamp(dt||.016,.001,.1),x=sample.x,y=sample.y;
    if(!state.seen){state.seen=true;state.x=state.neutralX=state.smoothedX=x;state.y=state.neutralY=state.smoothedY=y;}
    state.smoothedX+=(x-state.smoothedX)*c.smoothing;state.smoothedY+=(y-state.smoothedY)*c.smoothing;
    state.velocityX=(state.smoothedX-state.x)/safeDt;state.velocityY=(state.smoothedY-state.y)/safeDt;
    state.x=state.smoothedX;state.y=state.smoothedY;
    const follow=1-Math.exp(-c.neutralFollow*safeDt);state.neutralX+=(state.x-state.neutralX)*follow;state.neutralY+=(state.y-state.neutralY)*follow;
    const force=value=>Math.abs(value)<c.deadZone?0:clamp(value*c.gain,-c.maxForce,c.maxForce);
    let boost=false;
    if(Number.isFinite(sample.mouth)){
      state.mouth+=(sample.mouth-state.mouth)*c.mouthSmoothing;
      if(state.mouthArmed&&state.mouth>=c.mouthOpen&&now-state.lastBoost>=c.cooldown){boost=true;state.mouthArmed=false;state.lastBoost=now;}
      else if(!state.mouthArmed&&state.mouth<=c.mouthClosed)state.mouthArmed=true;
    }
    state.output={forceX:force(state.x-state.neutralX),forceY:force(state.y-state.neutralY),velocityX:state.velocityX,velocityY:state.velocityY,boost};
    return state.output;
  }
  function release(state){state.seen=false;state.output={forceX:0,forceY:0,velocityX:state.velocityX,velocityY:state.velocityY,boost:false};return state.output;}
  return{DEFAULTS,createState,update,release};
});

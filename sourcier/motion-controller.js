(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.SilentBubbleMotion=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  const DEFAULTS=Object.freeze({smoothing:.3,neutralFollowMin:1.8,neutralFollowMax:3.6,range:70,deadZone:.06,curve:1.65,velocityContribution:.14,velocityLimit:2.2});

  function createState(config={}){
    return{config:{...DEFAULTS,...config},seen:false,x:0,y:0,neutralX:0,neutralY:0,smoothedX:0,smoothedY:0,velocityX:0,velocityY:0,offsetX:0,offsetY:0,output:{forceX:0,forceY:0,velocityX:0,velocityY:0,boost:false}};
  }

  // Both touch and face controllers submit a relative 2-D sample here. The slowly
  // following neutral point turns movement into energy without mapping pose to position.
  function update(state,sample,now,dt){
    const c=state.config,safeDt=clamp(dt||.016,.001,.1),x=sample.x,y=sample.y;
    if(!state.seen){state.seen=true;state.x=state.neutralX=state.smoothedX=x;state.y=state.neutralY=state.smoothedY=y;}
    state.smoothedX+=(x-state.smoothedX)*c.smoothing;state.smoothedY+=(y-state.smoothedY)*c.smoothing;
    state.velocityX=(state.smoothedX-state.x)/safeDt;state.velocityY=(state.smoothedY-state.y)/safeDt;
    state.x=state.smoothedX;state.y=state.smoothedY;
    const dx=state.x-state.neutralX,dy=state.y-state.neutralY,distance=Math.hypot(dx,dy),normalizedDistance=clamp(distance/c.range,0,1);
    const neutralRate=c.neutralFollowMin+(c.neutralFollowMax-c.neutralFollowMin)*normalizedDistance,follow=1-Math.exp(-neutralRate*safeDt);
    state.neutralX+=dx*follow;state.neutralY+=dy*follow;state.offsetX=dx/c.range;state.offsetY=dy/c.range;
    const response=value=>{const sign=Math.sign(value),magnitude=Math.abs(value);if(magnitude<=c.deadZone)return 0;const scaled=clamp((magnitude-c.deadZone)/(1-c.deadZone),0,1);return sign*scaled**c.curve;};
    const velocity=value=>clamp(value/c.range*c.velocityContribution,-c.velocityLimit*c.velocityContribution,c.velocityLimit*c.velocityContribution);
    state.output={forceX:clamp(response(state.offsetX)+velocity(state.velocityX),-1,1),forceY:clamp(response(state.offsetY)+velocity(state.velocityY),-1,1),velocityX:state.velocityX/c.range,velocityY:state.velocityY/c.range,boost:false};
    return state.output;
  }
  function release(state){state.seen=false;state.output={forceX:0,forceY:0,velocityX:state.velocityX,velocityY:state.velocityY,boost:false};return state.output;}
  return{DEFAULTS,createState,update,release};
});

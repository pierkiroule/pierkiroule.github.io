(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.SilentBubblePhysics=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function createState(y=0){return{y,vy:0,scaleX:1,scaleY:1,scaleVelocityX:0,scaleVelocityY:0};}
  function step(state,liftInput,dt,c){
    dt=clamp(dt,.001,.034);const acceleration=c.gravity-c.liftForce*clamp(liftInput,0,1);
    state.vy+=acceleration*dt;state.vy*=Math.exp(-c.airDrag*dt);state.vy=clamp(state.vy,-c.maxUpSpeed,c.maxDownSpeed);state.y+=state.vy*dt;
    const sy=state.scaleY,sv=state.scaleVelocityY+((1-sy)*c.membraneSpring-state.scaleVelocityY*c.membraneDamping)*dt;
    state.scaleVelocityY=sv;state.scaleY+=sv*dt;state.scaleX=1-(state.scaleY-1)*.65;return state;
  }
  function collide(state,side,c){
    if(side<0){state.vy=Math.max(c.wallBounce,Math.abs(state.vy)*.28);state.scaleVelocityY-=c.membraneCollision;}
    else{state.vy=Math.min(-c.wallBounce,-Math.abs(state.vy)*.28);state.scaleVelocityY+=c.membraneCollision;}
  }
  return{createState,step,collide};
});

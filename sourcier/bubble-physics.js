(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.SilentBubblePhysics=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  function createState(){return{vx:0,vy:0,scaleX:1,scaleY:1,scaleVelocityX:0,scaleVelocityY:0};}
  function deform(state,x,y,amount){state.scaleVelocityX-=Math.abs(x)*amount;state.scaleVelocityY-=Math.abs(y)*amount;const side=Math.abs(x)>Math.abs(y)?"x":"y";state[side==="x"?"scaleVelocityY":"scaleVelocityX"]+=amount*.55;}
  function puff(state,strength){const speed=Math.hypot(state.vx,state.vy),nx=speed>8?state.vx/speed:1,ny=speed>8?state.vy/speed:0;state.vx+=nx*strength;state.vy+=ny*strength;deform(state,nx,ny,.045);}
  function collide(state,side,strength){if(side)deform(state,side===0?1:0,side!==0?1:0,strength);}
  function step(state,input,dt,config){
    const safeDt=Math.max(.001,Math.min(.034,dt));
    state.vx+=input.forceX*config.acceleration*safeDt;state.vy+=input.forceY*config.acceleration*safeDt;
    const speed=Math.hypot(state.vx,state.vy),excess=Math.max(0,speed/config.softMaxSpeed-.72),resistance=config.airDrag+excess*excess*config.softResistance+(state.vx<0?config.reverseResistance:0);
    const air=Math.exp(-safeDt*resistance);state.vx*=air;state.vy*=air;
    deform(state,input.forceX,input.forceY,config.membranePush*safeDt);
    const spring=(value,velocity)=>({velocity:velocity+((1-value)*config.membraneSpring-velocity*config.membraneDamping)*safeDt});
    const sx=spring(state.scaleX,state.scaleVelocityX),sy=spring(state.scaleY,state.scaleVelocityY);state.scaleVelocityX=sx.velocity;state.scaleVelocityY=sy.velocity;state.scaleX+=state.scaleVelocityX*safeDt;state.scaleY+=state.scaleVelocityY*safeDt;
    // A tiny volume correction prevents deformation from reading as a rubber blob.
    const volume=Math.sqrt(Math.max(.01,state.scaleX*state.scaleY));state.scaleX=1+(state.scaleX/volume-1)*.72;state.scaleY=1+(state.scaleY/volume-1)*.72;
    return{dx:state.vx*safeDt,dy:state.vy*safeDt};
  }
  return{createState,step,puff,collide};
});

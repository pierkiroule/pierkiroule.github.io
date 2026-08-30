(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.SilentBubblePuck=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const DEFAULTS=Object.freeze({
    puckRadius:10,
    follow:34,
    maxPuckSpeed:1050,
    pushTransfer:.14,
    tangentTransfer:.025,
    bubbleDrag:1.15,
    bubbleMaxSpeed:320,
    boundaryMargin:26,
    boundaryStrength:520
  });
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

  function createState(config={}){
    return{config:{...DEFAULTS,...config},active:false,x:0,y:0,targetX:0,targetY:0,vx:0,vy:0,contact:0,nx:0,ny:0,pressure:0};
  }

  function begin(state,x,y){
    state.active=true;state.x=state.targetX=x;state.y=state.targetY=y;
    state.vx=state.vy=state.contact=state.pressure=0;
    return state;
  }

  function move(state,x,y){state.targetX=x;state.targetY=y;return state;}

  function end(state){
    state.active=false;state.vx=state.vy=state.pressure=0;
    return state;
  }

  function update(state,bubble,dt,bounds){
    const config=state.config,safeDt=Math.max(.001,Math.min(dt,.034));
    state.contact=Math.max(0,state.contact-safeDt*8);
    if(state.active){
      const follow=1-Math.exp(-config.follow*safeDt);
      let vx=(state.targetX-state.x)*follow/safeDt,vy=(state.targetY-state.y)*follow/safeDt;
      const puckSpeed=Math.hypot(vx,vy);
      if(puckSpeed>config.maxPuckSpeed){vx=vx/puckSpeed*config.maxPuckSpeed;vy=vy/puckSpeed*config.maxPuckSpeed;}
      state.vx=vx;state.vy=vy;state.x+=vx*safeDt;state.y+=vy*safeDt;

      let dx=bubble.x-state.x,dy=bubble.y-state.y,distance=Math.hypot(dx,dy);
      const minimum=bubble.r+config.puckRadius;
      if(distance<minimum){
        if(distance<.001){dx=1;dy=0;distance=1;}
        const nx=dx/distance,ny=dy/distance;
        const inward=Math.max(0,vx*nx+vy*ny);
        const tx=-ny,ty=nx,tangent=vx*tx+vy*ty;
        const penetration=minimum-distance;
        // Le palet reste hors de la membrane : c'est lui qui ripe autour, jamais la bulle qui colle au doigt.
        state.x-=nx*penetration;state.y-=ny*penetration;
        if(inward>0){
          bubble.vx+=(nx*inward*config.pushTransfer+tx*tangent*config.tangentTransfer);
          bubble.vy+=(ny*inward*config.pushTransfer+ty*tangent*config.tangentTransfer);
        }
        state.nx=nx;state.ny=ny;state.pressure=clamp(inward/520,0,1);state.contact=1;
      }else state.pressure=0;
    }else state.pressure=0;

    const margin=Math.max(config.boundaryMargin,bubble.r+6);
    if(bubble.x<margin)bubble.vx+=(margin-bubble.x)*config.boundaryStrength*safeDt/margin;
    if(bubble.x>bounds.width-margin)bubble.vx-=(bubble.x-(bounds.width-margin))*config.boundaryStrength*safeDt/margin;
    if(bubble.y<margin)bubble.vy+=(margin-bubble.y)*config.boundaryStrength*safeDt/margin;
    if(bubble.y>bounds.height-margin)bubble.vy-=(bubble.y-(bounds.height-margin))*config.boundaryStrength*safeDt/margin;
    const damping=Math.exp(-config.bubbleDrag*safeDt);bubble.vx*=damping;bubble.vy*=damping;
    const speed=Math.hypot(bubble.vx,bubble.vy);
    if(speed>config.bubbleMaxSpeed){bubble.vx=bubble.vx/speed*config.bubbleMaxSpeed;bubble.vy=bubble.vy/speed*config.bubbleMaxSpeed;}
    bubble.x=clamp(bubble.x+bubble.vx*safeDt,-bubble.r*.3,bounds.width+bubble.r*.3);
    bubble.y=clamp(bubble.y+bubble.vy*safeDt,-bubble.r*.3,bounds.height+bubble.r*.3);
    return bubble;
  }
  return{DEFAULTS,createState,begin,move,end,update};
});

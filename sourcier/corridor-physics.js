(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.SilentBubbleCorridor=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

  function cameraStep(forward,x,width,distance,followZone={near:.42,far:.68}){
    if(forward<=0)return{scroll:0,progress:0};
    const near=width*followZone.near,far=width*followZone.far;
    const t=clamp((x-near)/(far-near),0,1);
    const follow=t*t*(3-2*t);
    const scroll=forward*follow;
    return{scroll,progress:scroll/distance};
  }

  function reflect(bubble,nx,ny,restitution){
    const incoming=bubble.vx*nx+bubble.vy*ny;
    if(incoming>=0)return 0;
    const impulse=-(1+restitution)*incoming;
    bubble.vx+=impulse*nx;bubble.vy+=impulse*ny;
    return-Math.min(0,incoming);
  }

  function constrain(bubble,walls,restitution=.62){
    const top=walls.top+bubble.r,bottom=walls.bottom-bubble.r;
    if(bubble.y<top){
      bubble.y=top;const length=Math.hypot(walls.topSlope,1),impact=reflect(bubble,-walls.topSlope/length,1/length,restitution);
      return{side:-1,impact};
    }
    if(bubble.y>bottom){
      bubble.y=bottom;const length=Math.hypot(walls.bottomSlope,1),impact=reflect(bubble,walls.bottomSlope/length,-1/length,restitution);
      return{side:1,impact};
    }
    return{side:0,impact:0};
  }

  function echoY(center,half,radius,phase){
    const travel=Math.max(0,half-radius-5);
    return center+Math.sin(phase)*travel;
  }

  return{cameraStep,constrain,echoY};
});

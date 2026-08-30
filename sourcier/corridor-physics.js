(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.SilentBubbleCorridor=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

  function advance(bubble,progress,distance){
    const forward=Math.max(0,bubble.vx);
    return clamp(progress+forward/distance,0,1);
  }

  function constrain(bubble,center,half,restitution=.68){
    const top=center-half+bubble.r,bottom=center+half-bubble.r;
    if(bubble.y<top){bubble.y=top;bubble.vy=Math.abs(bubble.vy)*restitution;return-1;}
    if(bubble.y>bottom){bubble.y=bottom;bubble.vy=-Math.abs(bubble.vy)*restitution;return 1;}
    return 0;
  }

  function echoY(center,half,radius,phase){
    const travel=Math.max(0,half-radius-5);
    return center+Math.sin(phase)*travel;
  }

  return{advance,constrain,echoY};
});

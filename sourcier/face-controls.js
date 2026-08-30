(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.SilentBubbleFace=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  function createState(){return{seen:false,x:0,y:0,eyeDistance:0};}
  function observation(state,result){
    const marks=result?.faceLandmarks?.[0],left=marks?.[33],right=marks?.[263];
    if(!left||!right)return null;
    const x=(left.x+right.x)/2,y=(left.y+right.y)/2,eyeDistance=Math.hypot(right.x-left.x,right.y-left.y);
    if(!state.seen){state.seen=true;state.x=x;state.y=y;state.eyeDistance=eyeDistance;}
    state.x+=(x-state.x)*.15;state.y+=(y-state.y)*.15;state.eyeDistance+=(eyeDistance-state.eyeDistance)*.15;
    return{eyeCenter:{x:state.x,y:state.y},eyeDistance:state.eyeDistance,faceOrigin:{x:state.x,y:state.y}};
  }
  return{createState,observation};
});

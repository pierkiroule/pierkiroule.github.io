(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.SilentBubbleTouch=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  function createState(){return{pointerId:null,x:0,y:0,startX:0,startY:0,startedAt:0,maxMovement:0};}
  function begin(state,id,x,y,now){Object.assign(state,{pointerId:id,x,y,startX:x,startY:y,startedAt:now,maxMovement:0});return{x,y};}
  function move(state,x,y){state.x=x;state.y=y;state.maxMovement=Math.max(state.maxMovement,Math.hypot(x-state.startX,y-state.startY));return{x,y};}
  function end(state,now,{tapDuration=220,tapMovement=14}={}){const boost=state.pointerId!==null&&now-state.startedAt<tapDuration&&state.maxMovement<tapMovement;state.pointerId=null;return boost;}
  return{createState,begin,move,end};
});

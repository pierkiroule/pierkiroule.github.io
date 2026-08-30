(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.SilentBubbleFace=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  function observation(result){
    const marks=result?.faceLandmarks?.[0];
    if(!marks?.[1]||!marks[33]||!marks[263])return null;
    const eyeDistance=Math.max(.001,Math.hypot(marks[263].x-marks[33].x,marks[263].y-marks[33].y));
    const eyeX=(marks[33].x+marks[263].x)/2,eyeY=(marks[33].y+marks[263].y)/2;
    const categories=result.faceBlendshapes?.[0]?.categories||[];
    const mouth=categories.find(item=>item.categoryName==="jawOpen")?.score||0;
    // Mirrored horizontal axis feels like a mirror; scale makes samples independent of camera distance.
    return{x:-(marks[1].x-eyeX)/eyeDistance,y:(marks[1].y-eyeY)/eyeDistance,mouth};
  }
  return{observation};
});

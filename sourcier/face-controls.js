(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.SilentBubbleFace=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  function observation(result){
    const categories=result?.faceBlendshapes?.[0]?.categories||[];
    const mouth=categories.find(item=>item.categoryName==="jawOpen")?.score;
    return Number.isFinite(mouth)?{mouth}:null;
  }
  return{observation};
});

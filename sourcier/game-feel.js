(function(root,factory){const value=factory();if(typeof module==="object"&&module.exports)module.exports=value;else root.SilentBubbleGameFeel=value;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  return Object.freeze({
    inputSmoothing:.18,neutralFollowMin:.08,neutralFollowMax:.22,deadZone:.035,forceCurve:1.28,gestureVelocityContribution:.08,
    touchRange:96,headRange:.12,headSmoothing:.24,
    acceleration:210,airDrag:.58,softMaxSpeed:255,softResistance:2.35,reverseResistance:3.6,puffStrength:24,
    bounceRestitution:.34,membraneSpring:44,membraneDamping:8.5,membranePush:.035,membraneCollision:.11
  });
});

(function(root,factory){const value=factory();if(typeof module==="object"&&module.exports)module.exports=value;else root.SilentBubbleGameFeel=value;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  return Object.freeze({
    inputSmoothing:.3,neutralFollowMin:1.8,neutralFollowMax:3.6,deadZone:.06,forceCurve:1.65,gestureVelocityContribution:.14,
    touchRange:70,headRange:.12,headSmoothing:.24,
    acceleration:235,airDrag:.72,softMaxSpeed:235,softResistance:2.8,reverseResistance:4.5,puffStrength:27,
    bounceRestitution:.34,membraneSpring:44,membraneDamping:8.5,membranePush:.035,membraneCollision:.11
  });
});

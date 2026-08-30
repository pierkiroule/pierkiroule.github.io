(function(root,factory){const value=factory();if(typeof module==="object"&&module.exports)module.exports=value;else root.SilentBubbleGameFeel=value;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  return Object.freeze({
    worldSpeed:54,gravity:31,liftForce:65,liftAttack:2.25,liftRelease:3.1,airDrag:1.15,maxUpSpeed:72,maxDownSpeed:62,wallBounce:24,
    mouthOpenThreshold:.075,mouthCloseThreshold:.052,mouthSmoothing:9,faceConfidenceThreshold:.5,
    voiceFloor:.012,voiceCeiling:.105,voiceGain:2.15,voiceSmoothing:10,minVoiceLift:.22,membraneResponse:.045,
    greenSpawnRate:240,redSpawnRate:390,objectSafetyMargin:20,noiseDuration:3,impactCooldown:.55,
    corridorMinHalf:125,corridorMaxHalf:210,membraneSpring:42,membraneDamping:9,membraneCollision:.1
  });
});

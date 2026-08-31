const test=require("node:test");
const assert=require("node:assert/strict");
const corridor=require("./corridor-physics.js");

test("la caméra peut garder la bulle centrée en mode portrait",()=>{
  const step=corridor.cameraStep(4,180,360,3900,{near:.32,far:.5});
  assert.equal(step.scroll,4);
  assert.equal(step.progress,4/3900);
});

test("la caméra reste fixe dans la zone morte puis suit progressivement",()=>{
  assert.deepEqual(corridor.cameraStep(10,300,1000,6000),{scroll:0,progress:0});
  const middle=corridor.cameraStep(10,550,1000,6000);
  assert.ok(middle.scroll>0&&middle.scroll<10);
  assert.deepEqual(corridor.cameraStep(-10,800,1000,6000),{scroll:0,progress:0});
});

test("les parois sont infranchissables et font rebondir la bulle",()=>{
  const bubble={x:100,y:20,vx:0,vy:-100,r:10};
  const hit=corridor.constrain(bubble,{top:40,bottom:160,topSlope:0,bottomSlope:0});
  assert.equal(hit.side,-1);
  assert.equal(bubble.y,50);
  assert.equal(bubble.vy,62);
  assert.equal(hit.impact,100);
});

test("un écho oscille sans sortir du couloir",()=>{
  assert.equal(corridor.echoY(100,50,6,Math.PI/2),139);
  assert.equal(corridor.echoY(100,50,6,-Math.PI/2),61);
});

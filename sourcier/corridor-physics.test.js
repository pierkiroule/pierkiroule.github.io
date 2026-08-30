const test=require("node:test");
const assert=require("node:assert/strict");
const corridor=require("./corridor-physics.js");

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

test("l'impulsion de drag glisse puis s'arrête après deux secondes",()=>{
  const bubble={vx:100,vy:20};let remaining=2,distance=0;
  for(let i=0;i<4;i++){const step=corridor.glideStep(bubble,remaining,.5);remaining=step.remaining;distance+=step.dx;}
  assert.equal(remaining,0);assert.equal(bubble.vx,0);assert.equal(bubble.vy,0);assert.ok(distance>100);
  assert.deepEqual(corridor.glideStep(bubble,remaining,.5),{dx:0,dy:0,remaining:0});
});

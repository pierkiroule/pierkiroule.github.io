const test=require("node:test");
const assert=require("node:assert/strict");
const corridor=require("./corridor-physics.js");

test("seule une poussée vers l'avant fait défiler le parcours",()=>{
  assert.equal(corridor.advance({vx:120},.2,6000),.22);
  assert.equal(corridor.advance({vx:-120},.2,6000),.2);
});

test("les parois sont infranchissables et font rebondir la bulle",()=>{
  const bubble={y:20,vy:-100,r:10};
  assert.equal(corridor.constrain(bubble,100,60),-1);
  assert.equal(bubble.y,50);
  assert.equal(bubble.vy,68);
});

test("un écho oscille sans sortir du couloir",()=>{
  assert.equal(corridor.echoY(100,50,6,Math.PI/2),139);
  assert.equal(corridor.echoY(100,50,6,-Math.PI/2),61);
});

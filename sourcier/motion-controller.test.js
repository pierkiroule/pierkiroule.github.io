const test=require("node:test");
const assert=require("node:assert/strict");
const motion=require("./motion-controller.js");

test("un mouvement produit une force puis le neutre flottant la ramène vers zéro",()=>{
  const state=motion.createState({smoothing:1,neutralFollow:8,deadZone:0,gain:5});
  motion.update(state,{x:0,y:0},0,.016);
  const first=motion.update(state,{x:.1,y:-.1},16,.016);
  assert.ok(first.forceX>0&&first.forceY<0);
  let output=first;for(let i=0;i<100;i++)output=motion.update(state,{x:.1,y:-.1},32+i*16,.016);
  assert.ok(Math.abs(output.forceX)<.001&&Math.abs(output.forceY)<.001);
});

test("la bouche déclenche une fois, attend la fermeture et respecte le cooldown",()=>{
  const state=motion.createState({smoothing:1,mouthSmoothing:1,cooldown:100});
  motion.update(state,{x:0,y:0,mouth:0},0,.016);
  assert.equal(motion.update(state,{x:0,y:0,mouth:.8},100,.016).boost,true);
  assert.equal(motion.update(state,{x:0,y:0,mouth:.9},200,.016).boost,false);
  motion.update(state,{x:0,y:0,mouth:.1},220,.016);
  assert.equal(motion.update(state,{x:0,y:0,mouth:.8},240,.016).boost,true);
});

test("la sortie normalisée reste bornée et expose force, vitesse et boost",()=>{
  const state=motion.createState({smoothing:1,gain:100});motion.update(state,{x:0,y:0},0,.016);
  const output=motion.update(state,{x:2,y:-2},16,.016);
  assert.deepEqual(Object.keys(output),["forceX","forceY","velocityX","velocityY","boost"]);
  assert.equal(output.forceX,1);assert.equal(output.forceY,-1);
});

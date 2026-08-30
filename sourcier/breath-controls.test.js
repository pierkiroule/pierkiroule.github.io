const test=require("node:test");
const assert=require("node:assert/strict");
const breath=require("./breath-controls.js");

test("calibre le bruit ambiant sans produire de portance",()=>{
  const state=breath.createState();
  for(let i=0;i<60;i++)assert.equal(breath.update(state,.012,true),0);
  assert.ok(Math.abs(state.noiseFloor-.012)<.001);
});

test("produit une portance analogique lissée et bornée",()=>{
  const state=breath.createState();
  for(let i=0;i<60;i++)breath.update(state,.01,true);
  const small=breath.update(state,.025),normal=Array.from({length:20},()=>breath.update(state,.06)).at(-1);
  assert.ok(small>0&&small<normal);assert.ok(normal<=1);
  assert.ok(breath.update(state,1)<=1);
});

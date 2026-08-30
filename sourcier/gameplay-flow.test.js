const test=require("node:test");
const assert=require("node:assert/strict");
const flow=require("./gameplay-flow.js");

test("le calme construit une série et une jauge bornée",()=>{
  let state=flow.createState();
  for(let i=0;i<100;i++)state=flow.update(state,.3,.1);
  assert.equal(state.energy,1);
  assert.ok(state.streak>9.9);
  assert.equal(flow.label(state),"BEL ÉQUILIBRE");
});

test("une courte sortie bénéficie d'une grâce mais le vacarme brise la série",()=>{
  let state=flow.update(flow.createState(),.2,1);
  state=flow.update(state,1.4,.1);
  assert.equal(state.zone,"silence");
  state=flow.update(state,1.4,.3);
  assert.equal(state.zone,"noise");
  assert.equal(state.streak,0);
});

test("repère le prochain écho non collecté",()=>{
  assert.equal(flow.nextEcho([.1,.4,.8],[true,false,false],.2),.4);
  assert.equal(flow.nextEcho([.1,.4],[true,true],.9),1);
});

test("convertit les douze échos en récompense d'écoute",()=>{
  assert.equal(flow.rewardDuration(1),10);
  assert.equal(flow.rewardDuration(10),100);
  assert.equal(flow.rewardDuration(12),120);
});

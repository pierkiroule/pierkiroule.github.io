const test=require("node:test");
const assert=require("node:assert/strict");
const puck=require("./puck-control.js");

test("le palet ne déplace jamais directement la bulle hors contact",()=>{
  const state=puck.createState(),bubble={x:200,y:200,vx:0,vy:0,r:20};
  puck.begin(state,20,20);puck.move(state,80,20);puck.update(state,bubble,.016,{width:400,height:400});
  assert.deepEqual([bubble.x,bubble.y,bubble.vx,bubble.vy],[200,200,0,0]);
});

test("une approche normale pousse la bulle loin du palet",()=>{
  const state=puck.createState({follow:100}),bubble={x:100,y:100,vx:0,vy:0,r:20};
  puck.begin(state,60,100);puck.move(state,95,100);puck.update(state,bubble,.016,{width:300,height:300});
  assert.equal(state.contact,1);assert.ok(bubble.vx>0);assert.ok(Math.abs(bubble.vy)<1e-9);
  assert.ok(state.x<=70.01,"le palet reste sur la circonférence");
});

test("un geste presque tangent ripe sans donner une poussée importante",()=>{
  const state=puck.createState({follow:100}),bubble={x:100,y:100,vx:0,vy:0,r:20};
  puck.begin(state,70.2,100);puck.move(state,70.2,103);puck.update(state,bubble,.016,{width:300,height:300});
  assert.ok(state.contact>.9);assert.ok(Math.hypot(bubble.vx,bubble.vy)<4);
});

test("une poussée décentrée transmet naturellement une dérive latérale",()=>{
  const state=puck.createState({follow:100}),bubble={x:100,y:100,vx:0,vy:0,r:20};
  puck.begin(state,65,86);puck.move(state,94,98);puck.update(state,bubble,.016,{width:300,height:300});
  assert.equal(state.contact,1);assert.ok(bubble.vx>0);assert.ok(bubble.vy>0);
  assert.ok(bubble.vx>bubble.vy,"la poussée reste principalement orientée vers la bulle");
});

test("la bulle conserve une inertie douce puis ralentit",()=>{
  const state=puck.createState(),bubble={x:100,y:100,vx:100,vy:0,r:20};
  puck.update(state,bubble,.1,{width:400,height:400});const first=bubble.vx;
  puck.update(state,bubble,.1,{width:400,height:400});
  assert.ok(first<100&&first>0);assert.ok(bubble.vx<first&&bubble.x>100);
});

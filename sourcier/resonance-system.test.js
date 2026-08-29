const test=require("node:test");
const assert=require("node:assert/strict");
const resonance=require("./resonance-system.js");

test("une onde n'agit qu'au passage de son front et pousse loin de sa source",()=>{
  const system=resonance.createSystem({waveSpeed:100,waveLifetime:2,waveMaxRadius:200,bubbleDrag:0,boundaryStrength:0});
  const bubble={x:100,y:50,vx:0,vy:0,r:10};
  resonance.emit(system,0,50,0,0,{force:true,strength:120});
  resonance.update(system,bubble,.5,{width:500,height:500});
  assert.equal(bubble.vx,0);
  resonance.update(system,bubble,.4,{width:500,height:500});
  assert.ok(bubble.vx>0);assert.equal(bubble.vy,0);assert.equal(system.waves[0].hit,true);
  const velocity=bubble.vx;resonance.update(system,bubble,.1,{width:500,height:500});assert.equal(bubble.vx,velocity);
});

test("limite la fréquence des ondes continues mais autorise un tap",()=>{
  const system=resonance.createSystem({gestureWaveInterval:.125});
  assert.ok(resonance.emit(system,10,10,0,0));
  assert.equal(resonance.emit(system,12,10,100,.05),null);
  assert.ok(resonance.emit(system,14,10,100,.13));
  assert.ok(resonance.emit(system,16,10,0,.14,{force:true}));
});

test("les limites appliquent un rappel progressif, sans mur brutal",()=>{
  const config={...resonance.RESONANCE_CONFIG,boundaryMargin:.2,boundaryStrength:800};
  assert.ok(resonance.boundaryAcceleration(50,500,config)>0);
  assert.ok(resonance.boundaryAcceleration(20,500,config)>resonance.boundaryAcceleration(50,500,config));
  assert.ok(resonance.boundaryAcceleration(20,500,config)>700);
  assert.ok(resonance.boundaryAcceleration(480,500,config)<-700);
  assert.equal(resonance.boundaryAcceleration(250,500,config),0);
});

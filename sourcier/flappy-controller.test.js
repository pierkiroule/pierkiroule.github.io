const test=require("node:test");const assert=require("node:assert/strict");const flappy=require("./flappy-controller.js");
test("la bulle avance en permanence à une vitesse adaptée aux enfants",()=>{const state=flappy.createState(),dt=.016,travel=flappy.step(state,false,dt);assert.equal(travel.dx,56*dt)});
test("un appui fait monter et gonfler la bulle",()=>{const state=flappy.createState();for(let i=0;i<30;i++)flappy.step(state,true,.016);assert.ok(state.vy<0);assert.ok(state.scale>.8)});
test("le relâchement fait descendre et réduit la bulle à un tiers",()=>{const state=flappy.createState();for(let i=0;i<120;i++)flappy.step(state,false,.016);assert.ok(state.vy>0);assert.ok(Math.abs(state.scale-1/3)<.001)});

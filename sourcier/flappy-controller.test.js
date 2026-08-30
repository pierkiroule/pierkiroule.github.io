const test=require("node:test");const assert=require("node:assert/strict");const flappy=require("./flappy-controller.js");
test("la bulle avance en permanence",()=>{const state=flappy.createState();assert.ok(flappy.step(state,false,.016).dx>0)});
test("un appui fait monter et gonfler la bulle",()=>{const state=flappy.createState();for(let i=0;i<30;i++)flappy.step(state,true,.016);assert.ok(state.vy<0);assert.ok(state.scale>.8)});
test("le relâchement fait descendre et réduit la bulle à un tiers",()=>{const state=flappy.createState();for(let i=0;i<120;i++)flappy.step(state,false,.016);assert.ok(state.vy>0);assert.ok(Math.abs(state.scale-1/3)<.001)});

const test=require("node:test");const assert=require("node:assert/strict");const touch=require("./touch-controller.js");
test("toute position devient le neutre initial",()=>{const s=touch.createState();assert.deepEqual(touch.begin(s,4,312,487,0),{x:312,y:487});});
test("un tap court déclenche POUF, pas un glissement",()=>{const s=touch.createState();touch.begin(s,1,10,10,0);touch.move(s,15,10);assert.equal(touch.end(s,180),true);touch.begin(s,2,10,10,200);touch.move(s,40,10);assert.equal(touch.end(s,300),false);});

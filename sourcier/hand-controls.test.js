const test=require("node:test");
const assert=require("node:assert/strict");
const hand=require("./hand-controls.js");

test("confirme une main après 100 ms",()=>{const state=hand.createState();assert.equal(hand.update(state,true,0),false);assert.equal(hand.update(state,true,99),false);assert.equal(hand.update(state,true,100),true)});
test("ignore les pertes brèves puis retire la portance après 200 ms",()=>{const state=hand.createState();hand.update(state,true,0);hand.update(state,true,100);assert.equal(hand.update(state,false,110),true);assert.equal(hand.update(state,true,150),true);assert.equal(hand.update(state,false,200),true);assert.equal(hand.update(state,false,400),false)});

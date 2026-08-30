const test=require("node:test");
const assert=require("node:assert/strict");
const face=require("./face-controls.js");

test("calcule le centre lissé et la distance entre les yeux",()=>{
  const state=face.createState(),marks=[];marks[33]={x:.3,y:.4};marks[263]={x:.7,y:.4};
  const sample=face.observation(state,{faceLandmarks:[marks]});
  assert.deepEqual(sample.eyeCenter,{x:.5,y:.4});assert.ok(Math.abs(sample.eyeDistance-.4)<1e-9);
  marks[33]={x:.4,y:.5};marks[263]={x:.8,y:.5};
  assert.ok(Math.abs(face.observation(state,{faceLandmarks:[marks]}).eyeCenter.x-.515)<1e-9);
});

test("ignore une détection faciale incomplète",()=>assert.equal(face.observation(face.createState(),{faceLandmarks:[[]]}),null));

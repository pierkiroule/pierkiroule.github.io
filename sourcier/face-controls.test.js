const test=require("node:test");
const assert=require("node:assert/strict");
const face=require("./face-controls.js");

test("extrait seulement le mouvement relatif du nez et l'ouverture de bouche",()=>{
  const marks=[];marks[33]={x:.3,y:.4};marks[263]={x:.7,y:.4};marks[1]={x:.45,y:.55};
  const sample=face.observation({faceLandmarks:[marks],faceBlendshapes:[{categories:[{categoryName:"jawOpen",score:.72}]}]});
  assert.ok(Math.abs(sample.x-.125)<1e-9);assert.ok(Math.abs(sample.y-.375)<1e-9);assert.equal(sample.mouth,.72);
});

test("ignore une détection faciale incomplète",()=>assert.equal(face.observation({faceLandmarks:[[]]}),null));

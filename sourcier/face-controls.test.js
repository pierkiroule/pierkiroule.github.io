const test=require("node:test");
const assert=require("node:assert/strict");
const face=require("./face-controls.js");

test("extrait uniquement l'ouverture de bouche",()=>{
  const sample=face.observation({faceBlendshapes:[{categories:[{categoryName:"jawOpen",score:.72}]}]});
  assert.deepEqual(sample,{mouth:.72});
});

test("ignore une détection faciale incomplète",()=>assert.equal(face.observation({faceBlendshapes:[]}),null));

const test=require("node:test"),assert=require("node:assert/strict"),elastic=require("./elastic-controller.js");

test("une petite traction reste précise et une grande traction accélère davantage",()=>{
  const short=elastic.createState(),long=elastic.createState();elastic.begin(short,0,0);elastic.begin(long,0,0);elastic.move(short,24,0);elastic.move(long,96,0);
  for(let i=0;i<30;i++){elastic.update(short,1/60);elastic.update(long,1/60)}
  assert.ok(short.output.forceX>0&&short.output.forceX<.3);assert.ok(long.output.forceX>.9);assert.ok(long.output.forceX>short.output.forceX*3);
});
test("la corde rejoint sa cible sans instabilité et lâcher annule la traction",()=>{
  const state=elastic.createState();elastic.begin(state,10,10);elastic.move(state,110,-50);for(let i=0;i<300;i++)elastic.update(state,1/60);
  assert.ok(Number.isFinite(state.output.forceX));assert.ok(state.output.forceX<=1&&state.output.forceY>=-1);assert.equal(elastic.release(state).forceX,0);
});

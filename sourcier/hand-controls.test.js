const test = require("node:test");
const assert = require("node:assert/strict");
const hand = require("./hand-controls.js");

function landmarks(x, y) {
  return Array.from({ length: 21 }, () => ({ x, y }));
}

test("calcule le centre de la paume et refuse des repères incomplets", () => {
  const marks = landmarks(.2, .3);
  marks[9] = { x: .7, y: .8 };
  assert.deepEqual(hand.palmCenter(marks), { x: .3, y: .4 });
  assert.equal(hand.palmCenter(marks.slice(0, 9)), null);
});

test("mesure le déplacement de la main sans impulsion après une perte de tracking", () => {
  let state = hand.createState(.62);
  state = hand.updateState(state, { x: .4, y: .2 }, 1);
  assert.deepEqual([state.dx, state.dy], [0, 0]);
  state = hand.updateState(state, { x: .4, y: .3 }, 1);
  assert.ok(Math.abs(state.dx) < 1e-9);
  assert.ok(Math.abs(state.dy - .1) < 1e-9);
  state = hand.updateState(state, null);
  state = hand.updateState(state, { x: .6, y: .8 }, 1);
  assert.deepEqual([state.dx, state.dy], [0, 0]);
});

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

test("reconnaît un index tendu avec les autres doigts repliés", () => {
  const marks = landmarks(0, 0);
  marks[5] = { x: .1, y: .1 };
  marks[6] = { x: .2, y: .2 };
  marks[8] = { x: .4, y: .4 };
  [[10, 12], [14, 16], [18, 20]].forEach(([pip, tip]) => {
    marks[pip] = { x: .4, y: .4 };
    marks[tip] = { x: .25, y: .25 };
  });
  assert.equal(hand.isIndexPointing(marks), true);
  marks[8] = { x: .15, y: .15 };
  assert.equal(hand.isIndexPointing(marks), false);
  assert.equal(hand.isIndexPointing(marks.slice(0, 8)), false);
});

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

test("ré-ancre la main sans faire sauter la corde après une perte de tracking", () => {
  let state = hand.createState(.62);
  state = hand.updateState(state, { x: .4, y: .2 }, 1);
  assert.equal(hand.target(state), .62);
  state = hand.updateState(state, { x: .4, y: .3 }, 1);
  assert.equal(hand.target(state), .745);
  state = hand.updateState(state, null);
  state = { ...state, guideY: .7 };
  state = hand.updateState(state, { x: .6, y: .8 }, 1);
  assert.equal(hand.target(state), .7);
});

test("borne la traction aux limites jouables", () => {
  assert.equal(hand.target({ originY: .5, rawY: 1, anchorY: 0 }, 2), .96);
  assert.equal(hand.target({ originY: .5, rawY: 0, anchorY: 1 }, 2), .04);
});

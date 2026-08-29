(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.SilentBubbleHand = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const PALM_POINTS = [0, 5, 9, 13, 17];

  function palmCenter(landmarks) {
    if (!Array.isArray(landmarks) || PALM_POINTS.some(index => !landmarks[index])) return null;
    const center = PALM_POINTS.reduce((sum, index) => ({
      x: sum.x + landmarks[index].x,
      y: sum.y + landmarks[index].y
    }), { x: 0, y: 0 });
    return { x: center.x / PALM_POINTS.length, y: center.y / PALM_POINTS.length };
  }

  function createState(guideY) {
    return { seen: false, rawX: .5, rawY: .5, dx: 0, dy: 0, guideY };
  }

  function updateState(previous, center, smoothing) {
    if (!center) return { ...previous, seen: false };
    const amount = clamp(smoothing == null ? .35 : smoothing, 0, 1);
    const rawX = previous.rawX + (center.x - previous.rawX) * amount;
    const rawY = previous.rawY + (center.y - previous.rawY) * amount;
    const reacquired = !previous.seen;
    return {
      ...previous,
      seen: true,
      rawX,
      rawY,
      dx: reacquired ? 0 : rawX - previous.rawX,
      dy: reacquired ? 0 : rawY - previous.rawY
    };
  }

  return { palmCenter, createState, updateState };
});

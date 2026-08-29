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

  function jointAngle(a, b, c) {
    if (!a || !b || !c) return 0;
    const ab={x:a.x-b.x,y:a.y-b.y},cb={x:c.x-b.x,y:c.y-b.y};
    const denominator=Math.hypot(ab.x,ab.y)*Math.hypot(cb.x,cb.y);
    if (!denominator) return 0;
    return Math.acos(clamp((ab.x*cb.x+ab.y*cb.y)/denominator,-1,1));
  }

  function isIndexPointing(landmarks) {
    if (!Array.isArray(landmarks) || landmarks.length<21) return false;
    const wrist=landmarks[0],distance=index=>Math.hypot(landmarks[index].x-wrist.x,landmarks[index].y-wrist.y);
    const indexStraight=jointAngle(landmarks[5],landmarks[6],landmarks[8])>2.55&&distance(8)>distance(6)*1.12;
    const folded=[[10,12],[14,16],[18,20]].filter(([pip,tip])=>distance(tip)<distance(pip)*1.08).length;
    return indexStraight&&folded>=2;
  }

  function createState() {
    return { seen: false, rawX: .5, rawY: .5, dx: 0, dy: 0, speed: 0, updatedAt: 0 };
  }

  function updateState(previous, center, smoothing, now) {
    if (!center) return { ...previous, seen: false, dx: 0, dy: 0, speed: 0 };
    const amount = clamp(smoothing == null ? .35 : smoothing, 0, 1);
    const rawX = previous.rawX + (center.x - previous.rawX) * amount;
    const rawY = previous.rawY + (center.y - previous.rawY) * amount;
    const reacquired = !previous.seen;
    const dx = reacquired ? 0 : rawX - previous.rawX;
    const dy = reacquired ? 0 : rawY - previous.rawY;
    const elapsed = Math.max(.001, ((now == null ? previous.updatedAt + 16 : now) - previous.updatedAt) / 1000);
    const measuredSpeed = Math.hypot(dx, dy) / elapsed;
    return {
      ...previous,
      seen: true,
      rawX,
      rawY,
      dx,
      dy,
      speed: reacquired ? 0 : previous.speed + (measuredSpeed - previous.speed) * .22,
      updatedAt: now == null ? previous.updatedAt + 16 : now
    };
  }

  return { palmCenter, isIndexPointing, createState, updateState };
});

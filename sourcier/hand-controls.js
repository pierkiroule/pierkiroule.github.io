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

  function pinchAmount(landmarks) {
    if (!Array.isArray(landmarks) || landmarks.length<21) return 0;
    const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
    const handSize=distance(landmarks[0],landmarks[9]);
    if (handSize<.001) return 0;
    const normalized=distance(landmarks[4],landmarks[8])/handSize;
    return 1-clamp((normalized-.18)/.62,0,1);
  }

  function updatePinch(previous, landmarks, options={}) {
    const smoothing=options.smoothing == null ? .42 : clamp(options.smoothing,0,1);
    const amount=previous.pinch+(pinchAmount(landmarks)-previous.pinch)*smoothing;
    const on=options.onThreshold == null ? .8 : options.onThreshold;
    const off=options.offThreshold == null ? .5 : options.offThreshold;
    let armed=previous.pinchArmed,pinched=previous.pinched,triggered=false;
    if(armed&&amount>=on){armed=false;pinched=true;triggered=true;}
    else if(!armed&&amount<=off){armed=true;pinched=false;}
    return {...previous,pinch:amount,pinchArmed:armed,pinched,triggered};
  }

  function createState() {
    return { seen: false, rawX: .5, rawY: .5, dx: 0, dy: 0, speed: 0, updatedAt: 0, pinch: 0, pinchArmed: true, pinched: false, triggered: false };
  }

  function updateState(previous, center, smoothing, now) {
    if (!center) return { ...previous, seen: false, dx: 0, dy: 0, speed: 0, triggered: false };
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

  return { palmCenter, pinchAmount, updatePinch, createState, updateState };
});

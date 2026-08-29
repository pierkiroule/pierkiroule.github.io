(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.SilentBubbleResonance = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const RESONANCE_CONFIG = Object.freeze({
    waveSpeed: 310,
    waveLifetime: 1.15,
    waveMaxRadius: 350,
    minImpulse: 115,
    maxImpulse: 245,
    bubbleMass: 1.15,
    bubbleDrag: 1.75,
    bubbleMaxSpeed: 390,
    gestureWaveInterval: .125,
    handDeadZone: .035,
    handSmoothing: .3,
    velocitySmoothing: .22,
    boundaryMargin: .16,
    boundaryStrength: 760
  });
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const smoothstep = (edge0, edge1, value) => { const t = clamp((value-edge0)/(edge1-edge0),0,1); return t*t*(3-2*t); };

  function createSystem(config) {
    return { config: { ...RESONANCE_CONFIG, ...config }, waves: [], lastWaveAt: -Infinity, lastImpulse: 0 };
  }

  function gestureStrength(speed, config=RESONANCE_CONFIG) {
    const normalized = smoothstep(0, 900, Math.max(0, speed));
    return config.minImpulse + (config.maxImpulse-config.minImpulse)*normalized;
  }

  function emit(system, x, y, speed=0, now=0, options={}) {
    const config=system.config;
    if (!options.force && now-system.lastWaveAt<config.gestureWaveInterval) return null;
    const strength=options.strength || gestureStrength(speed,config);
    const wave={x,y,radius:0,strength,age:0,maxRadius:options.maxRadius||config.waveMaxRadius,hit:false,kind:options.kind||"player",phase:Math.random()*Math.PI*2};
    system.waves.push(wave);system.lastWaveAt=now;return wave;
  }

  function boundaryAcceleration(position, size, config) {
    const margin=Math.max(48,size*config.boundaryMargin),hard=18;
    if(position<margin)return config.boundaryStrength*smoothstep(margin,hard,position);
    if(position>size-margin)return-config.boundaryStrength*smoothstep(size-margin,size-hard,position);
    return 0;
  }

  function update(system, bubble, dt, bounds) {
    const config=system.config;let ax=boundaryAcceleration(bubble.x,bounds.width,config),ay=boundaryAcceleration(bubble.y,bounds.height,config);
    for(const wave of system.waves){
      const previousRadius=wave.radius;wave.age+=dt;wave.radius=Math.min(wave.maxRadius,wave.radius+config.waveSpeed*dt);
      if(wave.hit)continue;
      const dx=bubble.x-wave.x,dy=bubble.y-wave.y,distance=Math.hypot(dx,dy),contact=Math.max(0,distance-bubble.r);
      if(previousRadius<=contact&&wave.radius>=contact&&distance>1){
        const distanceFade=1-clamp(distance/wave.maxRadius,0,.82)*.38;
        const ageFade=1-clamp(wave.age/config.waveLifetime,0,1)*.3;
        const impulse=wave.strength*distanceFade*ageFade/config.bubbleMass;
        bubble.vx+=dx/distance*impulse;bubble.vy+=dy/distance*impulse;
        bubble.impactX=dx/distance;bubble.impactY=dy/distance;bubble.compression=1;
        system.lastImpulse=impulse;wave.hit=true;
      }
    }
    bubble.ax=ax;bubble.ay=ay;bubble.vx+=ax*dt;bubble.vy+=ay*dt;
    const drag=Math.exp(-config.bubbleDrag*dt);bubble.vx*=drag;bubble.vy*=drag;
    const speed=Math.hypot(bubble.vx,bubble.vy);
    if(speed>config.bubbleMaxSpeed){bubble.vx=bubble.vx/speed*config.bubbleMaxSpeed;bubble.vy=bubble.vy/speed*config.bubbleMaxSpeed;}
    bubble.x+=bubble.vx*dt;bubble.y+=bubble.vy*dt;
    // Filet de sécurité hors de la zone de rappel progressive : jamais visible en jeu normal.
    bubble.x=clamp(bubble.x,-bubble.r*.6,bounds.width+bubble.r*.6);
    bubble.y=clamp(bubble.y,-bubble.r*.6,bounds.height+bubble.r*.6);
    bubble.compression=Math.max(0,(bubble.compression||0)-dt*4.2);
    system.waves=system.waves.filter(w=>w.age<config.waveLifetime&&w.radius<w.maxRadius);
    return bubble;
  }
  return { RESONANCE_CONFIG, createSystem, emit, update, gestureStrength, boundaryAcceleration };
});

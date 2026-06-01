// public/js/scene/scene-shaders.js
export var vgVS = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
export var vgFS = `uniform sampler2D tDiffuse;uniform float uTime;uniform float uStrokeDensity;uniform float uSwirlFrequency;uniform float uColorIntensity;varying vec2 vUv;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);}void main(){vec2 uv=vUv;float strokeAngle=noise(uv*uStrokeDensity+uTime*0.05)*6.28318;vec2 strokeDir=vec2(cos(strokeAngle),sin(strokeAngle));float strokeDist=noise(uv*uStrokeDensity*2.0+strokeDir*0.5+uTime*0.03);vec2 center=vec2(0.5);vec2 delta=uv-center;float dist=length(delta);float angle=atan(delta.y,delta.x);float swirl=sin(dist*uSwirlFrequency-uTime*0.5)*0.008;angle+=swirl;vec2 swirled=center+dist*vec2(cos(angle),sin(angle));vec2 distortedUV=mix(swirled,uv+strokeDir*strokeDist*0.008,0.5);distortedUV=clamp(distortedUV,0.0,1.0);vec4 color;color.r=texture2D(tDiffuse,distortedUV+vec2(0.001,0.0)).r;color.g=texture2D(tDiffuse,distortedUV).g;color.b=texture2D(tDiffuse,distortedUV-vec2(0.001,0.0)).b;color.a=1.0;float gray=dot(color.rgb,vec3(0.299,0.587,0.114));color.rgb=mix(vec3(gray),color.rgb,uColorIntensity);float vignette=1.0-smoothstep(0.4,1.4,dist*1.2);color.rgb*=vignette;gl_FragColor=color;}`;

export var glitchVS = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
export var glitchFS = `
uniform sampler2D tDiffuse;
uniform float uTime;
varying vec2 vUv;
float rand(vec2 co){ return fract(sin(dot(co,vec2(12.9898,78.233)))*43758.5453); }
void main(){
  vec2 uv = vUv;
  float scanline = sin(uv.y * 400.0 + uTime * 8.0) * 0.012;
  float aberr = 0.003 + sin(uTime * 0.7) * 0.0015;
  float r = texture2D(tDiffuse, uv + vec2( aberr, 0.0)).r;
  float g = texture2D(tDiffuse, uv).g;
  float b = texture2D(tDiffuse, uv - vec2( aberr, 0.0)).b;
  float glitchLine = step(0.98, rand(vec2(floor(uv.y * 20.0), floor(uTime * 2.0))));
  float glitchShift = glitchLine * (rand(vec2(uTime, uv.y)) - 0.5) * 0.04;
  if (glitchLine > 0.0) {
    r = texture2D(tDiffuse, uv + vec2(aberr + glitchShift, 0.0)).b;
    b = texture2D(tDiffuse, uv - vec2(aberr - glitchShift, 0.0)).r;
  }
  vec3 col = vec3(r, g, b);
  col += scanline * 0.15;
  gl_FragColor = vec4(col, 1.0);
}`;

export var starVS = `
attribute float size;attribute float brightness;attribute float twinkleSpeed;attribute float twinklePhase;attribute vec3 customColor;
varying float vBrightness;varying vec3 vColor;varying float vTwinkle;
uniform float uTime;
void main(){
  float twinkle=0.5+0.5*sin(uTime*twinkleSpeed+twinklePhase);
  vBrightness=brightness*(0.4+0.6*twinkle);vColor=customColor;vTwinkle=twinkle;
  vec4 mvPosition=modelViewMatrix*vec4(position,1.0);
  float sizeMult=0.4+0.6*twinkle;
  gl_PointSize=size*sizeMult*(250.0/-mvPosition.z);
  gl_Position=projectionMatrix*mvPosition;
}`;
export var starFS = `
varying float vBrightness;varying vec3 vColor;varying float vTwinkle;
void main(){
  float dist=length(gl_PointCoord-vec2(0.5));
  if(dist>0.5)discard;
  float alpha=smoothstep(0.5,0.0,dist)*vBrightness;
  float glow=exp(-dist*3.0)*0.6;
  vec3 color=vColor+vec3(glow*0.8,glow*0.5,glow*0.2);
  gl_FragColor=vec4(color,alpha);
}`;

export var waveVS = `uniform float uTime;uniform float uWaveHeight;uniform float uWaveFrequency;varying vec2 vUv;varying float vElevation;void main(){vUv=uv;vec3 pos=position;float w1=sin(pos.x*uWaveFrequency+uTime)*uWaveHeight;float w2=sin(pos.z*uWaveFrequency*0.7+uTime*1.3)*uWaveHeight*0.5;pos.y+=w1+w2;vElevation=w1+w2;gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);}`;
export var waveFS = `uniform vec3 uColor1;uniform vec3 uColor2;uniform vec3 uColor3;varying vec2 vUv;varying float vElevation;void main(){float f=(vElevation+1.0)*0.5;vec3 color=mix(uColor1,uColor2,f);color=mix(color,uColor3,smoothstep(0.6,1.0,f));gl_FragColor=vec4(color,0.85);}`;

export var fireflyVS = `
attribute float phase; attribute float pulseSpeed;
uniform float uTime; uniform float uSize;
varying float vPulse;
void main() {
  float pulse = 0.4 + 0.6 * sin(uTime * pulseSpeed + phase);
  vPulse = pulse;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uSize * pulse * (200.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}`;
export var fireflyFS = `
varying float vPulse;
void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  float core = smoothstep(0.15, 0.0, dist);
  float glow = exp(-dist * 4.0) * 0.5;
  vec3 color = vec3(1.0, 0.85, 0.4);
  float alpha = (core + glow) * vPulse * 0.7;
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(color, alpha);
}`;

export var paintingRevealVS = `
varying vec2 vUv;
varying float vWorldY;
void main() {
  vUv = uv;
  vWorldY = (modelMatrix * vec4(position, 1.0)).y;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
export var paintingRevealFS = `
uniform sampler2D uTexture;
uniform float uRevealProgress;
varying vec2 vUv;
void main() {
  float band = floor(vUv.y * 20.0);
  float bandThreshold = (band + 1.0) / 20.0;
  float noiseOffset = sin(vUv.x * 50.0 + band * 3.7) * 0.03;
  float reveal = smoothstep(bandThreshold + noiseOffset - 0.05, bandThreshold + noiseOffset, uRevealProgress);
  vec4 texColor = texture2D(uTexture, vUv);
  gl_FragColor = vec4(texColor.rgb, texColor.a * reveal);
}`;

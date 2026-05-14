// Van Gogh Post-Processing Shader — Impasto brush-stroke effect
export const vgVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const vgFragmentShader = `
uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uStrokeDensity;
uniform float uSwirlFrequency;
uniform float uColorIntensity;
uniform vec2 uResolution;

varying vec2 vUv;

// Simplex-like noise for brush stroke distortion
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float val = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    val += amp * noise(p);
    p *= 2.0;
    amp *= 0.5;
  }
  return val;
}

void main() {
  vec2 uv = vUv;
  
  // Brush stroke distortion
  float strokeAngle = fbm(uv * uStrokeDensity + uTime * 0.05) * 6.28318;
  vec2 strokeDir = vec2(cos(strokeAngle), sin(strokeAngle));
  float strokeDist = fbm(uv * uStrokeDensity * 2.0 + strokeDir * 0.5 + uTime * 0.03);
  
  // Swirl distortion (Van Gogh signature)
  vec2 center = vec2(0.5);
  vec2 delta = uv - center;
  float dist = length(delta);
  float angle = atan(delta.y, delta.x);
  float swirl = sin(dist * uSwirlFrequency - uTime * 0.5) * 0.02;
  angle += swirl;
  vec2 swirled = center + dist * vec2(cos(angle), sin(angle));
  
  // Combine distortions
  vec2 distortedUV = mix(swirled, uv + strokeDir * strokeDist * 0.015, 0.6);
  distortedUV = clamp(distortedUV, 0.0, 1.0);
  
  // Sample with slight color separation for painterly effect
  vec4 color;
  color.r = texture2D(tDiffuse, distortedUV + vec2(0.002, 0.0)).r;
  color.g = texture2D(tDiffuse, distortedUV).g;
  color.b = texture2D(tDiffuse, distortedUV - vec2(0.002, 0.0)).b;
  color.a = 1.0;
  
  // Boost saturation for Van Gogh vibrancy
  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb = mix(vec3(gray), color.rgb, uColorIntensity);
  
  // Subtle canvas texture overlay
  float canvas = fbm(uv * 200.0) * 0.04;
  color.rgb += canvas;
  
  // Vignette
  float vignette = 1.0 - smoothstep(0.4, 1.4, dist * 1.2);
  color.rgb *= vignette;
  
  gl_FragColor = color;
}
`;

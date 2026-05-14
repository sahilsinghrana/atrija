// Wave shader — ocean/sky waves in Van Gogh style
export const waveVertexShader = `
uniform float uTime;
uniform float uWaveHeight;
uniform float uWaveFrequency;

varying vec2 vUv;
varying float vElevation;

void main() {
  vUv = uv;
  vec3 pos = position;
  
  float wave1 = sin(pos.x * uWaveFrequency + uTime) * uWaveHeight;
  float wave2 = sin(pos.z * uWaveFrequency * 0.7 + uTime * 1.3) * uWaveHeight * 0.5;
  float wave3 = sin((pos.x + pos.z) * uWaveFrequency * 0.3 + uTime * 0.5) * uWaveHeight * 0.3;
  
  pos.y += wave1 + wave2 + wave3;
  vElevation = wave1 + wave2 + wave3;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const waveFragmentShader = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

varying vec2 vUv;
varying float vElevation;

void main() {
  float mixFactor = (vElevation + 1.0) * 0.5;
  vec3 color = mix(uColor1, uColor2, mixFactor);
  color = mix(color, uColor3, smoothstep(0.6, 1.0, mixFactor));
  
  // Brush stroke texture
  float stroke = sin(vUv.x * 80.0 + uTime) * sin(vUv.y * 80.0 + uTime * 0.7) * 0.05;
  color += stroke;
  
  gl_FragColor = vec4(color, 0.85);
}
`;

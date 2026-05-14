// Star field shader — animated constellation renderer
export const starVertexShader = `
attribute float size;
attribute float brightness;
attribute vec3 customColor;

varying float vBrightness;
varying vec3 vColor;

void main() {
  vBrightness = brightness;
  vColor = customColor;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const starFragmentShader = `
varying float vBrightness;
varying vec3 vColor;

void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  
  float alpha = smoothstep(0.5, 0.0, dist) * vBrightness;
  float glow = exp(-dist * 4.0) * 0.5;
  
  vec3 color = vColor + vec3(glow);
  gl_FragColor = vec4(color, alpha);
}
`;

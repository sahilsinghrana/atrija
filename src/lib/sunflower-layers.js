// src/lib/sunflower-layers.js
// Sunflower parallax layer configuration for idea-005
// 3 depth layers: background, midground, foreground

export const SUNFLOWER_LAYERS = [
  {
    name: 'background',
    countFactor: 0.3,
    scaleRange: [0.4, 0.7],
    zRange: [-15, -8],
    yRange: [-1.5, -0.5],
    swayAmp: 0.03,
    swaySpeed: 0.4,
    opacity: 0.5,
    spreadX: 20,
  },
  {
    name: 'midground',
    countFactor: 0.4,
    scaleRange: [0.7, 1.2],
    zRange: [-10, -3],
    yRange: [-1.0, 0.0],
    swayAmp: 0.06,
    swaySpeed: 0.6,
    opacity: 0.75,
    spreadX: 16,
  },
  {
    name: 'foreground',
    countFactor: 0.3,
    scaleRange: [1.2, 1.8],
    zRange: [-6, 0],
    yRange: [-0.5, 0.5],
    swayAmp: 0.12,
    swaySpeed: 0.8,
    opacity: 0.95,
    spreadX: 12,
  },
];

export function getLayerConfig(name) {
  return SUNFLOWER_LAYERS.find(l => l.name === name);
}

export function computeLayerCounts(totalCount, isMobile) {
  const layers = JSON.parse(JSON.stringify(SUNFLOWER_LAYERS));
  if (isMobile) {
    layers.forEach(function (l) {
      l.count = Math.max(1, Math.floor(totalCount * l.countFactor * 0.6));
      l.scaleRange = [l.scaleRange[0] * 0.8, l.scaleRange[1] * 0.8];
    });
  } else {
    layers.forEach(function (l) {
      l.count = Math.floor(totalCount * l.countFactor);
    });
  }
  return layers;
}

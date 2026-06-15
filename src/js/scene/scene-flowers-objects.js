import * as THREE from "three";
import {
  makeSunflowerCanvas,
  makeTulipCanvas,
  makeLilyCanvas,
} from "./scene-flowers.js";
import { isMobile } from "./scene-config.js";

export function createTulips(scene, count) {
  const colors = [
    "#cecece",
    "#c0392b",
    "#e74c3c",
    "#d63031",
    "#b715b7",
    "#10acf5",
    "#d81b60",
    "#e91e63",
    "#f06292",
    "#ec407a",
    "#ad1457",
    "#ff7043",
    "#ff5722",
    "#f4511e",
    "#ee9836",
    "#ff8a65",
    "#8b0000",
    "#9b3676",
    "#7b1fa2",
    "#9c27b0",
    "#5e27a1",
    "#dc143c",
    "#c71585",
    "#b33939",
    "#cd5c5c",
    "#b97455",
    "#fa8072",
    "#e9967a",
    "#ff6347",
    "#ff4500",
    "#33cc8c",
  ];
  let lastColorIdx = -1;
  
  // Create a base white tulip texture for tinting
  const baseTex = new THREE.CanvasTexture(makeTulipCanvas(256, "#ffffff", 0.5, 0));
  
  // Create InstancedMesh for tulips
  const tulipGeometry = new THREE.PlaneGeometry(1, 1);
  const tulipMaterial = new THREE.MeshBasicMaterial({
    map: baseTex,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexColors: true, // Enable vertex colors for per-instance coloring
  });
  const tulipMesh = new THREE.InstancedMesh(tulipGeometry, tulipMaterial, count);
  
  // Store data for animation
  const instanceData = [];
  
  for (let i = 0; i < count; i++) {
    let idx;
    do {
      idx = Math.floor(Math.random() * colors.length);
    } while (idx === lastColorIdx);
    lastColorIdx = idx;
    const color = colors[idx];
    
    const openness = 0.3 + Math.random() * 0.65;
    const texSeed = Math.floor(Math.random() * 10000);
    const spreadX = isMobile ? 12 : 16;
    const spreadZ = isMobile ? 8 : 10;
    
    const s = isMobile ? 1.4 + Math.random() * 0.4 : 1.2 + Math.random() * 0.5;
    const roll = Math.random();
    let scale;
    if (roll < 0.25) {
      scale = isMobile ? 1.4 + Math.random() * 0.4 : 1.2 + Math.random() * 0.5;
    } else {
      scale = isMobile ? 0.9 + Math.random() * 0.5 : 0.8 + Math.random() * 0.55;
    }
    
    // Position tulips in front of camera (camera at z=8, looking at z=0)
    // Spread from z=-5 to z=8 so they're visible
    const position = new THREE.Vector3(
      (Math.random() - 0.5) * spreadX,
      -0.3 + scale * 0.15,
      -5 + Math.random() * 13
    );
    
    const phase = Math.random() * Math.PI * 2;
    const baseY = position.y;
    const baseX = position.x;
    
    // Store instance data
    instanceData.push({
      phase: phase,
      baseX: baseX,
      baseY: baseY,
      scale: s,
      color: color, // Store color for instanceColor
      openness: openness
    });
    
    // Set initial matrix
    tulipMesh.setMatrixAt(
      i,
      new THREE.Matrix4()
        .makePosition(position)
        .scale(new THREE.Vector3(s, s, s))
    );
    
    // Set instance color (this needs to be done after setting the matrix)
    // Actually, instanceColor is set separately
  }
  
  tulipMesh.instanceMatrix.needsUpdate = true;
  
  // Set up instance colors
  const instanceColor = new THREE.Color();
  for (let i = 0; i < count; i++) {
    instanceColor.set(instanceData[i].color);
    tulipMesh.setColorAt(i, instanceColor);
  }
  tulipMesh.instanceColor.needsUpdate = true;
  
  // Add animation function to userData
  tulipMesh.userData = {
    instanceData: instanceData,
    animate: function(mesh, t, dt) {
      // Simple animation - update positions and slight rotation
      for (let i = 0; i < count; i++) {
        const data = instanceData[i];
        const offsetX = Math.sin(t * 0.4 + data.phase) * 0.025;
        const offsetY = Math.sin(t * 0.6 + data.phase) * 0.03;
        const rotation = Math.sin(t * 0.5 + data.phase) * 0.04;
        
        // Create position vector with floating offset
        const position = new THREE.Vector3(
          data.baseX + offsetX,
          data.baseY + offsetY,
          0
        );
        // Create scale vector
        const scale = new THREE.Vector3(data.scale, data.scale, data.scale);
        // Create quaternion from rotation (around z-axis for sprite-like behavior)
        const quaternion = new THREE.Quaternion();
        quaternion.setFromEuler(new THREE.Euler(0, 0, rotation, 'XYZ'));
        
        // Create matrix from position, quaternion, and scale
        const matrix = new THREE.Matrix4().compose(position, quaternion, scale);
        
        mesh.setMatrixAt(i, matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
  };
  
  scene.add(tulipMesh);
  return tulipMesh;
}

export function createSunflowers(scene, count) {
  const colors = [
    "#c8920a",
    "#e8a020",
    "#d4a030",
    "#f0b040",
    "#c08020",
    "#b8860b",
    "#daa520",
    "#cd853f",
    "#d2691e",
    "#e6be44",
  ];
  // Create a base sunflower texture with transparent background
  const baseTex = new THREE.CanvasTexture(makeSunflowerCanvas(256));
  
  // Create InstancedMesh for sunflowers
  const sunflowerGeometry = new THREE.PlaneGeometry(1, 1);
  const sunflowerMaterial = new THREE.MeshBasicMaterial({
    map: baseTex,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexColors: true, // Enable vertex colors for per-instance coloring
  });
  const sunflowerMesh = new THREE.InstancedMesh(sunflowerGeometry, sunflowerMaterial, count);
  
  // Store data for animation
  const instanceData = [];
  
  for (let i = 0; i < count; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const s = isMobile ? 1.0 + Math.random() * 0.8 : 0.8 + Math.random() * 0.9;
    const spreadX = isMobile ? 14 : 18;
    const spreadZ = isMobile ? 10 : 12;
    
    // Position sunflowers in front of camera, spread from z=-6 to z=10
    const position = new THREE.Vector3(
      (Math.random() - 0.5) * spreadX,
      -0.4 + s * 0.2,
      -6 + Math.random() * 16
    );
    
    const phase = Math.random() * Math.PI * 2;
    const baseY = position.y;
    const baseX = position.x;
    
    // Store instance data
    instanceData.push({
      phase: phase,
      baseX: baseX,
      baseY: baseY,
      scale: s,
      color: color
    });
    
    // Set initial matrix
    sunflowerMesh.setMatrixAt(
      i,
      new THREE.Matrix4()
        .makePosition(position)
        .scale(new THREE.Vector3(s, s, s))
    );
  }
  
  sunflowerMesh.instanceMatrix.needsUpdate = true;
  
  // Set up instance colors
  const instanceColor = new THREE.Color();
  for (let i = 0; i < count; i++) {
    instanceColor.set(instanceData[i].color);
    sunflowerMesh.setColorAt(i, instanceColor);
  }
  sunflowerMesh.instanceColor.needsUpdate = true;
  
  // Add animation function to userData
  sunflowerMesh.userData = {
    instanceData: instanceData,
    animate: function(mesh, t, dt) {
      // Simple animation - update positions and slight rotation
      for (let i = 0; i < count; i++) {
        const data = instanceData[i];
        const offsetX = Math.sin(t * 0.3 + data.phase) * 0.02;
        const offsetY = Math.sin(t * 0.5 + data.phase) * 0.025;
        const rotation = Math.sin(t * 0.4 + data.phase) * 0.03;
        
        // Create position vector with sway offset
        const position = new THREE.Vector3(
          data.baseX + offsetX,
          data.baseY + offsetY,
          0
        );
        // Create scale vector
        const scale = new THREE.Vector3(data.scale, data.scale, data.scale);
        // Create quaternion from rotation (around z-axis for sprite-like behavior)
        const quaternion = new THREE.Quaternion();
        quaternion.setFromEuler(new THREE.Euler(0, 0, rotation, 'XYZ'));
        
        // Create matrix from position, quaternion, and scale
        const matrix = new THREE.Matrix4().compose(position, quaternion, scale);
        
        mesh.setMatrixAt(i, matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
  };
  
  scene.add(sunflowerMesh);
  return sunflowerMesh;
}

// Keep original lily function unchanged for now
export function createLilies(scene, count) {
  const colors = [
    "#f05090",
    "#d03070",
    "#e87020",
    "#f06030",
    "#f0a080",
    "#f08080",
    "#e8a0c0",
    "#d05080",
    "#e07050",
    "#c0a080",
  ];
  for (let i = 0; i < count; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const variant = Math.floor(Math.random() * 3);
    const s = isMobile ? 0.7 + Math.random() * 0.5 : 0.5 + Math.random() * 0.5;
    const spreadX = isMobile ? 10 : 14;
    const spreadZ = isMobile ? 6 : 8;
    const tex = new THREE.CanvasTexture(makeLilyCanvas(160, color, variant));
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
      })
    );
    sprite.scale.set(1.0 * s, 1.6 * s, 1);
    // Position lilies in front of camera
    sprite.position.set(
      (Math.random() - 0.5) * spreadX,
      -0.3 + s * 0.15,
      -4 + Math.random() * 12
    );
    const phase = Math.random() * Math.PI * 2;
    const baseY = sprite.position.y;
    const baseX = sprite.position.x;
    (function (p, bx, by) {
      sprite.userData.animate = function (o, t) {
        o.position.x = bx + Math.sin(t * 0.5 + p) * 0.04;
        o.position.y = by + Math.sin(t * 0.75 + p) * 0.06;
        o.material.rotation =
          Math.sin(t * 0.6 + p) * 0.08 + Math.sin(t * 1.5 + p * 2) * 0.03;
      };
    })(phase, baseX, baseY);
    scene.add(sprite);
  }
}
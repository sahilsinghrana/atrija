import * as THREE from 'three';

export function createMusicNotes(scene, count) {
  count = count || 30;
  const notes = [];
  const noteShapes = ['♪', '♫', '♩', '♬'];
  
  for (let i = 0; i < count; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(255, 220, 100, 0.8)';
    ctx.font = '48px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(noteShapes[i % noteShapes.length], 32, 32);
    
    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.6
    });
    
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(
      (Math.random() - 0.5) * 10,
      Math.random() * 6,
      (Math.random() - 0.5) * 10
    );
    sprite.scale.set(0.5, 0.5, 1);
    
    const speed = 0.2 + Math.random() * 0.5;
    const phase = Math.random() * Math.PI * 2;
    sprite.userData.animate = (obj, t) => {
      obj.position.y += speed * 0.01;
      obj.position.x += Math.sin(t + phase) * 0.005;
      obj.material.opacity = 0.3 + Math.sin(t * 2 + phase) * 0.3;
      if (obj.position.y > 8) obj.position.y = -1;
    };
    
    scene.add(sprite);
    notes.push(sprite);
  }
  
  return notes;
}

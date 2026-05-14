import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { vgVertexShader, vgFragmentShader } from '../../shaders/vanGogh.mjs';

export class VanGoghScene {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.objects = [];
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x0a0a1a, 1);
    container.appendChild(this.renderer.domElement);
    
    this.camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 2, 8);
    
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    
    const vgPass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uStrokeDensity: { value: 8.0 },
        uSwirlFrequency: { value: 12.0 },
        uColorIntensity: { value: 1.4 },
        uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) }
      },
      vertexShader: vgVertexShader,
      fragmentShader: vgFragmentShader
    });
    this.composer.addPass(vgPass);
    this.vgPass = vgPass;
    
    this.setupLighting();
    window.addEventListener('resize', () => this.onResize());
    this.animate();
  }
  
  setupLighting() {
    const ambient = new THREE.AmbientLight(0xfff5e0, 0.6);
    this.scene.add(ambient);
    const moonLight = new THREE.DirectionalLight(0xfff8e7, 1.2);
    moonLight.position.set(5, 10, 5);
    this.scene.add(moonLight);
    const fillLight = new THREE.PointLight(0x4466aa, 0.5, 50);
    fillLight.position.set(-5, 3, -5);
    this.scene.add(fillLight);
    this.moonLight = moonLight;
  }
  
  add(obj) {
    this.scene.add(obj);
    this.objects.push(obj);
    return obj;
  }
  
  updateUniforms(params) {
    if (params.strokeDensity !== undefined) this.vgPass.uniforms.uStrokeDensity.value = params.strokeDensity;
    if (params.swirlFrequency !== undefined) this.vgPass.uniforms.uSwirlFrequency.value = params.swirlFrequency;
    if (params.colorIntensity !== undefined) this.vgPass.uniforms.uColorIntensity.value = params.colorIntensity;
  }
  
  setColors(colors) {
    if (colors.ambient) {
      this.scene.children.forEach(c => {
        if (c.isAmbientLight) c.color.setHex(colors.ambient);
      });
    }
    if (colors.moon) {
      if (this.moonLight) this.moonLight.color.setHex(colors.moon);
    }
  }
  
  onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.composer.setSize(w, h);
    this.vgPass.uniforms.uResolution.value.set(w, h);
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    const elapsed = this.clock.getElapsedTime();
    this.vgPass.uniforms.uTime.value = elapsed;
    this.objects.forEach(obj => {
      if (obj.userData.animate) obj.userData.animate(obj, elapsed);
    });
    this.composer.render();
  }
  
  dispose() {
    this.renderer.dispose();
    this.composer.dispose();
  }
}

import * as THREE from "three";
import {  EffectComposer  } from "three/examples/jsm/postprocessing/EffectComposer.js";
import {  RenderPass  } from "three/examples/jsm/postprocessing/RenderPass.js";
import {  ShaderPass  } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { vgVS, vgFS, glitchVS, glitchFS } from "./scene-shaders.js";
import { updatePaintingReveal } from "./scene-objects.js";
import { createSwirlSky } from "./scene-swirl-sky.js";
import {
  isMobile,
  isLowEnd,
  scrollState,
  setScrollMax,
  parallaxConfig,
  _parallaxEnabled,
} from "./scene-config.js";

export class VanGoghScene {
  constructor(container) {
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.objects = [];
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({
      antialias: !isLowEnd,
      alpha: true,
      powerPreference: "low-power",
    });

    const height = window.innerHeight;
    this.renderer.setSize(container.clientWidth, height);
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isLowEnd ? 1.0 : 1.5),
    );
    this.renderer.setClearColor(0x0a0a1a, 1);
    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / height,
      0.1,
      200,
    );
    this.camera.position.set(0, 1.5, 10);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    const vgIntensity = isLowEnd ? 0.85 : 1.0;
    const vgStroke = isLowEnd ? 4.0 : 6.0;
    const vgSwirl = isLowEnd ? 6.0 : 8.0;
    this.vgPass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uStrokeDensity: { value: vgStroke },
        uSwirlFrequency: { value: vgSwirl },
        uColorIntensity: { value: vgIntensity },
      },
      vertexShader: vgVS,
      fragmentShader: vgFS,
    });
    this.composer.addPass(this.vgPass);

    this.glitchPass = new ShaderPass({
      uniforms: { tDiffuse: { value: null }, uTime: { value: 0 } },
      vertexShader: glitchVS,
      fragmentShader: glitchFS,
    });
    this.composer.addPass(this.glitchPass);

    this.swirlSky = createSwirlSky(this.scene);

    this.scene.add(new THREE.AmbientLight(0xfff5e0, 0.7));
    const directionalLight = new THREE.DirectionalLight(0xfff8e7, 1.4);
    directionalLight.position.set(5, 10, 5);
    this.scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffeedd, 0.4, 50);
    pointLight.position.set(-5, 3, -5);
    this.scene.add(pointLight);

    window.addEventListener("resize", () => this.onResize());
    this.animate();
  }

  add(object) {
    this.scene.add(object);
    this.objects.push(object);
    return object;
  }

  updateUniforms(params) {
    if (!this.vgPass) return;
    if (params.strokeDensity !== undefined)
      this.vgPass.uniforms.uStrokeDensity.value = params.strokeDensity;
    if (params.swirlFrequency !== undefined)
      this.vgPass.uniforms.uSwirlFrequency.value = params.swirlFrequency;
    if (params.colorIntensity !== undefined)
      this.vgPass.uniforms.uColorIntensity.value = params.colorIntensity;
  }

  onResize() {
    const width = this.container.clientWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
    setScrollMax(document.body.scrollHeight - window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const t = this.clock.getElapsedTime();
    const dt = this.clock.getDelta();

    if (this.vgPass) this.vgPass.uniforms.uTime.value = t;
    this.glitchPass.uniforms.uTime.value = t;

    if (_parallaxEnabled) {
      const scrollDelta = Math.abs(scrollState.target - scrollState.current);
      if (scrollDelta > 0.001) {
        scrollState.current +=
          (scrollState.target - scrollState.current) * scrollState.smooth;
      }
    }

    const mult = isMobile ? parallaxConfig.mobileIntensityMultiplier : 1.0;
    const s = scrollState.current;
    this.camera.position.x = Math.sin(t * 0.15) * 0.6;
    this.camera.position.y = 2 + Math.sin(t * 0.1) * 0.35;
    this.camera.rotation.z = s * parallaxConfig.cameraRotationZ * mult;
    this.camera.lookAt(0, 1.5, 0);

    const starsNear = this.scene.userData._starsNear;
    const starsMid = this.scene.userData._starsMid;
    const starsFar = this.scene.userData._starsFar;
    if (starsNear)
      starsNear.rotation.y = s * parallaxConfig.starsNearRotationY * mult;
    if (starsMid)
      starsMid.rotation.y = s * parallaxConfig.starsMidRotationY * mult;
    if (starsFar)
      starsFar.rotation.y = s * parallaxConfig.starsFarRotationY * mult;

    if (this.scene.userData._moonGroup) {
      const baseY = this.scene.userData._moonBaseY || 3;
      this.scene.userData._moonGroup.position.y =
        baseY + s * parallaxConfig.moonVerticalOffset * mult;
    }

    if (!isMobile) {
      const bgTop = new THREE.Color(0x08080f);
      const bgBot = new THREE.Color(0x0d0d1a);
      this.scene.background = bgTop.clone().lerp(bgBot, s);
    }

    for (let i = 0; i < this.objects.length; i++) {
      const object = this.objects[i];
      if (object.userData.animate) object.userData.animate(object, t, dt);
    }

    if (this.shootingStarManager) this.shootingStarManager.update(t, dt);
    updatePaintingReveal(this.scene);
    this.composer.render();
  }
}

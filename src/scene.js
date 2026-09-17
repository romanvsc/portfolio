import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import tokens from './tokens.json';
import { sceneConfig } from './scene-config.js';

export function initScene(canvas, onStatus = () => {}) {
  const frame = canvas.closest('.scene-frame');
  frame.removeAttribute('data-scene-error');
  frame.removeAttribute('data-scene-ready');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    frame.setAttribute('data-scene-error', 'true');
    onStatus(false);
    return () => {};
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, sceneConfig.pixelRatioLimit));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(tokens['scene-light'], tokens['brand-soft'], 3));
  const key = new THREE.DirectionalLight(tokens['scene-light'], 4);
  key.position.set(3, 6, 4); scene.add(key);
  const fill = new THREE.DirectionalLight(tokens.surface, 2);
  fill.position.set(-4, 3, -2); scene.add(fill);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(4.1, 3.3, 6.5);
  camera.lookAt(0, 0.8, 0);
  const root = new THREE.Group(); scene.add(root);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');
  let disposed = false;
  let visible = false;
  let ready = false;
  let raf = 0;
  let target = 0;
  function draw() { if (!disposed && ready && visible && !document.hidden) renderer.render(scene, camera); }
  function resize() {
    const width = Math.max(1, canvas.clientWidth), height = Math.max(1, canvas.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height; camera.updateProjectionMatrix(); draw();
  }
  function animate() {
    raf = 0;
    if (disposed || !visible || document.hidden || reduced.matches) return;
    root.rotation.y += (target - root.rotation.y) * 0.12;
    draw();
    if (Math.abs(target - root.rotation.y) > 0.0001) raf = requestAnimationFrame(animate);
  }
  function requestDraw() { if (!raf) raf = requestAnimationFrame(animate); }
  function pointerMove(event) {
    if (reduced.matches || !finePointer.matches) return;
    const bounds = canvas.getBoundingClientRect();
    target = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.28;
    requestDraw();
  }
  function pointerLeave() { target = 0; requestDraw(); }
  function motionChange() { cancelAnimationFrame(raf); raf = 0; target = 0; root.rotation.y = 0; draw(); }
  function visibilityChange() { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else draw(); }
  function contextLost(event) { event.preventDefault(); ready = false; cancelAnimationFrame(raf); raf = 0; frame.removeAttribute('data-scene-ready'); frame.setAttribute('data-scene-error', 'true'); onStatus(false); }
  function disposeObject(object) {
    object.traverse((item) => {
      item.geometry?.dispose();
      if (item.material) for (const material of [].concat(item.material)) {
        for (const value of Object.values(material)) if (value?.isTexture) value.dispose();
        material.dispose();
      }
    });
  }
  new GLTFLoader().load(sceneConfig.modelUrl, (gltf) => {
    if (disposed) { disposeObject(gltf.scene); return; }
    gltf.scene.traverse((object) => {
      if (object.material) for (const material of [].concat(object.material)) {
        if (tokens[material.name] && material.color) material.color.set(tokens[material.name]);
      }
    });
    root.add(gltf.scene); ready = true;
    resize(); frame.setAttribute('data-scene-ready', 'true'); draw(); onStatus(true);
  }, undefined, () => { if (!disposed) { frame.setAttribute('data-scene-error', 'true'); onStatus(false); } });
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(canvas);
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) draw(); else { cancelAnimationFrame(raf); raf = 0; } });
  observer.observe(canvas);
  reduced.addEventListener('change', motionChange);
  document.addEventListener('visibilitychange', visibilityChange);
  canvas.addEventListener('pointermove', pointerMove, { passive: true });
  canvas.addEventListener('pointerleave', pointerLeave);
  canvas.addEventListener('webglcontextlost', contextLost);
  resize();
  return () => {
    disposed = true; cancelAnimationFrame(raf); observer.disconnect(); resizeObserver.disconnect();
    reduced.removeEventListener('change', motionChange);
    document.removeEventListener('visibilitychange', visibilityChange);
    canvas.removeEventListener('pointermove', pointerMove);
    canvas.removeEventListener('pointerleave', pointerLeave);
    canvas.removeEventListener('webglcontextlost', contextLost);
    disposeObject(root); renderer.dispose();
  };
}

import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import stats from "../common/stats";
import { listenResize } from "../common/utils";

// Canvas
const canvas = document.querySelector("#mainCanvas") as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
// const textureLoader = new THREE.TextureLoader();

const envMapTexture = new THREE.CubeTextureLoader()
  .setPath("../assets/textures/environmentMaps/4/")
  .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.envMap = envMapTexture;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.position.set(-1.5, 0, 0);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.position.set(1.5, 0, 0);

scene.add(sphere, plane, torus);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight("#ffffff", 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 2);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.enabled = false

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

listenResize(sizes, camera, renderer);

// Clock
const clock = new THREE.Clock();

// Animations
const tick = () => {
  stats.begin();

  const elapsedTime = clock.getElapsedTime();

  // Update Objects
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  controls.update();
  // Render
  renderer.render(scene, camera);
  stats.end();
  requestAnimationFrame(tick);
};

tick();

/**
 * Debug
 */
const gui = new dat.GUI();

gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);
// gui.add(material, 'aoMapIntensity').min(0).max(1).step(0.0001)
// gui.add(material, 'displacementScale').min(0).max(0.1).step(0.0001)
gui.add(material, "wireframe");

import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import stats from '../common/stats'
import { listenResize } from '../common/utils'

// canvas
const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

// scene
const scene = new THREE.Scene()

// texture
const textureLoader = new THREE.TextureLoader()
const simpleShadow = textureLoader.load('../assets/textures/simpleShadow.jpg')

/**
 *  objects
 */
const material = new THREE.MeshStandardMaterial()
material.metalness = 0
material.roughness = 0.4

const sphere = new THREE.Mesh(new THREE.SphereGeometry(
  0.5,
  32,
  32,
), material)

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
plane.rotation.set(-Math.PI / 2, 0, 0)
plane.position.set(0, -0.5, 0)

const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), new THREE.MeshBasicMaterial({
  color: '#000000',
  transparent: true,
  alphaMap: simpleShadow,
}))
shadowPlane.rotateX(-Math.PI / 2)
shadowPlane.position.y = plane.position.y + 0.01

scene.add(sphere, plane, shadowPlane)

// liight
const ambientLight = new THREE.AmbientLight('#ffffff', 0.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#ffffaa', 0.5)
directionalLight.position.set(1, 0.75, 1)
scene.add(directionalLight)

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
)
scene.add(directionalLightHelper)

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 2)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = true
controls.autoRotateSpeed = 0.8
// controls.enabled = false

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap

listenResize(sizes, camera, renderer)

// Clock
const clock = new THREE.Clock();

// Animations
const tick = () => {
  stats.begin();
  const elapsedTime = clock.getElapsedTime();

  sphere.position.x = Math.sin(elapsedTime) * 1.5;
  sphere.position.z = Math.cos(elapsedTime) * 1.5;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 2.5))

  shadowPlane.position.x = sphere.position.x
  shadowPlane.position.z = sphere.position.z
  console.log(sphere.position.y)
  shadowPlane.material.opacity = (1 - sphere.position.y) * 0.6

  controls.update();

  // Render
  renderer.render(scene, camera);
  stats.end();
  requestAnimationFrame(tick);
};

tick()

import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
// import * as dat from 'lil-gui'
import stats from '../common/stats'
import { listenResize } from '../common/utils'

// canvas
const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

// scene
const scene = new THREE.Scene()

/**
 * objects
 */
// material
const material = new THREE.MeshStandardMaterial()
material.metalness = 0
material.roughness = 0.4

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  material,
)
sphere.position.set(-1.5, 0, 0)

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(0.75, 0.75, 0.75),
  material,
)
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material,
)
torus.position.set(1.5, 0, 0)

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  material,
)
plane.rotation.set(-Math.PI / 2, 0, 0)
plane.position.set(0, -0.65, 0)

scene.add(sphere, cube, torus, plane)

/**
 * light
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#ffffaa', 0.5)
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight)

// size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
)
camera.position.set(1, 1, 2)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2),
)

listenResize(sizes, camera, renderer)

// clock
// const clock = new THREE.Clock()

// animations
const tick = () => {
  stats.begin()
  // const elapsedTime = clock.getElapsedTime()

  controls.update()
  // spotLightHelper.update()

  // render
  renderer.render(scene, camera)
  stats.end()
  requestAnimationFrame(tick)
}

tick()

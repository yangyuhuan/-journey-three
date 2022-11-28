import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import stats from '../common/stats'
import { listenResize, dbClkfullScreen } from '../common/utils'

// canvas
const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

// scene
const scene = new THREE.Scene()

/**
 * objects
 */
// geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 20000
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)
for (let i = 0; i < count * 3; i += 1) {
  positions[i] = (Math.random() - 0.5) * 10
  colors[i] = Math.random()
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
// textures
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('https://gw.alicdn.com/imgextra/i3/O1CN01DO6Ed61QtcMKsVnK2_!!6000000002034-2-tps-56-56.png')

// material
const pointMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  // color: new THREE.Color('#ff88cc'),
  map: particleTexture,
  alphaMap: particleTexture,
  transparent: true,
  // alphaTest: 0.001,
  depthTest: false,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
})

const particles = new THREE.Points(particlesGeometry, pointMaterial)

scene.add(particles)
// const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial())
// scene.add(cube)
// lights
const ambientLight = new THREE.AmbientLight('#ffffff', 0.4)
scene.add(ambientLight)

// size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// camera
const camera = new THREE.PerspectiveCamera(
  75, sizes.width / sizes.height, 0.1, 100,
)
camera.position.set(2, 1.8, 2)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotateSpeed = 0.2
controls.zoomSpeed = 0.3

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

listenResize(sizes, camera, renderer)
dbClkfullScreen(document.body)

// animations
const clock = new THREE.Clock()
const  tick = () => {
  stats.begin()

  const elapsedTime = clock.getElapsedTime()

  for (let i = 0; i < count; i += 1) {
    const x = particlesGeometry.attributes.position.getX(i)
    particlesGeometry.attributes.position.setY(i,
      Math.sin(elapsedTime + x))
  }
  particlesGeometry.attributes.position.needsUpdate = true

  controls.update()
  pointMaterial.needsUpdate = true

  // Render
  renderer.render(scene, camera)
  stats.end()
  requestAnimationFrame(tick)
}

tick()
/**
 * Debug
 */
const gui = new dat.GUI()

gui.add(controls, 'autoRotate')
gui.add(controls, 'autoRotateSpeed', 0.1, 10, 0.01)
gui.add(pointMaterial, 'size', 0.01, 0.1, 0.001)
gui.add(pointMaterial, 'sizeAttenuation')

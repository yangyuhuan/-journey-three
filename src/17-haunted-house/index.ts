import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import stats from '../common/stats'
import { listenResize, dbClkfullScreen } from '../common/utils'

// canvas
const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// scene
const scene = new THREE.Scene()

/**
 * object
 * */
const material = new THREE.MeshStandardMaterial()
material.metalness = 0
material.roughness = 0.4

// plane
const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  material,
)
plane.rotation.set(-Math.PI / 2, 0, 0)
plane.position.set(0, 0, 0)
scene.add(plane)

// house
const house = new THREE.Group()
scene.add(house)

// walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    color: '#ac8e82',
  }),
)
walls.position.y = 1.25
house.add(walls)

// roof
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.25, 1, 4),
  new THREE.MeshStandardMaterial({
    color: '#b35f45',
  }),
)
roof.rotation.y = Math.PI / 4
roof.position.y = 2.5 + 0.5
house.add(roof)

// door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.MeshStandardMaterial({
    color: '#FFE082',
  }),
)
door.position.y = 1
door.position.z = 2 + 0.001
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
  color: '#89c854',
})
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)

// graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
  color: '#b2b6b1',
})

for (let i = 0; i < 50; i += 1) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  const angle = Math.random() * Math.PI * 2
  const radius = 3 + Math.random() * 6
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  grave.position.set(x, 0.3, z)
  grave.rotation.z = (Math.random() - 0.5) * 0.4
  grave.rotation.y = (Math.random() - 0.5) * 0.4
  graves.add(grave)
}

// light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.3)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#ffffaa', 0.5)
directionalLight.position.set(1, 0.75, 0)
scene.add(directionalLight)

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 2, 4)

// controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setSize(sizes.width, sizes.height)
// renderer.setClearColor('#262837')
renderer.render(scene, camera)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

listenResize(sizes, camera, renderer)
dbClkfullScreen(document.body)

// tick
const tick = () => {
  stats.begin()
  controls.update()

  // render
  renderer.render(scene, camera)
  stats.end()
  requestAnimationFrame(tick)
}

tick()

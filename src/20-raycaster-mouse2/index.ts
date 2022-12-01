import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import stats from '../common/stats'
import { listenResize, dbClkfullScreen } from '../common/utils'

// Canvas
const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

// Scene
const scene = new THREE.Scene()

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 28)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.zoomSpeed = 0.3
// controls.autoRotateSpeed = 1
controls.autoRotate = true

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ color: '#B71C1C' }),
)
object1.position.setX(-4)
const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ color: '#B71C1C' }),
)
const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ color: '#B71C1C' }),
)
object3.position.setX(4)

scene.add(object1, object2, object3)

const ballNumInRow = 5
const cubeGroup = new THREE.Group()
for (let k = 0; k < ballNumInRow; k += 1) {
  const planeGroup = new THREE.Group()
  for (let j = 0; j < ballNumInRow; j += 1) {
    const rowGroup = new THREE.Group()
    for (let i = 0; i < ballNumInRow; i += 1) {
      const object = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshStandardMaterial({ color: '#fff' }),
      )
      object.position.setX(i * 2)
      object.name = 'ball'
      rowGroup.add(object)
    }
    rowGroup.position.setZ(j * 2)
    planeGroup.add(rowGroup)
  }
  planeGroup.position.setY(k * 2)
  cubeGroup.add(planeGroup)
}

cubeGroup.position.set(-ballNumInRow / 2 - 1.5, -ballNumInRow / 2 - 1.5, -ballNumInRow / 2 - 1.5)

scene.add(cubeGroup)

const objectsToTest: THREE.Mesh[] = []
cubeGroup.traverse((obj: THREE.Mesh) => {
  if (obj.type === 'Mesh') {
    objectsToTest.push(obj)
  }
})

const cube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshStandardMaterial())
cube.position.setY(-8)
scene.add(cube)

const directionLight = new THREE.DirectionalLight()
directionLight.position.set(1, 1, 1)
const ambientLight = new THREE.AmbientLight(new THREE.Color('#ffffff'), 0.3)
scene.add(ambientLight, directionLight)

const directionLightHelper = new THREE.DirectionalLightHelper(directionLight, 2)
scene.add(directionLightHelper)

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()

const arrowHelper = new THREE.ArrowHelper(
  raycaster.ray.direction,
  raycaster.ray.origin,
  15,
  0xff0000,
  1,
  0.5,
)
scene.add(arrowHelper)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

listenResize(sizes, camera, renderer)
dbClkfullScreen(document.body)

/**
 * mouse
 */
const mouse : {
  x: number | null,
  y: number | null,
} = { x: null, y: null }

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
})

window.addEventListener('touchmove', (event) => {
  const { clientX, clientY } = event.touches[0]
  mouse.x = (clientX / sizes.width) * 2 - 1
  mouse.y = -(clientY / sizes.height) * 2 + 1
})

// Animations
const tick = () => {
  stats.begin()

  if (mouse.x && mouse.y) {
    // 通过相机和鼠标位置来更新射线
    raycaster.setFromCamera({ x: mouse.x, y: mouse.y }, camera)
  }

  const intersects: THREE.Intersection<
  THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>
  > [] = raycaster.intersectObjects(objectsToTest)
  if (
    JSON.stringify(intersects[0]?.object.material.color)
    === JSON.stringify(new THREE.Color(0xffffff))
  ) {
    intersects[0]?.object.material.color.set(
      new THREE.Color(Math.random(), Math.random(), Math.random()),
    )
  }

  controls.update()

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
gui.add(arrowHelper, 'visible').name('arrowHelper visible')
gui.add(directionLightHelper, 'visible').name('directionLightHelper visible')

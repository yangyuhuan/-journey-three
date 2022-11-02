import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import { Box } from 'cannon'
import GUI from 'lil-gui'
import Stats from '../common/stats'
import { listenResize } from '../common/utils'
import stats from '../common/stats'

const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

const scene = new THREE.Scene()

const box = new THREE.BoxGeometry(1, 1, 1)
const defaultColor = 0x607d8b
const material = new THREE.MeshBasicMaterial({
  color: 0x607d8b,
})

const cubeMesh = new THREE.Mesh(box, material)
scene.add(cubeMesh)

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 100)
camera.position.set(0, 0, 3)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGL1Renderer({
  canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

listenResize(sizes, camera, renderer)

const tick = () => {
  stats.begin()

  controls.update()
  renderer.render(scene, camera)
  stats.end()
  requestAnimationFrame(tick)
}

tick()

// debug
const gui = new dat.GUI({

})
gui.add(cubeMesh.position, 'y').min(-3).max(3).step(0.01)
  .name('cubeMesh Y')
gui.add(cubeMesh.position, 'x').min(-3).max(3).step(0.01)
gui.add(cubeMesh.position, 'z').min(-3).max(3).step(0.01)

gui.add(cubeMesh, 'visible')
gui.add(cubeMesh.material, 'wireframe')

const debugObj = {
  color: defaultColor,
  spin() {
    gsap.to(cubeMesh.rotation, {
      duration: 1,
      y: cubeMesh.rotation.y + Math.PI * 2,
    })
  },
}

gui.addColor(debugObj, 'color').onChange((e) => {
  cubeMesh.material.color.set(e)
})

gui.add(debugObj, 'spin')

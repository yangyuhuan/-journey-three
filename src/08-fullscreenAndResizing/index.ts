// eslint-disable-next-line no-unused-vars
import * as THREE from 'three';
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { listenResize, dbClkfullScreen } from '../common/utils'

const scene = new THREE.Scene();
const canvas = document.getElementById('mainCanvas') as HTMLCanvasElement

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({
    color: 0xffffff,
  }),
)
scene.add(cube)

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  100,
)
camera.position.set(1, 1, 3)
camera.lookAt(cube.position)

const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight)

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const tick = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();

window.addEventListener('dblclick', () =>  {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
  if (fullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else {
      document.webkitFullscreenElement()
    }
  } else  if (canvas.requestFullscreen) {
    canvas.requestFullscreen()
  } else {
    canvas.webkitRequestFullscreen()
  }
})

window.addEventListener('resize', () => {
  // update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

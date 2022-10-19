import * as THREE from 'three'

//创建场景
const scene = new THREE.Scene();

//相机
const camera = new THREE.PerspectiveCamera(45, 4 / 3, 1, 1000);
camera.position.set(1, 1, 1);
scene.add(camera);
camera.lookAt(camera.position)

//cube
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({
    color: 0xff00ff
  })
)
scene.add(cube)

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#mainCanvas') as HTMLCanvasElement
})

renderer.render(scene, camera)

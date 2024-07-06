import * as THREE from "../node_modules/three/build/three.module.js";

const threeCanvas = document.getElementById("three-canvas");
const threeCanvasB = document.getElementById("three-canvas-b");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  threeCanvas.offsetWidth / threeCanvas.offsetHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
attachSceneToCanvas(threeCanvas, renderer);

// boxGemotry to create a cube
const geometry = new THREE.BoxGeometry(1, 1, 1); // width height depth
// a material to color the cube
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

//creating a render loop
function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

function attachSceneToCanvas(canvas, renderer) {
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  canvas.appendChild(renderer.domElement);
}

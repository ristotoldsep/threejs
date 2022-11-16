import "./style.css";

import * as THREE from "three";

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


// PRELOADER
const preloader = document.querySelector(".preloader");

const fadeOutEffect = setInterval(() => {
  if (!preloader.style.opacity) {
    preloader.style.opacity = 1;
  }
  if (preloader.style.opacity > 0) {
    preloader.style.opacity -= 0.1;
  } else {
    clearInterval(fadeEffect);
  }
}, 100);


// window.addEventListener("load", fadeOutEffect);


// =====

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Select the canvas element to render the animation into
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
// camera.position.setZ(30);

renderer.render(scene, camera);

// Shape of the object
// const geometry = new THREE.TorusGeometry(10, 3, 16, 100);

// Material of the shape
/* const material = new THREE.MeshStandardMaterial({
  color: 0xff6347,
  wireframe: false,
}); */

// Combine shape and material and add it to the scene
// const torus = new THREE.Mesh(geometry, material);

// DONUT
const donutTexture = new THREE.TextureLoader().load('bmw.jpg')

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(10, 3, 16, 100),
  new THREE.MeshBasicMaterial({ map: donutTexture, wireframe: false })
  );
  
  scene.add(torus);
  // =================================

// To add reflections
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5)

// To light up entire scene
const ambientLight = new THREE.AmbientLight(0xffffff)

scene.add(pointLight, ambientLight)

// HELPERS (controls etc) =============================
// To show where pointlight is coming from
const lightHelper = new THREE.PointLightHelper(pointLight)
// To show grid
// const gridHelper = new THREE.GridHelper(200,50)
// scene.add(lightHelper)
// scene.add(gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);
// ====================================

// STARS
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false });
  const star = new THREE.Mesh(geometry, material);
  
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ));

  star.position.set(x, y, z);
  scene.add(star)

}

Array(200).fill().forEach(addStar)
// ========================================


// BACKGROUND IMAGE
const spaceTexture = new THREE.TextureLoader().load('space.jpg')
scene.background = spaceTexture;
// =====================================


// Avatar
const semirTexture = new THREE.TextureLoader().load('semir.png')

const semir = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial( { map: semirTexture} )
)

scene.add(semir)
// ==========================

// MOON
const moonTexture = new THREE.TextureLoader().load('moon.jpg')
const normalTexture = new THREE.TextureLoader().load('normal.jpg')

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ 
    map: moonTexture,
    normalMap: normalTexture
  })
  );
  
  scene.add(moon);

  // BOTH DO SAME THINGS below
  moon.position.z = 30;
  moon.position.setX(-10)
  // =================================

  // CAR
  function createWheels() {
    const geometry = new THREE.BoxBufferGeometry(1, 1, 3);
    const material = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const wheel = new THREE.Mesh(geometry, material);
    return wheel;
  }

  function createCar() {
    const car = new THREE.Group();

    const backWheel = createWheels();
    backWheel.position.y = 9;
    backWheel.position.x = -6;
    car.add(backWheel);

    const frontWheel = createWheels();
    frontWheel.position.y = 9;
    frontWheel.position.x = 6;
    car.add(frontWheel);

    const main = new THREE.Mesh(
      new THREE.BoxBufferGeometry(20, 5, 10),
      new THREE.MeshLambertMaterial({ color: 0x181818 })
    );
    main.position.y = 12;
    car.add(main);

    const cabin = new THREE.Mesh(
      new THREE.BoxBufferGeometry(11, 4, 8),
      new THREE.MeshLambertMaterial({ color: 0x000000 })
    );
    cabin.position.x = 0;
    cabin.position.y = 17;
    car.add(cabin);

    return car;
  }

  const car = createCar();
  // scene.add(car);

   car.position.z = 30;
   car.position.setX(10);
   car.position.y = -15;


// MOVE CAMERA WITH SCROLLING

function moveCamera() {
  
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  semir.rotation.y += 0.01;
  semir.rotation.x += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;

}

document.body.onscroll = moveCamera

// RENDER THE WHOLE ANIMATION
// recursive function to render animation
function animate() {
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01
  torus.rotation.y += 0.005
  torus.rotation.z += 0.01


  controls.update()

  renderer.render( scene, camera );
}

animate()
// ========================================
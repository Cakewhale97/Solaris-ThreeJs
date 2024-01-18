import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const infoOverlay = document.getElementById("infoOverlay");

// Create the scene
const scene = new THREE.Scene();

// Add a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 10;

//Create a Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();

const controls = new OrbitControls(camera, renderer.domElement);

// Earth
const geometry = new THREE.SphereGeometry(0.5, 32, 32);
const texture = textureLoader.load("/textures/00_earthmap1k.jpg");
const material = new THREE.MeshPhongMaterial({ map: texture });

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// //Clouds
// const cloudGeometry = new THREE.SphereGeometry(1.01, 32, 32);
// const cloudTexture = textureLoader.load("/textures/04_earthcloudmap.jpg");
// const cloudMaterial = new THREE.MeshPhongMaterial({
//   map: cloudTexture,
//   transparent: true,
//   opacity: 0.7,
// });

// const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
// scene.add(clouds);

//Stars

function createStarField() {
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
  });

  const starVertices = [];
  for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3)
  );
  const stars = new THREE.Points(starsGeometry, starsMaterial);

  return stars;
}

const starField = createStarField();
scene.add(starField);

// Orbit Path
function createOrbit(radiusX, radiusY, color = 0xffffff) {
  const orbitShape = new THREE.Shape();
  const orbit = new THREE.EllipseCurve(
    0,
    0,
    radiusX,
    radiusY,
    0,
    2 * Math.PI,
    false,
    0
  );

  const points = orbit.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: color });

  const ellipse = new THREE.Line(geometry, material);
  ellipse.rotation.x = Math.PI / 2; //Rotate to match the ecliptic plane

  return ellipse;
}

const earthOrbit = createOrbit(5, 5);
const marsOrbit = createOrbit(8, 8);
const venusOrbit = createOrbit(3.5, 3.5);
const mercuryOrbit = createOrbit(2.5, 2.5);

scene.add(earthOrbit);
scene.add(marsOrbit);
scene.add(venusOrbit);
scene.add(mercuryOrbit);

// Mars
const marsGeometry = new THREE.SphereGeometry(0.4, 32, 32);
const marsTexture = textureLoader.load("/textures/mars_1k_color.jpg");
const marsMaterial = new THREE.MeshPhongMaterial({ map: marsTexture });
const mars = new THREE.Mesh(marsGeometry, marsMaterial);
mars.position.set(2, 0, 0);
scene.add(mars);

//Venus
const venusGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const venusTexture = textureLoader.load("/textures/venusmap.jpg");
const venusMaterial = new THREE.MeshPhongMaterial({ map: venusTexture });
const venus = new THREE.Mesh(venusGeometry, venusMaterial);
venus.position.set(-2.5, 0, 0);
scene.add(venus);

//Mercury
const mercuryGeometry = new THREE.SphereGeometry(0.3, 32, 32);
const mercuryTexture = textureLoader.load("/textures/mercurymap.jpg");
const mercuryMaterial = new THREE.MeshPhongMaterial({ map: mercuryTexture });
const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
// mercury.position.set(-5.5, 0, 0);
scene.add(mercury);

//Sun
const sunGeometry = new THREE.SphereGeometry(1, 64, 64);
const sunTexture = textureLoader.load("/textures/2k_sun.jpg");
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(0, 0, 0);
scene.add(sun);

const pointLight = new THREE.PointLight(0xffffff, 1.5, 0);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const earthOrbitRadius = 5;
const earthOrbitSpeed = 0.01;
const venusOrbitRadius = earthOrbitRadius * 0.723;
const venusOrbitSpeed = 0.008;
const mercuryOrbitRadius = earthOrbitRadius * 0.387;
const mercuryOrbitSpeed = 0.013;

let earthAngle = 0;
let marsAngle = 0;
let venusAngle = 0;
let mercuryAngle = 0;

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  earthAngle += earthOrbitSpeed;
  sphere.position.x = earthOrbitRadius * Math.cos(earthAngle);
  sphere.position.z = earthOrbitRadius * Math.sin(earthAngle);

  marsAngle += 0.008;
  mars.position.x = 8 * Math.cos(marsAngle);
  mars.position.z = 8 * Math.sin(marsAngle);

  venusAngle += venusOrbitSpeed;
  venus.position.x = venusOrbitRadius * Math.cos(venusAngle);
  venus.position.z = venusOrbitRadius * Math.sin(venusAngle);

  mercuryAngle += mercuryOrbitSpeed;
  mercury.position.x = mercuryOrbitRadius * Math.cos(mercuryAngle);
  mercury.position.z = mercuryOrbitRadius * Math.sin(mercuryAngle);
  //Rotate the cube
  // sphere.rotation.y += 0.001;
  // mars.rotation.y += 0.001;
  // clouds.rotation.y += 0.001;
  // venus.rotation.y += 0.001;
  // mercury.rotation.y += 0.001;
  // sun.rotation.y += 0.001;

  //Render the scene
  renderer.render(scene, camera);
}

animate();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  //Update the picking ray with the came and mouse position
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object === sphere) {
      console.log("earth clicked");
      infoOverlay.innerHTML = "Earth: The third planet from the sun";
      infoOverlay.style.display = "block";
    } else if (intersects[i].object === mars) {
      infoOverlay.innerHTML = "Mars;";
      console.log("Mars clicked");
    }
  }
}

window.addEventListener("click", onClick, false);

function onDocumentMouseWheel(event) {
  //Zoom Out
  camera.position.z += event.deltaY * 0.05;
}

document.addEventListener("wheel", onDocumentMouseWheel);
window.addEventListener(
  "resize",
  function () {
    camera.aspect = window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

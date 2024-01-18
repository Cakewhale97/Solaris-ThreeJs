// Create the scene
const scene = new THREE.Scene();

// Add a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

//Create a Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Earth
const geometry = new THREE.SphereGeometry(1, 32, 32);
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/textures/00_earthmap1k.jpg");
const material = new THREE.MeshBasicMaterial({ map: texture });

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

//Clouds
const cloudGeometry = new THREE.SphereGeometry(1.01, 32, 32);
const cloudTexture = textureLoader.load("/textures/04_earthcloudmap.jpg");
const cloudMaterial = new THREE.MeshBasicMaterial({
  map: cloudTexture,
  transparent: true,
  opacity: 0.7,
});

const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(clouds);

// Mars
const marsGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const marsTexture = textureLoader.load("/textures/mars_1k_color.jpg");
const marsMaterial = new THREE.MeshBasicMaterial({ map: marsTexture });
const mars = new THREE.Mesh(marsGeometry, marsMaterial);
mars.position.set(2, 0, 0);
scene.add(mars);

//Venus
const venusGeometry = new THREE.SphereGeometry(1, 32, 32);
const venusTexture = textureLoader.load("/textures/venusmap.jpg");
const venusMaterial = new THREE.MeshBasicMaterial({ map: venusTexture });
const venus = new THREE.Mesh(venusGeometry, venusMaterial);
venus.position.set(-2.5, 0, 0);
scene.add(venus);

//Mercury 
const mercuryGeometry = new THREE.SphereGeometry(1, 32, 32);
const mercuryTexture = textureLoader.load("/textures/mercurymap.jpg");
const mercuryMaterial = new THREE.MeshBasicMaterial({ map: mercuryTexture });
const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
mercury.position.set(-5.5, 0, 0);
scene.add(mercury)

function animate() {
  requestAnimationFrame(animate);

  //Rotate the cube
  sphere.rotation.y += 0.001;
  mars.rotation.y += 0.001;
  clouds.rotation.y += 0.001;
  venus.rotation.y += 0.001;
  mercury.rotation.y += 0.001;

  //Render the scene
  renderer.render(scene, camera);
}

animate();

window.addEventListener(
  "resize",
  function () {
    camera.aspect = window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

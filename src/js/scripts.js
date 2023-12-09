import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Papa from "papaparse";

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);

camera.position.set(-1000, 1000, -500);
camera.lookAt(0, 0, 0);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5000);
scene.add(axesHelper);

orbit.update();

const planeGeometry = new THREE.PlaneGeometry(5000, 5000);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xdfdfdf,
  side: THREE.DoubleSide,
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
// plane.rotation.x = -0.5 * Math.PI;

const gridHelper = new THREE.GridHelper(5000);
scene.add(gridHelper);
gridHelper.rotation.x = -0.5 * Math.PI;
scene.rotation.z = -0.5 * Math.PI;
scene.rotation.x = -0.5 * Math.PI;
scene.position.x = -500;
scene.position.y = -500;
scene.position.z = -500;
renderer.setClearColor(0xdbd2d5);

// Fetch CSV file content
fetch("../data/layout.csv")
  .then((response) => response.text())
  .then((csvText) => {
    // Parse CSV content using PapaParse
    const parsedData = Papa.parse(csvText, { header: true }).data;
    console.log(parsedData);

    // Create objects for each location
    parsedData.forEach((location) => {
      const x = parseFloat(location.X);
      const y = parseFloat(location.Y);
      const z = parseFloat(location.Z);
      if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
        const width = parseFloat(location.WIDTH);
        const height = parseFloat(location.HEIGHT);
        const depth = parseFloat(location.DEPTH);

        // Create geometry and material
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshBasicMaterial({
          color: 0x00aa00,
          wireframe: false,
        });

        // Create mesh
        const cube = new THREE.Mesh(geometry, material);

        cube.position.set(x, y, z);

        // Add cube to the scene
        scene.add(cube);

        var geo = new THREE.EdgesGeometry(geometry); // or WireframeGeometry( geometry )

        var mat = new THREE.LineBasicMaterial({
          color: 0x000000,
          linewidth: 1,
        });

        var wireframe = new THREE.LineSegments(geo, mat);

        wireframe.position.set(x, y, z);
        scene.add(wireframe);
      }
    });
  })
  .catch((error) => {
    console.error("Error fetching the CSV file:", error);
  });

function animate(time) {
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

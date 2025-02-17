import * as THREE from "three"; // Or your desired version
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

document.addEventListener("DOMContentLoaded", (event) => {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");

  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5; // Adjust z position to see the cube

  // Renderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Cube Geometry and Material
  const geometry = new THREE.BoxGeometry(); // Default cube size (1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // Optional: Add some lights so you can see the cube's faces properly
  const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // White directional light
  directionalLight.position.set(1, 1, 1).normalize(); // From top right
  scene.add(directionalLight);

  // Animation loop (for continuous rendering)
  function animate() {
    requestAnimationFrame(animate);
    // Optional: Rotate the cube if you want to see it from different angles
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  }

  animate();

  // Handle window resizing
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // loader.load(`models/bocolla/bocolla.gltf`, (gltf) => {
  //   // Replace with your model path
  //   const model = gltf.scene;

  //   // Center the model (important!)
  //   const box = new THREE.Box3().setFromObject(model);
  //   const center = box.getCenter(new THREE.Vector3());
  //   model.position.x = -center.x;
  //   model.position.y = -center.y;
  //   model.position.z = -center.z;

  //   scene.add(model);

  //   // Adjust camera position (after model is loaded and centered)
  //   camera.position.z = box.getSize(new THREE.Vector3()).z * 1.5; // Example: Position camera based on model size
  // });

  // let stream;

  // async function getCameraStream() {
  //   try {
  //     const constraints = {
  //       video: {
  //         facingMode: { exact: "environment" },
  //       },
  //     };

  //     stream = await navigator.mediaDevices.getUserMedia(constraints);
  //     video.srcObject = stream;
  //   } catch (error) {
  //     console.error("Error accessing camera:", error);

  //     try {
  //       stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //       video.srcObject = stream;
  //       console.warn("Rear camera not available. Using default camera.");
  //     } catch (fallbackError) {
  //       console.error("Error accessing default camera:", fallbackError);
  //       alert(
  //         "Error accessing camera. Please make sure you have a camera and grant permissions."
  //       );
  //     }
  //   }
  // }

  // getCameraStream();

  // window.addEventListener("beforeunload", () => {
  //   if (stream) {
  //     stream.getTracks().forEach((track) => track.stop());
  //   }
  // });
});

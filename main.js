import * as THREE from "https://cdn.skypack.dev/three"; // Or your desired version
import { GLTFLoader } from "https://unpkg.com/three@0.91.0/examples/js/loaders/GLTFLoader.js";

document.addEventListener("DOMContentLoaded", (event) => {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    canvas.width / canvas.height,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(canvas.width, canvas.height);
  renderer.setPixelRatio(window.devicePixelRatio); // For better pixel quality
  document.body.appendChild(renderer.domElement);

  // Optional: Add lighting (adjust as needed)
  const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Slightly brighter white light
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  // Load GLTF model
  const loader = new GLTFLoader();
  loader.load(`models/bocolla/bocolla.gltf`, (gltf) => {
    // Replace with your model path
    const model = gltf.scene;

    // Center the model (important!)
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.x = -center.x;
    model.position.y = -center.y;
    model.position.z = -center.z;

    scene.add(model);

    // Adjust camera position (after model is loaded and centered)
    camera.position.z = box.getSize(new THREE.Vector3()).z * 1.5; // Example: Position camera based on model size
  });

  let stream;

  async function getCameraStream() {
    try {
      const constraints = {
        video: {
          facingMode: { exact: "environment" },
        },
      };

      stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        console.warn("Rear camera not available. Using default camera.");
      } catch (fallbackError) {
        console.error("Error accessing default camera:", fallbackError);
        alert(
          "Error accessing camera. Please make sure you have a camera and grant permissions."
        );
      }
    }
  }

  getCameraStream();

  window.addEventListener("beforeunload", () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  });
});

import * as THREE from "three"; // Or your desired version
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

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
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  // Improved Lighting
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  // Add a point light to help with visibility.  This is especially useful
  // if your model doesn't have materials or has dark materials.
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(0, 10, 0); // Position above the scene
  scene.add(pointLight);

  // Load GLTF model
  const loader = new GLTFLoader(); // Make sure THREE.GLTFLoader is included

  loader.load(
    "models\bocolla\bocolla.gltf",
    function (gltf) {
      const model = gltf.scene;
      scene.add(model);

      // 1. Position the camera (Crucial!)
      camera.position.z = 5; // Adjust this value as needed
      camera.lookAt(model.position); // Look at the model's center

      // 2. Handle Model Scaling (if necessary)
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3(10, 10, 10));
      const modelScale = Math.max(size.x, size.y, size.z); // Get largest dimension
      if (modelScale > 1) {
        // If model is too big
        model.scale.set(1 / modelScale, 1 / modelScale, 1 / modelScale); // Scale it down
      }

      // 3. Optional: Animations (if the model has them)
      if (gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(model);
        const animation = mixer.clipAction(gltf.animations[0]); // Play the first animation
        animation.play();

        // Store the mixer for use in the animation loop
        model.mixer = mixer; // Add mixer to the model for easy access
      }

      // Render loop (Important!)
      function animate() {
        requestAnimationFrame(animate);

        if (model.mixer) {
          model.mixer.update(0.016); // Update animation mixer (deltaTime ~ 1/60 sec)
        }

        renderer.render(scene, camera);
      }

      animate(); // Start the animation loop
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.error("An error happened loading the model:", error);
    }
  );
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

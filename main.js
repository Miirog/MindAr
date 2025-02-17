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

  // Instantiate a GLTFLoader
  const loader = new GLTFLoader();

  // Load your GLTF model
  loader.load(
    "models/bocolla/bocolla.gltf",
    (gltf) => {
      // Replace with your model path
      const model = gltf.scene; // Get the loaded scene

      // Optional: Scale, position, or rotate the model
      model.scale.set(1, 1, 1); // Example scaling
      model.position.set(0, 0, 0); // Center the model

      scene.add(model); // Add the model to the scene

      // Optional: If your model has animations, you can access and play them:
      if (gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(model); // Create an AnimationMixer
        gltf.animations.forEach((animation) => {
          const action = mixer.clipAction(animation);
          action.play(); // Start playing the animation
        });

        // Update the animation mixer in your animate loop:
        function animate() {
          requestAnimationFrame(animate);
          mixer.update(0.016); // Delta time (adjust as needed)

          renderer.render(scene, camera);
        }
      } else {
        function animate() {
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
        }
      }
      animate();
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded"); // Optional: Show loading progress
    },
    (error) => {
      console.error("An error happened loading the GLTF model:", error);
    }
  );

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

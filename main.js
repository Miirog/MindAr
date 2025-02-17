document.addEventListener("DOMContentLoaded", (event) => {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.setClearColor(0xadd8e6, 0);

  const loader = new THREE.GLTFLoader();

  let model;
  let isRotating = false;
  let previousTouchX = 0;
  let previousTouchY = 0;
  let currentTouchX = 0;
  let currentTouchY = 0;

  // Pinch Gesture Handling
  let touch0StartPosition = null;
  let touch1StartPosition = null;
  let isPinching = false;
  const scaleFactor = 0.01; // Adjust scaling speed
  const minScale = 0.1;
  const maxScale = 5;

  loader.load(
    "models/bocolla/bocolla.gltf",
    (gltf) => {
      model = gltf.scene;
      scene.add(model);
      camera.position.z = 5;

      // Add a directional light that targets the model:
      const directionalLight = new THREE.DirectionalLight(0xffffff, 10); // Increased intensity
      scene.add(directionalLight);

      // Set the light's target to the model (after the model is loaded):
      directionalLight.target = model; // Very important: target the model
      directionalLight.position.set(5, 5, 5); // Adjust light position

      // Optional: Add a helper to visualize the light's direction (for debugging)
      const directionalLightHelper = new THREE.DirectionalLightHelper(
        directionalLight,
        5
      );
      scene.add(directionalLightHelper);

      const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
      scene.add(ambientLight);

      function animate() {
        requestAnimationFrame(animate);

        if (isRotating && model) {
          const deltaX = currentTouchX - previousTouchX;
          const deltaY = currentTouchY - previousTouchY;

          model.rotation.y += deltaX * 0.01; // Rotate around Y-axis (vertical)
          model.rotation.x += deltaY * 0.01; // Rotate around X-axis (horizontal)

          previousTouchX = currentTouchX;
          previousTouchY = currentTouchY;
        }

        renderer.render(scene, camera);
      }

      animate();
    },
    (xhr) => {},
    (error) => {
      console.error("Error loading GLTF:", error);
    }
  );

  document.addEventListener("touchstart", (event) => {
    if (event.touches.length === 1 && model) {
      isRotating = true;
      currentTouchX = event.touches[0].clientX;
      currentTouchY = event.touches[0].clientY;
      previousTouchX = event.touches[0].clientX;
      previousTouchY = event.touches[0].clientY;
    }
  });

  document.addEventListener("touchmove", (event) => {
    if (event.touches.length === 1 && isRotating) {
      currentTouchX = event.touches[0].clientX;
      currentTouchY = event.touches[0].clientY;
    }
  });

  document.addEventListener("touchend", () => {
    isRotating = false;
  });

  // Optional: Mouse Control (for testing on desktop)
  document.addEventListener("mousedown", (event) => {
    isRotating = true;
    previousTouchX = event.clientX;
    previousTouchY = event.clientY;
  });

  document.addEventListener("mousemove", (event) => {
    if (isRotating) {
      const deltaX = event.clientX - previousTouchX;
      const deltaY = event.clientY - previousTouchY;
      model.rotation.y += deltaX * 0.01;
      model.rotation.x += deltaY * 0.01;
      previousTouchX = event.clientX;
      previousTouchY = event.clientY;
    }
  });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  renderer.domElement.addEventListener("touchstart", (event) => {
    if (event.touches.length === 2) {
      touch0StartPosition = new THREE.Vector2(
        event.touches[0].clientX,
        event.touches[0].clientY
      );
      touch1StartPosition = new THREE.Vector2(
        event.touches[1].clientX,
        event.touches[1].clientY
      );
      isPinching = true;
    }
  });

  renderer.domElement.addEventListener("touchmove", (event) => {
    if (isPinching && event.touches.length === 2) {
      const touch0CurrentPosition = new THREE.Vector2(
        event.touches[0].clientX,
        event.touches[0].clientY
      );
      const touch1CurrentPosition = new THREE.Vector2(
        event.touches[1].clientX,
        event.touches[1].clientY
      );

      const currentDistance = touch0CurrentPosition.distanceTo(
        touch1CurrentPosition
      );
      const previousDistance =
        touch0StartPosition.distanceTo(touch1StartPosition);

      const distanceDelta = currentDistance - previousDistance;
      const scaleChange = distanceDelta * scaleFactor;

      let newScale = cube.scale.x + scaleChange; // Scale applied uniformly

      newScale = Math.max(minScale, Math.min(maxScale, newScale)); // Clamp scale

      cube.scale.set(newScale, newScale, newScale);

      touch0StartPosition = touch0CurrentPosition;
      touch1StartPosition = touch1CurrentPosition;
    }
  });

  renderer.domElement.addEventListener("touchend", () => {
    isPinching = false;
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();

  // Handle window resizing
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let stream;

  async function getCameraStream() {
    try {
      // Define constraints for the rear camera
      const constraints = {
        video: {
          facingMode: { exact: "environment" }, // Use "environment" for back/rear camera
        },
      };

      stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);

      // Fallback to the default camera if the rear camera is not available or permission is denied.
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true }); // Default constraints
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

  getCameraStream(); // Call the function to start the camera
});

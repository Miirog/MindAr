document.addEventListener("DOMContentLoaded", (event) => {
  const video = document.getElementById("video");
  const nextButton = document.getElementById("nextObject");
  const previousButton = document.getElementById("previousObject");
  const bottomBox = document.getElementById("bottomBox");

  let currentModel;
  const modelPaths = [
    "models/bocolla/bocolla.gltf",
    "models/clip01/clip_seta01.gltf",
    "models/clip02/clip_seta02.gltf",
    "models/porca_rapida14/porca_rapida-modelo14.gltf",
    "models/porca_rapida27/porca_rapida-modelo27.gltf",
    "models/presilha_de_fogao/presilha_de_fogao.gltf",
  ];
  let currentModelIndex = 0;

  const bottomBoxTexts = [
    {
      title: "Bócolla Oblonga A",
      description1: "Amplo catálogo;",
      description2: "Diversidade de formatos e propriedades;",
    },
    {
      title: "Clip",
      description1: "Versatilidade;",
      description2: "Durabilidade & Segurança;",
    },
    {
      title: "Clip",
      description1: "Versatilidade;",
      description2: "Durabilidade & Segurança;",
    },
    {
      title: "Porca Rápida - 14",
      description1: "Praticidade;",
      description2: "Fácil Instalação;",
    },
    {
      title: "Porca Rápida - 27",
      description1: "Praticidade;",
      description2: "Fácil Instalação;",
    },
    {
      title: "Presilha de Fogão",
      description1: "Essencial no dia-a-dia;",
      description2: "Presente na sua cozinha;",
    },
  ];

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
  renderer.setClearColor(0x09341f, 0.4);

  let initialPinchDistance = null;
  let initialCameraZ = camera.position.z;

  document.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length === 2 && model) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        initialPinchDistance = getDistance(touch1, touch2);
        initialCameraZ = camera.position.z; // Capture current zoom level
      }
    },
    { passive: false }
  );

  document.addEventListener("touchmove", (event) => {
    if (event.touches.length === 2 && initialPinchDistance && model) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const currentPinchDistance = getDistance(touch1, touch2);
      const deltaDistance = currentPinchDistance - initialPinchDistance;

      // Calculate zoom factor (adjust sensitivity)
      const zoomFactor = deltaDistance * 0.01; // Adjust 0.01 for sensitivity

      // Limit zoom (optional)
      const minZoom = 1; // Example minimum zoom
      const maxZoom = 10; // Example maximum zoom

      let newCameraZ = initialCameraZ + zoomFactor;
      newCameraZ = Math.max(minZoom, Math.min(maxZoom, newCameraZ)); // Clamp

      camera.position.z = newCameraZ;

      // Scale the model (alternative to zooming the camera)
      // const scaleFactor = currentPinchDistance / initialPinchDistance;
      // model.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }
  });

  document.addEventListener("touchend", () => {
    initialPinchDistance = null;
  });

  function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

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

  function loadModel(modelPath) {
    if (currentModel) {
      scene.remove(currentModel);
    }

    loader.load(
      modelPath,
      (gltf) => {
        model = gltf.scene;
        scene.add(model);
        camera.position.z = 5;
        currentModel = model;
        bottomBox.querySelector("h2").textContent =
          bottomBoxTexts[currentModelIndex].title;
        bottomBox.querySelector("#description1").textContent =
          bottomBoxTexts[currentModelIndex].description1;
        bottomBox.querySelector("#description2").textContent =
          bottomBoxTexts[currentModelIndex].description2;

        const directionalLight = new THREE.DirectionalLight(0xffffff, 10); // Increased intensity
        scene.add(directionalLight);

        directionalLight.target = model; // Very important: target the model
        directionalLight.position.set(5, 5, 5); // Adjust light position

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
  }

  loadModel(modelPaths[currentModelIndex]);

  previousButton.addEventListener("click", () => {
    currentModelIndex =
      (currentModelIndex - 1 + modelPaths.length) % modelPaths.length; // Wrap around
    loadModel(modelPaths[currentModelIndex]);
  });

  nextButton.addEventListener("click", () => {
    currentModelIndex = (currentModelIndex + 1) % modelPaths.length; // Wrap around
    loadModel(modelPaths[currentModelIndex]);
  });

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

  getCameraStream();
  // Optional: Stop the camera stream when the page is closed or unloaded.
  window.addEventListener("beforeunload", () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  });
});

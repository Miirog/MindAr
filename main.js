document.addEventListener("DOMContentLoaded", (event) => {
  const nextButton = document.getElementById("nextObject");
  const previousButton = document.getElementById("previousObject");
  const model = document.getElementById("model");
  const bottomBox = document.getElementById("bottomBox");
  const aEntity = document.getElementById("a-entity");
  const trackRotation = document.getElementById("trackRotation");
  const background = document.getElementById("background_color");

  nextButton.classList.add("hidden");
  previousButton.classList.add("hidden");
  bottomBox.classList.add("hidden");
  background.classList.add("hidden");

  const modelSources = [
    "models/bocolla/bocolla.gltf",
    "models/clip01/clip_seta01.gltf",
    "models/clip02/clip_seta02.gltf",
    "models/porca_rapida14/porca_rapida-modelo14.gltf",
    "models/porca_rapida27/porca_rapida-modelo27.gltf",
    "models/presilha_de_fogao/presilha_de_fogao.gltf",
  ];

  const bottomBoxTexts = [
    {
      title: "Bócolla",
      description1: "Amplo catálogo ;",
      description2: "Diversidade de formatos e propriedades;",
    },
    {
      title: "Clip - Seta 01",
      description1: "Versatilidade;",
      description2: "Durabilidade & Segurança;",
    },
    {
      title: "Clip - Seta 02",
      description2: "Versatilidade;",
      description2: "Durabilidade & Segurança;",
    },
    {
      title: "Porca Rápida - modelo 14",
      description1: "Praticidade;",
      description2: "Fácil Instalação;",
    },
    {
      title: "Porca Rápida - modelo 27",
      description1: "Praticidade;",
      description2: "Fácil Instalação;",
    },
    {
      title: "Presilha de Fogão",
      description1: "Essencial no dia-a-dia;",
      description2: "Presente na sua cozinha;",
    },
  ];

  let currentModelIndex = 0;

  function updateModel() {
    model.setAttribute("src", modelSources[currentModelIndex]);
    bottomBox.querySelector("h2").textContent =
      bottomBoxTexts[currentModelIndex].title;
    bottomBox.querySelector("#description1").textContent =
      bottomBoxTexts[currentModelIndex].description1;
    bottomBox.querySelector("#description2").textContent =
      bottomBoxTexts[currentModelIndex].description2;
    console.log(`Model source updated to ${modelSources[currentModelIndex]}`);
  }

  nextButton.addEventListener("click", () => {
    currentModelIndex = (currentModelIndex + 1) % modelSources.length;
    updateModel();
  });

  previousButton.addEventListener("click", () => {
    currentModelIndex =
      (currentModelIndex - 1 + modelSources.length) % modelSources.length;
    updateModel();
  });

  let previousTouchX = null;
  let previousTouchY = null;

  function updateRotation(rotation) {
    model.setAttribute("rotation", `${rotation.x} ${rotation.y} ${rotation.z}`);
  }

  let rotation = { x: 0, y: 0, z: 0 };

  trackRotation.addEventListener("touchmove", (event) => {
    const touch = event.touches[0];

    if (previousTouchX !== null && previousTouchY !== null) {
      const movementX = touch.clientX - previousTouchX;
      const movementY = touch.clientY - previousTouchY;

      rotation.y += movementX * 1;
      rotation.x -= movementY * 1;

      updateRotation(rotation);
    }

    previousTouchX = touch.clientX;
    previousTouchY = touch.clientY;
  });

  trackRotation.addEventListener("touchend", () => {
    previousTouchX = null;
    previousTouchY = null;
  });

  let initialDistance = null;
  let initialScale = 0.3; // Initial scale of the model
  const maxScale = 3.0; // Maximum scale
  const minScale = 0.1; // Minimum scale

  function getDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function updateScale(scale) {
    // Ensure the scale stays within the min and max limits
    scale = Math.max(minScale, Math.min(maxScale, scale));
    model.setAttribute("scale", `${scale} ${scale} ${scale}`);
  }

  trackRotation.addEventListener("touchmove", (event) => {
    if (event.touches.length === 2) {
      const currentDistance = getDistance(event.touches);

      if (initialDistance !== null) {
        const scaleChange = currentDistance / initialDistance;
        const newScale = initialScale * scaleChange;
        updateScale(newScale);
      }
    }
  });

  trackRotation.addEventListener("touchstart", (event) => {
    if (event.touches.length === 2) {
      initialDistance = getDistance(event.touches);
      initialScale = parseFloat(model.getAttribute("scale").x);
    }
  });

  trackRotation.addEventListener("touchend", (event) => {
    if (event.touches.length < 2) {
      initialDistance = null;
    }
  });

  aEntity.addEventListener("targetFound", () => {
    nextButton.classList.remove("hidden");
    previousButton.classList.remove("hidden");
    bottomBox.classList.remove("hidden");
    background.classList.remove("hidden");
  });

  aEntity.addEventListener("targetLost", () => {
    nextButton.classList.add("hidden");
    previousButton.classList.add("hidden");
    bottomBox.classList.add("hidden");
    background.classList.add("hidden");
  });

  updateModel();
});

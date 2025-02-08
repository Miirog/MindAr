document.addEventListener("DOMContentLoaded", (event) => {
  const nextButton = document.getElementById("nextObject");
  const previousButton = document.getElementById("previousObject");
  const model = document.getElementById("model");
  const bottomBox = document.getElementById("bottomBox");

  const modelSources = [
    "models/bocolla/bocolla.gltf",
    "models/clip01/clip_seta01.gltf",
    "models/clip02/clip_seta02.gltf",
    "models/porca_rapida14/porca_rapida-modelo14.gltf",
    "models/porca_rapida27/porca_rapida-modelo27.gltf",
    "models/presilha_de_fogao/presilha_de_fogao.gltf",
  ];

  const bottomBoxTexts = [
    { title: "Bócolla", description: "Exemplo 1" },
    { title: "Clip - Seta 01", description: "Exemplo 2" },
    { title: "Clip - Seta 02", description: "Exemplo 3" },
    {
      title: "Porca Rápida - modelo 14",
      description: "Exemplo 3",
    },
    {
      title: "Porca Rápida - modelo 27",
      description: "Exemplo 3",
    },
    { title: "Presilha de Fogão", description: "Exemplo 3" },
  ];

  let currentModelIndex = 0;

  function updateModel() {
    model.setAttribute("src", modelSources[currentModelIndex]);
    bottomBox.querySelector("h2").textContent =
      bottomBoxTexts[currentModelIndex].title;
    bottomBox.querySelector("p").textContent =
      bottomBoxTexts[currentModelIndex].description;
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
  updateModel();
});
//animation="property: position; to: 0 0.1 0.1; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate"
{
  /* <a-plane src="#card" position="0 0 0" height="0.552" width="1" rotation="0 0 0"></a-plane> */
}

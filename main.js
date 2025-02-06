document.addEventListener("DOMContentLoaded", (event) => {
  const nextButton = document.getElementById("nextObject");
  const previousButton = document.getElementById("previousObject");
  const model = document.getElementById("model");
  const modelNameDisplay = document.getElementById("modelNameDisplay"); // Assuming you have an element to display the model name
  const scene = document.querySelector("a-scene");

  let rotation = { x: 0, y: 0, z: 0 };

  if (!model) {
    console.error("Model element not found");
    return;
  }

  // Arrays for model sources and names
  const modelSources = ["models/scene.gltf", "models/new-scene.gltf"];

  const modelNames = ["Scene 1", "Scene 2", "Scene 3"];

  let currentModelIndex = 0;

  // Function to update the model and name
  function updateModel() {
    model.setAttribute("src", modelSources[currentModelIndex]);
    modelNameDisplay.textContent = modelNames[currentModelIndex];
    console.log(`Model source updated to ${modelSources[currentModelIndex]}`);
  }

  // Event listener for the next button
  nextButton.addEventListener("click", () => {
    currentModelIndex = (currentModelIndex + 1) % modelSources.length;
    updateModel();
  });

  // Event listener for the previous button
  previousButton.addEventListener("click", () => {
    currentModelIndex =
      (currentModelIndex - 1 + modelSources.length) % modelSources.length;
    updateModel();
  });

  // Initialize the first model
  updateModel();
});
//animation="property: position; to: 0 0.1 0.1; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate"
{
  /* <a-plane src="#card" position="0 0 0" height="0.552" width="1" rotation="0 0 0"></a-plane> */
}

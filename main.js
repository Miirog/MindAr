document.addEventListener("DOMContentLoaded", (event) => {
  const button = document.getElementById("myButton");
  const model = document.getElementById("model"); // Ensure the model element is selected

  if (!model) {
    console.error("Model element not found");
    return;
  }

  button.addEventListener("click", () => {
    console.log("Button was clicked!");
    // Change the model source
    model.setAttribute("src", "models/new-scene.gltf");
    console.log("Model source updated to models/new-scene.gltf");
  });
});

//animation="property: position; to: 0 0.1 0.1; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate"
{
  /* <a-plane src="#card" position="0 0 0" height="0.552" width="1" rotation="0 0 0"></a-plane> */
}

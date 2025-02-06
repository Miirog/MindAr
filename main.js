document.addEventListener("DOMContentLoaded", (event) => {
  const nextButton = document.getElementById("nextObject");
  const model = document.getElementById("model"); // Ensure the model element is selected

  let rotation = { x: 0, y: 0, z: 0 };

  if (!model) {
    console.error("Model element not found");
    return;
  }

  nextButton.addEventListener("click", () => {
    console.log("Button was clicked!");
    // Change the model source
    model.setAttribute("src", "models/new-scene.gltf");
    console.log("Model source updated to models/new-scene.gltf");
  });

  // Function to update the rotation of the model
  function updateRotation() {
    model.setAttribute("rotation", `${rotation.x} ${rotation.y} ${rotation.z}`);
  }

  // Event listener for mouse movements
  document.addEventListener("mousemove", (event) => {
    const movementX =
      event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const movementY =
      event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    rotation.y += movementX * 0.1; // Adjust the rotation speed as needed
    rotation.x -= movementY * 0.1; // Adjust the rotation speed as needed

    updateRotation();
  });

  // Event listener for touch movements
  document.addEventListener("touchmove", (event) => {
    const touch = event.touches[0];
    const movementX = touch.clientX - touch.screenX;
    const movementY = touch.clientY - touch.screenY;

    rotation.y += movementX * 0.1; // Adjust the rotation speed as needed
    rotation.x -= movementY * 0.1; // Adjust the rotation speed as needed

    updateRotation();
  });
});
//animation="property: position; to: 0 0.1 0.1; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate"
{
  /* <a-plane src="#card" position="0 0 0" height="0.552" width="1" rotation="0 0 0"></a-plane> */
}

document.addEventListener("DOMContentLoaded", (event) => {
  const nextButton = document.getElementById("nextObject");
  const model = document.getElementById("model");
  const scene = document.querySelector("a-scene");

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
  scene.addEventListener("mousemove", (event) => {
    const movementX =
      event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const movementY =
      event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    rotation.y += movementX * 0.1; // Adjust the rotation speed as needed
    rotation.x -= movementY * 0.1; // Adjust the rotation speed as needed

    updateRotation();
  });

  // Variables to keep track of the previous touch positions
  let previousTouchX = null;
  let previousTouchY = null;

  // Event listener for touch movements
  scene.addEventListener("touchmove", (event) => {
    const touch = event.touches[0];

    if (previousTouchX !== null && previousTouchY !== null) {
      const movementX = touch.clientX - previousTouchX;
      const movementY = touch.clientY - previousTouchY;

      rotation.y += movementX * 0.1; // Adjust the rotation speed as needed
      rotation.x -= movementY * 0.1; // Adjust the rotation speed as needed

      updateRotation();
    }

    // Update the previous touch positions
    previousTouchX = touch.clientX;
    previousTouchY = touch.clientY;
  });

  // Reset previous touch positions when touch ends
  scene.addEventListener("touchend", () => {
    previousTouchX = null;
    previousTouchY = null;
  });
});
//animation="property: position; to: 0 0.1 0.1; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate"
{
  /* <a-plane src="#card" position="0 0 0" height="0.552" width="1" rotation="0 0 0"></a-plane> */
}

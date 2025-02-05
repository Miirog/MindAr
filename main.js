document.addEventListener("DOMContentLoaded", (event) => {
  const button = document.getElementById("myButton");
  button.addEventListener("click", () => {
    alert("Button was clicked!");
    console.log("Button Click");
  });
});

//animation="property: position; to: 0 0.1 0.1; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate"

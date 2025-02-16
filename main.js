document.addEventListener("DOMContentLoaded", (event) => {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const capturedImage = document.getElementById("capturedImage");
  let stream;

  async function getCameraStream() {
    try {
      const constraints = {
        video: {
          facingMode: { exact: "environment" },
        },
      };

      stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
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

  window.addEventListener("beforeunload", () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  });
});

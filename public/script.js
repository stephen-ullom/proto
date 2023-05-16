let mainElement;
let zoomLevel = 1;

function init() {
  connect();
  mainElement = document.getElementById("proto");
}

function connect() {
  const socket = new WebSocket("ws://localhost:2000");

  socket.addEventListener("message", (event) => {
    if (mainElement) mainElement.innerHTML = event.data;
    socket.send("Preview updated.");
  });

  socket.addEventListener("close", () => {
    setTimeout(connect, 100);
  });
}

function resetZoom() {
  zoomLevel = 1;
  mainElement.style.zoom = zoomLevel;
}

function zoomIn() {
  zoomLevel += 0.1;
  mainElement.style.zoom = zoomLevel;
}

function zoomOut() {
  zoomLevel -= 0.1;
  mainElement.style.zoom = zoomLevel;
}

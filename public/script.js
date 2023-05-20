let container;
let content;
let zoomLevel = 1;

let initialMouseX = 0;
let initialMouseY = 0;
let initialContainerX = 0;
let initialContainerY = 0;
let grabbing = false;
let spacebarPressed = false;

function init() {
  connect();
  container = document.getElementById("draggable-container");
  content = document.getElementById("content");

  document.addEventListener("keydown", keydown);
  document.addEventListener("keyup", keyup);

  if (container) {
    container.addEventListener("mousedown", startDragging);
    container.addEventListener("mousemove", drag);
    container.addEventListener("mouseup", stopDragging);
  }
}

function connect() {
  const socket = new WebSocket("ws://localhost:2000");

  socket.addEventListener("message", (event) => {
    if (content) content.innerHTML = event.data;
    socket.send("Preview updated.");
  });

  socket.addEventListener("close", () => {
    setTimeout(connect, 100);
  });
}

function resetZoom() {
  zoomLevel = 1;
  container.style.zoom = zoomLevel;
}

function zoomIn() {
  zoomLevel += 0.1;
  container.style.zoom = zoomLevel;
}

function zoomOut() {
  zoomLevel -= 0.1;
  container.style.zoom = zoomLevel;
}

function keydown(event) {
  if (event.key === " ") {
    event.preventDefault();
    spacebarPressed = true;
    setCursor();
  }
}

function keyup(event) {
  if (event.key === " ") {
    spacebarPressed = false;
    setCursor();
  }
}

function startDragging(event) {
  if (spacebarPressed) {
    grabbing = true;
    setCursor();
    initialMouseX = event.clientX;
    initialMouseY = event.clientY;
    initialContainerX = content.offsetLeft * zoomLevel;
    initialContainerY = content.offsetTop * zoomLevel;
  }
}

function drag(event) {
  if (!grabbing) return;
  event.preventDefault();
  const offsetX = event.clientX - initialMouseX;
  const offsetY = event.clientY - initialMouseY;
  const left = initialContainerX + offsetX;
  const top = initialContainerY + offsetY;
  const multiplyer = 1 / zoomLevel;
  content.style.left = `${left * multiplyer}px`;
  content.style.top = `${top * multiplyer}px`;
}

function stopDragging() {
  grabbing = false;
  setCursor();
}

function setCursor() {
  if (grabbing) {
    container.style.cursor = "grabbing";
  } else if (spacebarPressed) {
    container.style.cursor = "grab";
  } else {
    container.style.cursor = "default";
  }
}

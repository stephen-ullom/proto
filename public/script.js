let container;
let content;

let contentScale = 1;
let contentX = 0;
let contentY = 0;

let initialMouseX = 0;
let initialMouseY = 0;
let initialContentX = 0;
let initialContentY = 0;

let isGrabbing = false;
let commandPressed = false;

function init() {
  connect();

  container = document.getElementById("container");
  content = document.getElementById("content");

  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);

  if (container) {
    container.addEventListener("mousedown", startDragging);
    container.addEventListener("mousemove", drag);
    container.addEventListener("mouseup", stopDragging);
    container.addEventListener("wheel", wheel);
  }
}

function keyDown(event) {
  switch (event.key) {
    case "Meta":
      commandPressed = true;
      break;
    case "0":
      if (commandPressed) {
        zoomFit();
      }
      break;
    case "1":
      if (commandPressed) {
        zoomReset();
      }
      break;
  }
}

function keyUp(event) {
  switch (event.key) {
    case "Meta":
      commandPressed = true;
      break;
  }
}

function wheel(event) {
  event.preventDefault();
  const offsetX = event.deltaX;
  const offsetY = event.deltaY;

  contentX -= offsetX;
  contentY -= offsetY;
  updateTransform();
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

function zoomReset() {
  zoom(1);
}

function zoomFit() {
  const scale = container.offsetHeight / content.offsetHeight;

  const centerContainerX = container.offsetWidth / 2;
  const centerContainerY = container.offsetHeight / 2;

  const centerContentX = content.offsetWidth / 2;
  const centerContentY = content.offsetHeight / 2;

  contentScale = scale;
  contentX = centerContainerX - centerContentX * scale;
  contentY = centerContainerY - centerContentY * scale;
  updateTransform();
}

/**
 * Zoom to element with id
 * @param {string} elementId
 */
function zoomTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    const scale = container.offsetHeight / element.offsetHeight;
    const centerContainerX = container.offsetWidth / 2;
    const centerContainerY = container.offsetHeight / 2;

    const elementX = element.offsetLeft;
    const elementY = element.offsetTop;
    const centerElementX = elementX + element.offsetWidth / 2;
    const centerElementY = elementY + element.offsetHeight / 2;

    contentScale = scale;
    contentX = centerContainerX - centerElementX * scale;
    contentY = centerContainerY - centerElementY * scale;
    updateTransform();
  }
}

/**
 * Zoom to a scale value from the center.
 * @param {number} scale
 */
function zoom(scale) {
  scale = Math.min(5, Math.max(0.1, scale));

  const scaleDifference = scale / contentScale;

  const containerCenterX = container.offsetWidth / 2;
  const containerCenterY = container.offsetHeight / 2;

  const newCenterX = (contentX - containerCenterX) * scaleDifference;
  const newCenterY = (contentY - containerCenterY) * scaleDifference;

  const offsetX = newCenterX + containerCenterX;
  const offsetY = newCenterY + containerCenterY;

  contentScale = scale;
  contentX = offsetX;
  contentY = offsetY;
  updateTransform();
}

function zoomIn() {
  zoom(contentScale * 1.2);
}

function zoomOut() {
  zoom(contentScale / 1.2);
}

function updateTransform() {
  // content.style.webkitTransform =
  content.style.transform = `translate(${contentX}px, ${contentY}px) scale(${contentScale})`;
}

function startDragging(event) {
  isGrabbing = true;
  updateCursor();
  initialMouseX = event.clientX;
  initialMouseY = event.clientY;
  initialContentX = contentX;
  initialContentY = contentY;
}

function drag(event) {
  if (!isGrabbing) return;
  event.preventDefault();

  const offsetX = event.clientX - initialMouseX;
  const offsetY = event.clientY - initialMouseY;

  contentX = initialContentX + offsetX;
  contentY = initialContentY + offsetY;
  updateTransform();
}

function stopDragging() {
  isGrabbing = false;
  updateCursor();
}

function updateCursor() {
  if (isGrabbing) {
    container.style.cursor = "grabbing";
  } else {
    container.style.cursor = "grab";
  }
}

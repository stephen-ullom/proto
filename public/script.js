let container;
let content;
let zoomLevel = 1;

let initialMouseX = 0;
let initialMouseY = 0;
let initialContainerX = 0;
let initialContainerY = 0;
let grabbing = false;
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
  zoomLevel = 1;
  content.style.zoom = zoomLevel;
}

function zoomFit() {
  const containerRect = container.getBoundingClientRect();
  const contentRect = content.getBoundingClientRect();
  zoomLevel = containerRect.height / contentRect.height;
  content.style.zoom = zoomLevel;
  content.style.left = "0px";
  content.style.top = "0px";
}

function zoomTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    zoomLevel = containerRect.height / elementRect.height;
    content.style.zoom = zoomLevel - 0.2;
    // content.style.zoom = 1;

    const centerScreenX = container.offsetWidth / 2;
    const centerScreenY = container.offsetHeight / 2;
    const centerElementX = element.offsetWidth / 2;
    const centerElementY = element.offsetHeight / 2;

    const leftOffset = centerScreenX - element.offsetLeft - centerElementX;
    const topOffset = centerScreenY - element.offsetTop - centerElementY;

    content.style.left = `${leftOffset}px`;
    content.style.top = `${topOffset}px`;
  }
}

function zoomIn() {
  if (zoomLevel < 5) {
    zoomLevel += 0.1;
    content.style.zoom = zoomLevel;
  }
}

function zoomOut() {
  if (zoomLevel > 0.1) {
    zoomLevel -= 0.1;
    content.style.zoom = zoomLevel;
  }
}

function startDragging(event) {
  grabbing = true;
  setCursor();
  initialMouseX = event.clientX;
  initialMouseY = event.clientY;
  initialContainerX = content.offsetLeft * zoomLevel;
  initialContainerY = content.offsetTop * zoomLevel;
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
  } else {
    container.style.cursor = "grab";
  }
}

let container;
let content;

let contentScale = 1;
let contentX = 0;
let contentY = 0;

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
  setScale(1);
}

function zoomFit() {
  const containerRect = container.getBoundingClientRect();
  const contentRect = content.getBoundingClientRect();

  const scale = containerRect.height / contentRect.height;
  setScale(scale);

  const centerContainerX = container.offsetWidth / 2;
  const centerContainerY = container.offsetHeight / 2;

  const centerContentX = contentRect.width / 2;
  const centerContentY = contentRect.height / 2;

  const multiplyer = 1 / scale;
  const leftOffset = centerContainerX * multiplyer - centerContentX;
  const topOffset = centerContainerY * multiplyer - centerContentY;

  setPosition(leftOffset, topOffset);
}

function zoomTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    const containerRect = container.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const scale = containerRect.height / elementRect.height;
    setScale(scale);

    const containerCenterX = container.offsetWidth / 2;
    const containerCenterY = container.offsetHeight / 2;

    const elementX = element.offsetLeft;
    const elementY = element.offsetTop;

    const elementCenterX = elementRect.width / 2;
    const elementCenterY = elementRect.height / 2;

    const multiplyer = 1 / scale;
    const leftOffset = containerCenterX * multiplyer - elementX - elementCenterX;
    const topOffset = containerCenterY * multiplyer - elementY - elementCenterY;

    setPosition(leftOffset, topOffset);
  }
}

function zoomIn() {
  setScale(contentScale + 0.1);
}

function zoomOut() {
  setScale(contentScale - 0.1);
}

function setScale(zoom) {
  if (zoom > 0.1 && zoom < 5) {
    contentScale = zoom;
    content.style.zoom = contentScale;
  }
}

function setPosition(left, top) {
  content.style.left = `${left}px`;
  content.style.top = `${top}px`;
}

function startDragging(event) {
  grabbing = true;
  setCursor();
  initialMouseX = event.clientX;
  initialMouseY = event.clientY;
  initialContainerX = content.offsetLeft * contentScale;
  initialContainerY = content.offsetTop * contentScale;
}

function drag(event) {
  if (!grabbing) return;
  event.preventDefault();

  const offsetX = event.clientX - initialMouseX;
  const offsetY = event.clientY - initialMouseY;

  const left = initialContainerX + offsetX;
  const top = initialContainerY + offsetY;
  const multiplyer = 1 / contentScale;
  setPosition(left * multiplyer, top * multiplyer);
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

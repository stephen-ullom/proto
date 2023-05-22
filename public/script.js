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
  contentX = 0;
  contentY = 0;
  setScale(1);
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

function zoomIn() {
  const scale = contentScale + 0.2;
  const scaleDiff = scale / contentScale;

  const containerCenterX = container.offsetWidth / 2;
  const containerCenterY = container.offsetHeight / 2;

  const contentCenterX = contentX - containerCenterX;
  const contentCenterY = contentY - containerCenterY;

  const newOffsetX = containerCenterX * contentScale - containerCenterX * scale;
  const newOffsetY = containerCenterY * contentScale - containerCenterY * scale;

  // const centerX = contentX + viewCenterX;
  // const centerY = contentY + viewCenterY;

  contentScale = scale;
  // contentX = newCenterX + containerCenterX;
  // contentY = newCenterY + containerCenterY;
  contentX = (contentX + containerCenterX) * scaleDiff - containerCenterX;
  contentY = (contentY + containerCenterY) * scaleDiff - containerCenterY;
  updateTransform();

  // const multiplyer = 1 / scale;

  // const containerWidth = container.offsetWidth;
  // const containerHeight = container.offsetHeight;

  // const width = content.offsetWidth * contentScale;
  // const height = content.offsetHeight * contentScale;

  // const left = content.offsetLeft * contentScale;
  // const top = content.offsetTop * contentScale;

  // const newWidth = width * scale;
  // const newHeight = height * scale;

  // const diffWidth = newWidth - width;
  // const diffHeight = newHeight - height;

  // const offsetLeft = (diffWidth * scale) / 2;
  // const offsetTop = (diffHeight * scale) / 2;

  // console.log({ left, originalWidth, newWidth, diffWidth, offsetLeft });
}

function zoomOut() {
  setScale(contentScale - 0.2);
}

function setScale(zoom) {
  if (zoom > 0.1 && zoom < 5) {
    contentScale = zoom;
    updateTransform();
  }
}

function updateTransform() {
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

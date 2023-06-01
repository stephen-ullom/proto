let container;
let content;

let contentScale = 1;
let contentX = 0;
let contentY = 0;

let lastBoard = 0;

let mouseX = 0;
let mouseY = 0;
let initialMouseX = 0;
let initialMouseY = 0;
let initialContentX = 0;
let initialContentY = 0;

let isGrabbing = false;
let commandPressed = false;

let isFirstLoad = true;

function init() {
  connect();

  container = document.getElementById("container");
  content = document.getElementById("content");

  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);
  document.addEventListener("blur", () => {
    commandPressed = false;
    isGrabbing = false;
  });

  if (container) {
    container.addEventListener("mousedown", startDragging);
    container.addEventListener("mousemove", mouseMove);
    container.addEventListener("mouseup", stopDragging);
    container.addEventListener("wheel", wheel);
  }
}

function connect() {
  const socket = new WebSocket("ws://localhost:2000");

  socket.addEventListener("message", (event) => {
    if (content) {
      if (isFirstLoad) {
        isFirstLoad = false;
        const observer = new MutationObserver(() => {
          requestAnimationFrame(() => {
            zoomFit();
          });
          observer.disconnect();
        });
        observer.observe(content, { childList: true });
      }
      content.innerHTML = event.data;
      // socket.send("Preview updated.");
    }
  });

  socket.addEventListener("close", () => {
    setTimeout(connect, 100);
  });
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
    case " ":
      startDragging();
      break;
    case "ArrowLeft":
      if (lastBoard <= 1) {
        lastBoard = 0;
        zoomFit();
      } else {
        zoomToBoard(lastBoard - 1);
      }
      break;
    case "ArrowRight":
      zoomToBoard(lastBoard + 1);
      break;
  }
}

function keyUp(event) {
  switch (event.key) {
    case "Meta":
      commandPressed = false;
      break;
    case " ":
      stopDragging();
      break;
  }
}

function wheel(event) {
  event.preventDefault();
  const offsetX = event.deltaX;
  const offsetY = event.deltaY;

  if (commandPressed) {
    // Zoom canvas
    zoom(contentScale - (offsetX + offsetY) / 400);
  } else {
    // Move canvas
    contentX -= offsetX;
    contentY -= offsetY;
    updateTransform();
  }
}

function zoomReset() {
  zoom(1);
}

function zoomFit() {
  const width = container.offsetWidth / content.offsetWidth;
  const height = container.offsetHeight / content.offsetHeight;
  const scale = Math.min(width, height);

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

function zoomToBoard(boardNumber) {
  lastBoard = boardNumber;
  zoomTo(`board${boardNumber}`);
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
  content.style.webkitTransform =
    content.style.transform = `translate(${contentX}px, ${contentY}px) scale(${contentScale})`;
}

function startDragging() {
  isGrabbing = true;
  updateCursor();

  initialMouseX = mouseX;
  initialMouseY = mouseY;
  initialContentX = contentX;
  initialContentY = contentY;
}

function mouseMove(event) {
  event.preventDefault();

  mouseX = event.clientX;
  mouseY = event.clientY;

  if (isGrabbing) {
    const offsetX = mouseX - initialMouseX;
    const offsetY = mouseY - initialMouseY;

    contentX = initialContentX + offsetX;
    contentY = initialContentY + offsetY;
    updateTransform();
  }
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

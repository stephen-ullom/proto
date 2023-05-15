function connect() {
  const socket = new WebSocket("ws://localhost:2000");

  socket.addEventListener("message", (event) => {
    const mainElement = document.getElementById("proto");
    if (mainElement) mainElement.innerHTML = event.data;
    socket.send("Preview updated.");
  });

  socket.addEventListener("close", () => {
    setTimeout(connect, 100);
  });
}

connect();

const eventSource = new EventSource("http://localhost:2000");

eventSource.onmessage = (event) => {
  console.log("Preview updated.");
  const html = event.data;
  const mainElement = document.getElementById("proto");
  if (mainElement) mainElement.innerHTML = html;
};

eventSource.onerror = (error) => {
  console.log("Loading preview...");
};

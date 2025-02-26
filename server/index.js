const WebSocket = require("ws");
const PORT = 8080;

const wss = new WebSocket.Server({ port: PORT });

// List of all connected clients
let clients = [];

// When a new client connects
wss.on("connection", (ws) => {
  console.log("Client connected");
  clients.push(ws);

  // Broadcast messages to all other clients except the sender
  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`${message}`);
      }
    });
  });

  // Remove the client from the list when it disconnects
  ws.on("close", (event) => {
    console.log("Client disconnected", { closeCode: event?.closeCode });
    clients = clients.filter((client) => client !== ws);
  });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);

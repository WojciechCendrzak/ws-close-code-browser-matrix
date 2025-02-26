const WebSocket = require("ws");
require("dotenv").config();
const PORT = process.env.PORT;

console.log("PORT", PORT);

const wss = new WebSocket.Server({ port: PORT });

// List of all connected clients
let clients = [];

// When a new client connects
wss.on("connection", (ws) => {
  console.log("Client connected");
  const client = { ws };
  clients.push(client);

  // Broadcast messages to all other clients except the sender
  ws.on("message", (message) => {
    const { type, payload } = JSON.parse(message);
    console.log(`Received message`, { type, payload });

    if (type === "browser-data") {
      client.browserInfo = payload;
      updateBrowser(payload);
    }

    if (type === "get-all-browser-data") {
      const allBrowserData = Array.from(browsers.values());
      ws.send(
        JSON.stringify({ type: "all-browser-data", payload: allBrowserData })
      );
    }
  });

  // Remove the client from the list when it disconnects
  ws.on("close", (closeCode) => {
    console.log("Client disconnected", { closeCode });
    clients = clients.filter((c) => client !== c);

    if (client.browserInfo) {
      const { closingTabMode } = client.browserInfo;
      const closeCodeOnRefresh = closingTabMode ? undefined : closeCode;
      const closeCodeOnClose = closingTabMode ? closeCode : undefined;
      updateBrowser(client.browserInfo, closeCodeOnRefresh, closeCodeOnClose);
    }
  });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);

const getBrowserId = (browserName, browserVersion, osName, osVersion) => {
  return `${browserName}-${browserVersion}-${osName}-${osVersion}`;
};

const updateBrowser = (browserInfo, closeCodeOnRefresh, closeCodeOnClose) => {
  const browserId = getBrowserId(
    browserInfo.browserName,
    browserInfo.browserVersion,
    browserInfo.osName,
    browserInfo.osVersion
  );

  const existingBrowser = browsers.get(browserId);

  browsers.set(browserId, {
    ...browserInfo,
    closeCodeOnRefresh:
      closeCodeOnRefresh || existingBrowser?.closeCodeOnRefresh,
    closeCodeOnClose: closeCodeOnClose || existingBrowser?.closeCodeOnClose,
  });

  console.log("browser data", { browsers });
};

const browsers = new Map();

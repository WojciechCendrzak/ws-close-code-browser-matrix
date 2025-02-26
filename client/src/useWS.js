import { useEffect, useRef, useCallback, useState } from "react";

const VITE_WS_SERVER_URL = import.meta.env.VITE_WS_SERVER_URL;
console.log("VITE_WS_SERVER_URL", VITE_WS_SERVER_URL);

export const useWS = ({ onMessage }) => {
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ws = new WebSocket(VITE_WS_SERVER_URL);
    const handleOpen = () => {
      setLoading(false);
      console.log("Connected to WebSocket server");
    };

    const handleClose = (code) => {
      console.log("Disconnected from WebSocket server", { code });
    };

    const handleMessage = (event) => {
      onMessageRef.current(event.data);
      console.log("Received message", { data: JSON.parse(event.data) });
    };

    console.log("Adding event listeners");
    ws.addEventListener("open", handleOpen);
    ws.addEventListener("close", handleClose);
    ws.addEventListener("message", handleMessage);

    return () => {
      console.log("Removing event listeners");
      ws.removeEventListener("open", handleOpen);
      ws.removeEventListener("message", handleMessage);
    };
  }, []);

  const sendMessage = useCallback((message) => {
    console.log(`Sending message: ${message}`);
    ws?.send(message);
  }, []);

  return { sendMessage, loading };
};

let ws;

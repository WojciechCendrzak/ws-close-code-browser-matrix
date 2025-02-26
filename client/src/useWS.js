import { useEffect, useRef, useCallback, useState } from "react";

export const useWS = ({ onMessage }) => {
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOpen = () => {
      setLoading(false);
      console.log("Connected to WebSocket server");
    };

    const handleMessage = (event) => {
      onMessageRef.current(event.data);
      console.log("Received message", { data: JSON.parse(event.data) });
    };

    ws.addEventListener("open", handleOpen);
    ws.addEventListener("message", handleMessage);

    return () => {
      console.log("Removing event listeners");
      ws.removeEventListener("open", handleOpen);
      ws.removeEventListener("message", handleMessage);
    };
  }, []);

  const sendMessage = useCallback((message) => {
    ws.send(message);
    console.log(`Sent: ${message}`);
  }, []);

  return { sendMessage, loading };
};

let ws = new WebSocket("ws://localhost:8080");

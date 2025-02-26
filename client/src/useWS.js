import { useEffect, useRef, useCallback } from "react";
import { isStudent } from "./isStudent";

export const useWS = ({ onMessage }) => {
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    const handleOpen = () => {
      console.log("Connected to WebSocket server");
    };

    const handleMessage = (event) => {
      onMessageRef.current(event.data);
        console.log("Received message", event.data);
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
    if (isStudent()) {
      return;
    }

    ws.send(message);
    console.log(`Sent: ${message}`);
  }, []);

  return { sendMessage };
};

let ws = new WebSocket("ws://localhost:8080");

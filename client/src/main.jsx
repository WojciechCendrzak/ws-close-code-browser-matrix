import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import { App } from "./App.jsx";

console.log("--------------------------------");
console.log("Client version: 1.2");
console.log("--------------------------------");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

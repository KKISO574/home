import React from "react";
import { createRoot } from "react-dom/client";
import "animal-island-ui/style";
import "./styles/island-home.css";
import App from "./App.jsx";

createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    console.info("站点已更新，刷新后生效");
  });
}

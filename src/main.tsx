import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Make sure your HTML has: <div id="root"></div>
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("❌ Failed to find the root element.");
  throw new Error("No root element found. Did you forget <div id='root'> in index.html?");
}

const root = ReactDOM.createRoot(rootElement);

console.log("🚀 Rendering SporeZ App...");

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

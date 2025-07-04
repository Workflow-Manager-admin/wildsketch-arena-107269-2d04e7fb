import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Remounting React 18 root API
const container = document.getElementById("root");
createRoot(container).render(<App />);

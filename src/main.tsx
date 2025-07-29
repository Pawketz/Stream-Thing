import React from "react";
import ReactDOM from "react-dom/client";
import OBSControllerApp from "./components/OBSControllerApp";
import defaultSettings from '../config/defaultSettings';

import "./index.css";

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <OBSControllerApp />
    </React.StrictMode>
  );
}

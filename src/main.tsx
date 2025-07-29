import React from "react";
import ReactDOM from "react-dom/client";
import { DeskThing } from '@deskthing/client'

import OBSControllerApp from "./components/OBSControllerApp";

import "./index.css";



const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <OBSControllerApp />
    </React.StrictMode>
  );
}

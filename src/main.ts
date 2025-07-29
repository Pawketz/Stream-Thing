// import { createDeskThing } from '@deskthing/client'
import { createDeskThing } from "@deskthing/client";
import React from "react";
import ReactDOM from "react-dom/client";
import OBSControllerApp from "./components/OBSControllerApp";
import "./index.css";

const DeskThing = createDeskThing();

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <OBSControllerApp />
    </React.StrictMode>
  );
}



const startup = async () => {
  const manifest = await DeskThing.getManifest();
  console.log("Got the manifest ", manifest);
  console.log(
    `Connected to ${manifest?.context.ip || ""}:${manifest?.context.port || ""}`
  );

};

startup();


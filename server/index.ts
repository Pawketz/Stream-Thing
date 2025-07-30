// server
import {
  AppSettings,
  DESKTHING_EVENTS,
  SETTING_TYPES,
} from "@deskthing/types";
import obsStore from "./obsStore";
import { DeskThing } from '@deskthing/server';
import { setupSettings } from './setupSettings';
import './obsController'; // Integrate OBS controller backend
import { createLogger } from "vite";

const startup = async () => {
  console.log("Inside startup function in index.ts");
  await obsStore.connect(); // Connect to OBS when DeskThing starts
  console.log("Connected to OBS:", obsStore.isConnected());
  await setupSettings();
}

// Create a singleton instance of obsStore
// const obsStoreInstance = new obsStore();

DeskThing.on(DESKTHING_EVENTS.SETTINGS, (settings) => {
  if (settings && settings.payload) {
    const host = settings.payload.host.value?.toString() ?? "";
    const port = Number(settings.payload.port.value);
    const password = settings.payload.password.value?.toString() ?? "";

    // Basic validation
    if (!host || isNaN(port) || port <= 0) {
      console.error("Invalid OBS connection settings:", { host, port });
      return;
    }

    console.debug("Settings updating:", { host, port });
    obsStore.setHost(host);
    obsStore.setPort(port);
    obsStore.setPassword(password);
  } else {
    console.warn("Settings payload is missing");
  }
});

const stop = () => {
    console.log('Stopping app');
    obsStore.disconnect(); // Disconnect OBS when DeskThing stops
    console.log('OBS Instance stopped');
}

const purge = () => {
    console.log('Purging app');
    obsStore.disconnect(); // Disconnect OBS when DeskThing stops
    console.log('OBS Instance stopped');
}


// Ideally, all of your code logic is held within the Startup function. Anything outside of this function wont reliably run
DeskThing.on(DESKTHING_EVENTS.START, startup);
DeskThing.on(DESKTHING_EVENTS.STOP, stop);
DeskThing.on(DESKTHING_EVENTS.PURGE, purge);
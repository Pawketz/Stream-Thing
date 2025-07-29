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

const startup = async () => {
   await setupSettings();
}

// Create a singleton instance of obsStore
// const obsStoreInstance = new obsStore();

DeskThing.on(DESKTHING_EVENTS.SETTINGS, (settings) => {
  // Syncs the data with the server
  if (settings && settings.payload) {
    console.debug("Settings updating");
    // Ensure host is a string
    obsStore.setHost(settings.payload.host.value?.toString() ?? "");
    obsStore.setPort(Number(settings.payload.port.value));
    obsStore.setPassword(settings.payload.password.value?.toString() ?? "");
    // You can also update port and password here if needed:
    // if (settings.payload.port !== undefined) obsStoreInstance.setPort(Number(settings.payload.port));
    // if (settings.payload.password !== undefined) obsStoreInstance.setPassword(settings.payload.password?.toString() ?? "");
  } else {
    console.warn("Settings payload is missing");
  }
});

const stop = () => {
    DeskThing.send({ type: 'log', payload: 'Stopping app' }); // i see several things sending type: 'log' - if this is for normal logging, try just doing `console.log()` instead as it's treated the same way
}

const purge = () => {
    DeskThing.send({ type: 'log', payload: 'Purging app' });
}


// Ideally, all of your code logic is held within the Startup function. Anything outside of this function wont reliably run
DeskThing.on(DESKTHING_EVENTS.START, startup);
DeskThing.on(DESKTHING_EVENTS.STOP, stop);
DeskThing.on(DESKTHING_EVENTS.PURGE, purge);
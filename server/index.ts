// server
import {
  AppSettings,
  DESKTHING_EVENTS,
  SETTING_TYPES,
} from "@deskthing/types";
import { obsStore } from "./obsStore";
import { DeskThing } from '@deskthing/server';
import { setupSettings } from './setupSettings';
import './obsController'; // Integrate OBS controller backend

const startup = async () => {
   await setupSettings();
}

// Create a singleton instance of obsStore
const obsStoreInstance = new obsStore();

DeskThing.on(DESKTHING_EVENTS.SETTINGS, (settings) => {
  // Syncs the data with the server
  if (settings && settings.payload) {
    console.debug("Settings updating");
    // Ensure host is a string
    obsStoreInstance.setHost(settings.payload.host.value?.toString() ?? "");
    obsStoreInstance.setPort(Number(settings.payload.port.value));
    obsStoreInstance.setPassword(settings.payload.password?.toString() ?? "");
    // You can also update port and password here if needed:
    // if (settings.payload.port !== undefined) obsStoreInstance.setPort(Number(settings.payload.port));
    // if (settings.payload.password !== undefined) obsStoreInstance.setPassword(settings.payload.password?.toString() ?? "");
  }
});

const stop = () => {
    DeskThing.send({ type: 'log', payload: 'Stopping app' });
}

const purge = () => {
    DeskThing.send({ type: 'log', payload: 'Purging app' });
}


// Ideally, all of your code logic is held within the Startup function. Anything outside of this function wont reliably run
DeskThing.on('start', startup);
DeskThing.on('stop', stop);
DeskThing.on('purge', purge);
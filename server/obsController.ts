// OBS Controller Backend for DeskThing
// Requires: npm install obs-websocket-js

import { createDeskThing } from '@deskthing/server';
import OBSWebSocket from 'obs-websocket-js';
import defaultSettings from '../src/stores/defaultSettings.js';
import { OBSToClient, OBSToServer } from './deskthingTypes.js';
import { DESKTHING_EVENTS } from '@deskthing/types';
import obsStore from './obsStore.js';

// This is done in the emulator for development. See deskthing.config.js
// dotenv.config(); // Load environment variables from .env file   

const obs = new OBSWebSocket();

const DeskThing = createDeskThing<OBSToServer, OBSToClient>();

// OBS connection config
const OBS_HOST = /* process.env.OBS_HOST  || */ defaultSettings.host.value;
const OBS_PORT = /* process.env.OBS_PORT  || */ defaultSettings.port.value;
const OBS_PASSWORD = /* process.env.OBS_PASSWORD  || */ defaultSettings.password.value;

// setup the obsStore values with the default - once you get in here, I would change this to happen within the obsStore inside the constructor
// I have it defined here so you can see what it's doing - but I wouldn't recommend it
obsStore.setHost(OBS_HOST);
obsStore.setPort(OBS_PORT);
obsStore.setPassword(OBS_PASSWORD);


// While this works, i would "own" the obs object inside the obsStore - and then when the settings are updated from deskthing, try to authenticate. This way we can keep track of auth status as well as update things as needed
async function connectOBS() {
  try {
    const port = obsStore.getPort();
    const host = obsStore.getHost();
    const password = obsStore.getPassword();

    console.log(`Connecting to OBS WebSocket at ws://${host}:${port} with password ${password ? 'set' : 'not set'}`);
    await obs.connect(`ws://${host}:${port}`, password);
    DeskThing.send({ type: 'log', payload: `Connected to OBS WebSocket ws://${host}:${port}` });
  } catch (err) {
    DeskThing.send({ type: 'log', payload: 'Failed to connect to OBS: ' + (err instanceof Error ? err.message : err.toString()) });
    console.log(err)

    setTimeout(connectOBS, 5000); // Retry after 5s
  }
}

// I get the feeling this should be inside the deskthing.start() callback rather than surface level - otherwise this will never be disconnected
connectOBS();

// DeskThing event: Get scenes
DeskThing.on('getScenes', async (data) => {
  try {
    const { scenes, currentProgramSceneName } = await obs.call('GetSceneList');
    DeskThing.send({ type: 'scenes', payload: { scenes, current: currentProgramSceneName } });
  } catch (err) {
    DeskThing.send({ type: 'log', payload: 'Failed to get scenes: ' + err });
  }
});

// DeskThing event: Switch scene
DeskThing.on('switchScene', async (data) => {
  try {
    const sceneName = data.payload?.sceneName;
    if (sceneName) {
      await obs.call('SetCurrentProgramScene', { sceneName });
      DeskThing.send({ type: 'sceneSwitched', payload: { sceneName } });
    }
  } catch (err) {
    DeskThing.send({ type: 'log', payload: 'Failed to switch scene: ' + err });
  }
});

// DeskThing event: Get sources
DeskThing.on('getSources', async () => {
  try {
    const { inputs } = await obs.call('GetInputList');
    DeskThing.send({ type: 'sources', payload: inputs });
  } catch (err) {
    DeskThing.send({ type: 'log', payload: 'Failed to get sources: ' + err });
  }
});

// DeskThing event: Toggle source visibility
DeskThing.on('toggleSource', async (data) => {
  try {
    const { sourceName, visible } = data.payload;
    await obs.call('SetInputSettings', { inputName: sourceName, inputSettings: { visible } });
    DeskThing.send({ type: 'sourceToggled', payload: { sourceName, visible } });
  } catch (err) {
    DeskThing.send({ type: 'log', payload: 'Failed to toggle source: ' + err });
  }
});

// DeskThing event: Get audio mixer
DeskThing.on('getAudio', async () => {
  try {
    const { inputs } = await obs.call('GetInputList');

    // Check that it is an array before using 'includes' to avoid an error
    const audioInputs = inputs.filter(i => i.inputKind && Array.isArray(i.inputKind) && i.inputKind.includes('audio'))
    const audioStatus = await Promise.all(audioInputs.map(async input => {

      if (typeof input.inputName != 'string') return // skip over cases where it is not a string

      // I'm getting a TS error that inputVolume and inputMuted might not exist. Instead, there is { inputVolumeMul: number; inputVolumeDb: number; } - I'm leaving it as this for the time being
      const { inputVolume, inputMuted } = await obs.call('GetInputVolume', { inputName: input.inputName.toString() });
      return { name: input.inputName.toString(), volume: inputVolume, muted: inputMuted };
    }).filter(Boolean)) as {
      name: string;
      volume: any;
      muted: any;
    }[] // filter(Boolean) removes undefiend but doesn't correctly tell TS that it does, so we need to assert that there are no undefined values in the array

    DeskThing.send({ type: 'audioMixer', payload: audioStatus });
  } catch (err) {
    DeskThing.send({ type: 'log', payload: 'Failed to get audio mixer: ' + err });
  }
});

// DeskThing event: Set audio volume/mute
DeskThing.on('setAudio', async (data) => {
  try {
    const { inputName, volume, muted } = data.payload;
    if (typeof volume === 'number') {
      await obs.call('SetInputVolume', { inputName, inputVolume: volume });
    }
    if (typeof muted === 'boolean') {
      await obs.call('SetInputMute', { inputName, inputMute: muted });
    }
    DeskThing.send({ type: 'audioSet', payload: { inputName, volume, muted } });
  } catch (err) {
    DeskThing.send({ type: 'log', payload: 'Failed to set audio: ' + err });
  }
});

// DeskThing event: Get streaming/recording status
DeskThing.on('getStatus', async () => {
  try {
    const { outputActive: streaming } = await obs.call('GetStreamStatus');
    const { outputActive: recording } = await obs.call('GetRecordStatus');
    DeskThing.send({ type: 'status', payload: { streaming, recording } });
  } catch (err) {
    DeskThing.send({ type: 'log', payload: 'Failed to get status: ' + err });
  }
});

// DeskThing event: Start/stop streaming/recording
DeskThing.on('setStreaming', async (data) => {
  try {
    const { streaming, recording } = data.payload;
    if (typeof streaming === 'boolean') {
      await obs.call(streaming ? 'StartStream' : 'StopStream');
    }
    if (typeof recording === 'boolean') {
      await obs.call(recording ? 'StartRecord' : 'StopRecord');
    }
    DeskThing.send({ type: 'statusSet', payload: { streaming, recording } });
  } catch (err) {
    DeskThing.send({ type: 'log', payload: 'Failed to set streaming/recording: ' + err });
  }
});

// TODO: Add preview image sending if feasible

DeskThing.on(DESKTHING_EVENTS.START, () => {
  DeskThing.send({ type: 'log', payload: 'OBS Controller App Started' });
});

DeskThing.on(DESKTHING_EVENTS.STOP, () => {
  DeskThing.send({ type: 'log', payload: 'OBS Controller App Stopped' });
  obs.disconnect();
});

DeskThing.on(DESKTHING_EVENTS.PURGE, () => {
  DeskThing.send({ type: 'log', payload: 'OBS Controller App Purged' });
  obs.disconnect();
});

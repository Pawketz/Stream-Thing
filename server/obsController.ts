// OBS Controller Backend for DeskThing
// Requires: npm install obs-websocket-js

import { DeskThing } from '@deskthing/server';
import OBSWebSocket from 'obs-websocket-js';
import dotenv from 'dotenv';
import defaultSettings from '../src/stores/defaultSettings.js';

dotenv.config(); // Load environment variables from .env file   

const obs = new OBSWebSocket();

// OBS connection config
const OBS_HOST = process.env.OBS_HOST || defaultSettings.host.value;
const OBS_PORT = process.env.OBS_PORT || defaultSettings.port.value;
const OBS_PASSWORD = process.env.OBS_PASSWORD || defaultSettings.password.value;

async function connectOBS() {
  try {
    await obs.connect(`ws://${OBS_HOST}:${OBS_PORT}`, OBS_PASSWORD);
    DeskThing.send({ type: 'log', payload: `Connected to OBS WebSocket ws://${OBS_HOST}:${OBS_PORT}` });
  } catch (err) {
    DeskThing.send({ type: 'log', payload: 'Failed to connect to OBS: ' + err });
    setTimeout(connectOBS, 5000); // Retry after 5s
  }
}

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
    const { sources } = await obs.call('GetInputList');
    DeskThing.send({ type: 'sources', payload: sources });
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
    const audioInputs = inputs.filter(i => i.inputKind && i.inputKind.includes('audio'));
    const audioStatus = await Promise.all(audioInputs.map(async input => {
      const { inputVolume, inputMuted } = await obs.call('GetInputVolume', { inputName: input.inputName });
      return { name: input.inputName, volume: inputVolume, muted: inputMuted };
    }));
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

DeskThing.on('start', () => {
  DeskThing.send({ type: 'log', payload: 'OBS Controller App Started' });
});

DeskThing.on('stop', () => {
  DeskThing.send({ type: 'log', payload: 'OBS Controller App Stopped' });
  obs.disconnect();
});

DeskThing.on('purge', () => {
  DeskThing.send({ type: 'log', payload: 'OBS Controller App Purged' });
  obs.disconnect();
});

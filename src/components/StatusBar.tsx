import React, { useEffect, useState } from 'react';
import { createDeskThing } from '@deskthing/client';
import '../index.css';

const DeskThing = createDeskThing();

export default function StatusBar() {
  const [status, setStatus] = useState({ streaming: false, recording: false });

  useEffect(() => {
    DeskThing.send({ type: 'getStatus', payload: {} });
    const off = DeskThing.on('status', (data) => {
      setStatus(data.payload || { streaming: false, recording: false });
    });
    return off;
  }, []);

  const setStreaming = (streaming: boolean) => {
    DeskThing.send({ type: 'setStreaming', payload: { streaming: !streaming } });
    setStatus(s => ({ ...s, streaming: !streaming }));
  };

  const setRecording = (recording: boolean) => {
    DeskThing.send({ type: 'setStreaming', payload: { recording: !recording } });
    setStatus(s => ({ ...s, recording: !recording }));
  };

  return (
    <div className="status-bar">
      <h2>Status & Controls</h2>
      <div className="status-controls">
        <button
          className={status.streaming ? 'active' : ''}
          onClick={() => setStreaming(status.streaming)}
        >
          {status.streaming ? 'Stop Streaming' : 'Start Streaming'}
        </button>
        <button
          className={status.recording ? 'active' : ''}
          onClick={() => setRecording(status.recording)}
        >
          {status.recording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
      <div className="status-indicators">
        <span className={status.streaming ? 'indicator on' : 'indicator off'}>
          Streaming: {status.streaming ? 'ON' : 'OFF'}
        </span>
        <span className={status.recording ? 'indicator on' : 'indicator off'}>
          Recording: {status.recording ? 'ON' : 'OFF'}
        </span>
      </div>
    </div>
  );
}

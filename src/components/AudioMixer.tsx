import React, { useEffect, useState } from 'react';
import { createDeskThing } from '@deskthing/client';
import '../index.css';

const DeskThing = createDeskThing();

export default function AudioMixer() {
  const [audio, setAudio] = useState<any[]>([]);

  useEffect(() => {
    DeskThing.send({ type: 'getAudio', payload: {} });
    const off = DeskThing.on('audioMixer', (data) => {
      setAudio(data.payload || []);
    });
    return off;
  }, []);

  const setVolume = (name: string, volume: number) => {
    DeskThing.send({ type: 'setAudio', payload: { inputName: name, volume } });
    setAudio(audio => audio.map(a => a.name === name ? { ...a, volume } : a));
  };

  const setMute = (name: string, muted: boolean) => {
    DeskThing.send({ type: 'setAudio', payload: { inputName: name, muted: !muted } });
    setAudio(audio => audio.map(a => a.name === name ? { ...a, muted: !muted } : a));
  };

  return (
    <div className="audio-mixer">
      <h2>Audio Mixer</h2>
      <ul>
        {audio.map(a => (
          <li key={a.name}>
            <span>{a.name}</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={a.volume}
              onChange={e => setVolume(a.name, Number(e.target.value))}
            />
            <button
              className={a.muted ? 'muted' : 'unmuted'}
              onClick={() => setMute(a.name, a.muted)}
            >
              {a.muted ? 'Unmute' : 'Mute'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

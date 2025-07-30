import React, { useEffect, useState } from 'react';
import { createDeskThing } from '@deskthing/client';
import '../index.css';
import { OBSToClient, OBSToServer } from '../types/deskthingTypes';

const DeskThing = createDeskThing<OBSToClient, OBSToServer>();

export default function SceneGrid() {
  const [scenes, setScenes] = useState<any[]>([]);
  const [current, setCurrent] = useState<string>('');

  useEffect(() => {
    DeskThing.send({ type: 'getScenes', payload: {} });
    const off = DeskThing.on('scenes', (data) => {
      setScenes(data.payload.scenes || []);
      setCurrent(data.payload.current || '');
    });
    return off;
  }, []);

  const switchScene = (sceneName: string) => {
    DeskThing.send({ type: 'switchScene', payload: { sceneName } });
    setCurrent(sceneName);
  };

  return (
    <div className="scene-grid">
      <h2 className="scene-title">Scenes</h2>
      <div className="scene-grid-list">
        {scenes.map(scene => (
          <button
            key={scene.sceneName}
            className={`scene-btn${scene.sceneName === current ? ' active' : ''}`}
            onClick={() => switchScene(scene.sceneName)}
          >
            {scene.sceneName}
          </button>
        ))}
      </div>
    </div>
  );
}

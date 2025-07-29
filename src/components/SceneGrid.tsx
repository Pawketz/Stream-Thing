import React, { useEffect, useState } from 'react';
import { createDeskThing } from '@deskthing/client';
import '../index.css';

const DeskThing = createDeskThing();

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
      <h2>Scenes</h2>
      <div className="grid">
        {scenes.map(scene => (
          <button
            key={scene.sceneName}
            className={scene.sceneName === current ? 'active' : ''}
            onClick={() => switchScene(scene.sceneName)}
          >
            {scene.sceneName}
          </button>
        ))}
      </div>
    </div>
  );
}

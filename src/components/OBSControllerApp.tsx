import React, { useState } from 'react';
import SceneGrid from './SceneGrid';
import SourceControls from './SourceControls';
import AudioMixer from './AudioMixer';
import StatusBar from './StatusBar';
import '../index.css';

const panels = [
  { id: 'scenes', label: 'Scenes', component: SceneGrid },
  { id: 'sources', label: 'Sources', component: SourceControls },
  { id: 'audio', label: 'Audio Mixer', component: AudioMixer },
  { id: 'status', label: 'Status/Controls', component: StatusBar },
];

export default function OBSControllerApp() {
  const [activePanel, setActivePanel] = useState('scenes');

  const PanelComponent = panels.find(p => p.id === activePanel)?.component || SceneGrid;

  return (
    <div className="obs-app-root">
      <nav className="obs-nav">
        {panels.map(panel => (
          <button
            key={panel.id}
            className={activePanel === panel.id ? 'active' : ''}
            onClick={() => setActivePanel(panel.id)}
          >
            {panel.label}
          </button>
        ))}
      </nav>
      <main className="obs-panel">
        <PanelComponent />
      </main>
    </div>
  );
}

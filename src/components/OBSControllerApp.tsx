import { useState, useEffect } from 'react';
import SceneGrid from './SceneGrid';
import SourceControls from './SourceControls';
import AudioMixer from './AudioMixer';
import StatusBar from './StatusBar';
import { OBSToClient, OBSToServer } from '../types/deskthingTypes';
import { createDeskThing } from '@deskthing/client';
import '../index.css';

const panels = [
  { id: 'scenes', label: 'Scenes', component: SceneGrid },
  { id: 'sources', label: 'Sources', component: SourceControls },
  { id: 'audio', label: 'Audio Mixer', component: AudioMixer },
  { id: 'status', label: 'Status/Controls', component: StatusBar },
];

// enum EventMode {
//   KeyDown = 'keydown',
//   KeyUp = 'keyup'
// }



// const DeskThing = createDeskThing<OBSToClient, OBSToServer>();



export default function OBSControllerApp() {
  const [activePanel, setActivePanel] = useState('scenes');

  const PanelComponent = panels.find(p => p.id === activePanel)?.component || SceneGrid;

  // useEffect(() => {

  //   DeskThing.overrideKeys(["Space", "wheel", "enter"]);

  //   const handleKeyPress = (event: KeyboardEvent) => {
  //     DeskThing.debug('Stopping default key behavior');
  //     event.preventDefault();
  //     DeskThing.triggerKey({ key: 'Tab', mode: 'keydown' });
  //     DeskThing.debug('Key event has been logged' );

  //   };
    
  //   const handleWheel = (event: WheelEvent) => {
  //     DeskThing.debug('Stopping default wheel behavior');
  //     event.stopPropagation();
  //     event.preventDefault();
  //     DeskThing.debug('WHEEL EVENT HAS BEEN LOGGED');
  //     DeskThing.triggerKey({ key: 'Tab', mode: EventMode.KeyDown });

  //   }

  //   window.addEventListener("keydown", handleKeyPress);
  //   window.addEventListener("wheel", handleWheel);

  //   return () => {
  //     DeskThing.restoreKeys(["Space", "wheel", "enter"]);
  //     window.removeEventListener("keydown", handleKeyPress);
  //     window.removeEventListener("wheel", handleWheel);
  //   };
  // }, []);

  return (
    <div className="obs-app-root">
      <main className="obs-panel">
        <PanelComponent />
      </main>
      <nav className="obs-nav">
        {panels.map(panel => (
          <button
            key={panel.id}
            className={`obs-nav-btn${activePanel === panel.id ? ' active' : ''}`}
            onClick={() => setActivePanel(panel.id)}
          >
            {panel.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

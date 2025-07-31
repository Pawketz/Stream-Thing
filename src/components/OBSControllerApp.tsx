import { useState, useEffect, useRef} from 'react';
import { focusElement, getFocusableElements } from '../utils/focusNavigation';
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

const DeskThing = createDeskThing<OBSToClient, OBSToServer>();



export default function OBSControllerApp() {
  const [activePanel, setActivePanel] = useState('scenes');
  const navButtonRefs = useRef([]);
  const PanelComponent = panels.find(p => p.id === activePanel)?.component || SceneGrid;

  // Use modular focus navigation for nav and panel buttons
  // Enhanced focus navigation: cycle between nav and panel buttons
  const getPanelButtons = () => {
    const panelRoot = document.querySelector('.obs-panel');
    return getFocusableElements(panelRoot).filter(el => el.tagName === 'BUTTON');
  };

  const focusNavButton = (direction) => {
    const navButtons = navButtonRefs.current;
    const panelButtons = getPanelButtons();
    const active = document.activeElement;
    const currentIndex = navButtons.findIndex(btn => btn === active);
    let nextIndex = currentIndex;
    if (direction === 'next') {
      nextIndex = currentIndex + 1;
      if (nextIndex >= navButtons.length) {
        // Move to first panel button
        panelButtons[0]?.focus();
        return;
      }
    } else if (direction === 'prev') {
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) {
        // Move to last panel button
        panelButtons[panelButtons.length - 1]?.focus();
        return;
      }
    }
    navButtons[nextIndex]?.focus();
  };

  const focusPanelButton = (direction) => {
    const panelButtons = getPanelButtons();
    const navButtons = navButtonRefs.current;
    const active = document.activeElement;
    const currentIndex = panelButtons.findIndex(btn => btn === active);
    let nextIndex = currentIndex;
    if (direction === 'next') {
      nextIndex = currentIndex + 1;
      if (nextIndex >= panelButtons.length) {
        // Move to first nav button
        navButtons[0]?.focus();
        return;
      }
    } else if (direction === 'prev') {
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) {
        // Move to last nav button
        navButtons[navButtons.length - 1]?.focus();
        return;
      }
    }
    panelButtons[nextIndex]?.focus();
  };

  useEffect(() => {
    DeskThing.overrideKeys(["Space", "wheel", "enter", "scroll"]);

    const handleKeyPress = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.code === "Enter" || event.code === "Space") {
        const active = document.activeElement;
        if (active && active.tagName === 'BUTTON') {
          (active as HTMLElement).click();
        }
      }
    };

    const handleWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();
      // If focus is in nav, navigate nav; otherwise, navigate panel buttons
      if (navButtonRefs.current.includes(document.activeElement)) {
        if (event.deltaX < 0) {
          focusNavButton('prev');
        } else if (event.deltaX > 0) {
          focusNavButton('next');
        }
      } else {
        if (event.deltaX < 0) {
          focusPanelButton('prev');
        } else if (event.deltaX > 0) {
          focusPanelButton('next');
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress, { passive: false });
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      DeskThing.restoreKeys(["Space", "wheel", "enter", "scroll"]);
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="obs-app-root">
      <main className="obs-panel">
        <PanelComponent />
      </main>
      <nav className="obs-nav">
        {panels.map((panel, idx) => (
          <button
            key={panel.id}
            ref={el => navButtonRefs.current[idx] = el}
            className={`obs-nav-btn${activePanel === panel.id ? ' active' : ''}`}
            onClick={() => setActivePanel(panel.id)}
            tabIndex={0}
          >
            {panel.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

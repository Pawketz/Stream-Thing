import React, { useEffect, useState } from 'react';
import { createDeskThing } from '@deskthing/client';
import '../index.css';

const DeskThing = createDeskThing();

export default function SourceControls() {
  const [sources, setSources] = useState<any[]>([]);

  useEffect(() => {
    DeskThing.send({ type: 'getSources', payload: {} });
    const off = DeskThing.on('sources', (data) => {
      setSources(data.payload || []);
    });
    return off;
  }, []);

  const toggleSource = (sourceName: string, visible: boolean) => {
    DeskThing.send({ type: 'toggleSource', payload: { sourceName, visible: !visible } });
    setSources(sources => sources.map(s => s.inputName === sourceName ? { ...s, visible: !visible } : s));
  };

  return (
    <div className="source-controls">
      <h2>Sources</h2>
      <ul>
        {sources.map(source => (
          <li key={source.inputName}>
            <span>{source.inputName}</span>
            <button
              className={source.visible ? 'visible' : 'hidden'}
              onClick={() => toggleSource(source.inputName, source.visible)}
            >
              {source.visible ? 'Hide' : 'Show'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

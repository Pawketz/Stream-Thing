/**
 * These match server/deskthingTypes.ts 
 * We could, if wanted, make these both the same file that are imported but that can be a hassel and this is the fasted way to achieve typesafety as long as you update both at the same time
 */

// Events sent from client to server
export type OBSToServer =
  | { type: 'getScenes'; payload: {}; request?: 'set'; }
  | { type: 'switchScene'; payload: { sceneName: string }; request?: 'set'; }
  | { type: 'getSources'; payload: {}; request?: 'set'; }
  | { type: 'toggleSource'; payload: { sourceName: string; visible: boolean }; request?: 'set'; }
  | { type: 'getAudio'; payload: {}; request?: 'set'; }
  | { type: 'setAudio'; payload: { inputName: string; volume?: number; muted?: boolean }; request?: 'set'; }
  | { type: 'getStatus'; payload: {}; request?: 'set'; }
  | { type: 'setStreaming'; payload: { streaming?: boolean; recording?: boolean }; request?: 'set'; }




// Events sent from server to client
export type OBSToClient =
  | { type: 'scenes'; payload: { scenes: any[]; current: string }; request?: 'set'; }
  | { type: 'sceneSwitched'; payload: { sceneName: string }; request?: 'set'; }
  | { type: 'sources'; payload: any[]; request?: 'set'; }
  | { type: 'sourceToggled'; payload: { sourceName: string; visible: boolean }; request?: 'set'; }
  | { type: 'audioMixer'; payload: { name: string; volume: number; muted: boolean }[]; request?: 'set'; }
  | { type: 'audioSet'; payload: { inputName: string; volume?: number; muted?: boolean }; request?: 'set'; }
  | { type: 'status'; payload: { streaming: boolean; recording: boolean }; request?: 'set'; }
  | { type: 'statusSet'; payload: { streaming?: boolean; recording?: boolean }; request?: 'set'; }
  | { type: 'log'; payload: string; request?: 'set'; }
  | { type: 'obsHostUpdated'; payload: { host: string }; request?: 'set'; }
  | { type: 'obsPortUpdated'; payload: { port: number }; request?: 'set'; }
  | { type: 'obsPasswordUpdated'; payload: { password: string }; request?: 'set'; };

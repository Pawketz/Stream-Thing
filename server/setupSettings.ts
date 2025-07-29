import { DeskThing } from '@deskthing/server';
import { AppSettings, SETTING_TYPES, DESKTHING_EVENTS} from '@deskthing/types';


export const  setupSettings = async () => {
    const Settings: AppSettings = {
        host: {
            id: 'host',
            type: SETTING_TYPES.STRING,
            description: 'The host name for the OBS Websocket.',
            label: 'Host Name',
            value: 'localhost',
        },
        port: {
            id: 'port',
            type: SETTING_TYPES.NUMBER,
            description: 'The port number for the OBS Websocket.',
            label: 'Port Number',
            value: 4455,
        },
        password: {
            id: 'password',
            type: SETTING_TYPES.STRING,
            description: 'The password for the OBS Websocket.',
            label: 'Password',
            value: '',
        },
    }
    DeskThing.initSettings(Settings);
};

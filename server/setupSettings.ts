import { DeskThing } from '@deskthing/server';
import { AppSettings, SETTING_TYPES} from '@deskthing/types';


export const  setupSettings = async () => {
    const Settings: AppSettings = {
        host: {
            id: 'host',
            type: SETTING_TYPES.STRING,
            description: 'This will be "localhost" for control on the same machine, or the IP address of the OBS machine if remote.',
            label: 'Host Name',
            value: 'localhost',
        },
        port: {
            id: 'port',
            type: SETTING_TYPES.NUMBER,
            description: 'The port number used by OBS Websocket. Default is 4455.',
            label: 'Port Number',
            value: 4455,
        },
        password: {
            id: 'password',
            type: SETTING_TYPES.STRING,
            description: `The password for the OBS Websocket. Find in OBS under 
                            Tools -> WebSocket Server Settings -> Show Connect Info.`,
            label: 'Password',
            value: 'password',
        },
    }
    DeskThing.initSettings(Settings);
};

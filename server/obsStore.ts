import { createDeskThing } from "@deskthing/server";
import { OBSToServer, OBSToClient } from "./deskthingTypes";

const DeskThing = createDeskThing<OBSToServer, OBSToClient>();


export class obsStore {
    private host?: string;
    private port?: number;
    private password?: string;
    private static instance: obsStore | null = null;

    // it seems you setup instances here - dont know why it was removed
    static getInstance() {
        if (!obsStore.instance) {
            obsStore.instance = new obsStore();
        }
        return obsStore.instance;
    }

    public getHost() {
        return this.host;
    }
    public setHost(host: string) {
        this.host = host;
        DeskThing.send({ type: 'obsHostUpdated', payload: { host } });
    }
    public setPort(port: number) {
        this.port = port;
        DeskThing.send({ type: 'obsPortUpdated', payload: { port } });
    }
    public getPort() {
        return this.port;
    }
    public setPassword(password: string) {
        this.password = password;
        DeskThing.send({ type: 'obsPasswordUpdated', payload: { password } });
    }
    public getPassword() {
        return this.password;
    }
};

export default obsStore.getInstance() // return the instance of the store rather than the store object itself
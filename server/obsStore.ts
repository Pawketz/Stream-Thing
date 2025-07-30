import { createDeskThing } from "@deskthing/server";
import { OBSToServer, OBSToClient } from "./deskthingTypes";
import OBSWebSocket from "obs-websocket-js";
import defaultSettings from "../src/stores/defaultSettings.js";

const DeskThing = createDeskThing<OBSToServer, OBSToClient>();


export class obsStore {

    constructor(){
        this.obs = new OBSWebSocket();
        this.host = defaultSettings.host.value;
        this.port = defaultSettings.port.value; 
        this.password = defaultSettings.password.value;
        this.connected = false; 
    }
    private host?: string;
    private port?: number;
    private password?: string;
    private connected: boolean = false;
    private obs: OBSWebSocket; 
    private static instance: obsStore | null = null;


    // it seems you setup instances here - dont know why it was removed
    static getInstance() {
        if (!obsStore.instance) {
            obsStore.instance = new obsStore();
        }
        return obsStore.instance;
    }

    async connect() {
        try {

            await this.obs.connect(`ws://${this.host}:${this.port}`, this.password);
            this.connected = true;
            } catch (err) {
            this.connected = false;
            setTimeout(() => this.connect(), 5000);
            }
    }

    disconnect() {
        if (this.connected) {
            this.obs.disconnect();
            this.connected = false;
        }
    }

    public async call(
        requestType: string,
        requestData?: any
    ): Promise<any> {
        return this.obs.call(requestType, requestData);
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
    public isConnected() {
        return this.connected;
    }
};

export default obsStore.getInstance() // return the instance of the store rather than the store object itself
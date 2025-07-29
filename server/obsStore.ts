import { DeskThing } from "@deskthing/server";


export class obsStore {
    private host?: string;
    private port?: number;
    private password?: string;

    getHost() {
        return this.host;
    }
    setHost(host: string) {
        this.host = host;
        DeskThing.send({ type: 'obsHostUpdated', payload: { host } });
    }
    setPort(port: number) {
        this.port = port;
        DeskThing.send({ type: 'obsPortUpdated', payload: { port } });
    }
    getPort() {
        return this.port;
    }
    setPassword(password: string) {
        this.password = password;
        DeskThing.send({ type: 'obsPasswordUpdated', payload: { password } });
    }
    getPassword() {
        return this.password;
    }
};
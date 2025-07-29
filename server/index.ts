// server
import { DeskThing } from '@deskthing/server';
import './obsController'; // Integrate OBS controller backend

const startup = () => {
   DeskThing.send({ type: 'log', payload: 'Starting Up' });
}

const stop = () => {
    DeskThing.send({ type: 'log', payload: 'Stopping app' });
}

const purge = () => {
    DeskThing.send({ type: 'log', payload: 'Purging app' });
}


// Ideally, all of your code logic is held within the Startup function. Anything outside of this function wont reliably run
DeskThing.on('start', startup);
DeskThing.on('stop', stop);
DeskThing.on('purge', purge);
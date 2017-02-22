'use strict';
import * as express from 'express';
import * as socket from 'socket.io';

import store, * as Action from './store';

const app = express();
const server = app.listen(8888, () => {
  console.log('Machi Koro server started on port 8888');
});

app.use('/', express.static('public_html'));

const io = socket(server);

const connections = new WeakMap();

io.on('connection', (socket) => {
  // do the game?!?!
  connections.set(socket, {
    gameName: '',
    userName: '',
  });
  console.log("New connection");
  socket.on('join-game', ({ gameName, userName }, respond) => {
    // TODO: join a game
    if(store.getState() === store.nextState(Action.Setup.Join({ gameName, userName }))) {
      respond(null);
    } else {
      respond(store.getState().games[gameName]);
    }
  });

  socket.on('leave-game', ({ gameName, userName }) => {
    store.dispatch(Action.Setup.Leave({ gameName, userName }));
  });

  socket.on('disconnect', () => {
    console.log("Connection closed");
    // automatically leave, etc
  });
});

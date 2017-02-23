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

io.on('connection', (socket) => {
  console.log("New connection");
  socket.on('join-game', ({ gameName, userName }, respond) => {
    // TODO: join a game
    if(store.getState() === store.nextState(Action.Setup.Join({ gameName, userName }))) {
      respond(null);
    } else {
      respond(store.getState().games[gameName]);
      socket.join(gameName);
      socket.to(gameName).emit('join-game', { userName });
    }
  });

  socket.on('leave-game', ({ gameName, userName }) => {
    store.dispatch(Action.Setup.Leave({ gameName, userName }));
    socket.to(gameName).emit('leave-game', { userName });
    socket.leave(gameName);
  });

  socket.on('disconnect', () => {
    console.log("Connection closed");
    // automatically leave, etc
  });
});

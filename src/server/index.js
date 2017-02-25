'use strict';
import * as express from 'express';
import * as socket from 'socket.io';

import store, * as Action from './store';
import { Color } from '../cards';

const app = express();
const server = app.listen(8888, () => {
  console.log('Machi Koro server started on port 8888');
});

app.use('/', express.static('public_html'));

const io = socket(server);

io.on('connection', (socket) => {
  console.log("New connection");
  let game, user, id;
  socket.on('join-game', ({ gameName, userName }, respond) => {
    // join new game
    if(store.getState() === store.nextState(Action.Setup.Join({ gameName, userName }))) {
      // join existing game
      if(store.getState() === store.nextState(Action.Game.Join({ gameName, userName }))) {
        // all games full
        return respond(null);
      }
    }
    // game joined
    game = gameName;
    user = userName;
    id = store.getState().games[game].players.indexOf(user);
    respond(store.getState().games[game]);
    socket.join(game);
    socket.to(game).emit('join-game', { userName: user });
  });

  socket.on('leave-game', () => {
    store.dispatch(Action.Setup.Leave({ game, id }));
    if(store.getState().games[game].players.length === 0) {
      store.dispatch(Action.Setup.Close({ game }));
    }
    socket.to(game).emit('leave-game', { id });
    socket.leave(game);
    game = user = id = undefined;
  });

  socket.on('ready-to-start', () => {
    store.dispatch(Action.Setup.Ready({ game, user }));
    for(let i = 0; i < store.games[game].players.length; ++i) {
      if(!store.games[game].ready[i]) {
        return socket.to(game).emit('ready', { user });
      }
    }
    socket.to(game).emit('start');
  });

  socket.on('roll-dice', ({ count }, respond) => {
    const dice = [ Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1 ];
    socket.to(game).emit('dice', dice.slice(0, count));
    respond(dice.slice(0, count));
  });

  socket.on('activate-cards', ({ roll }, respond) => {
    const actions = [];
    for(let card of cards) {
      if(card.activation.includes(roll)) {
        actions.push(Action.Game.Activate({ game, id, card }));
      }
    }
    actions.sort((a, b) => {
      const order = [Color.Red, Color.Blue, Color.Green, Color.Purple];
      return order[a] - order[b];
    })
    actions.forEach(store.dispatch);
    respond(actions);
  });

  socket.on('stadium', () => {
    store.dispatch(Actions.Game.Stadium({ game, id }));
  })

  socket.on('tv-station', ({ who }, respond) => {
    Action.Game.TVStation({ game, you: id, them: who }))
    socket.to(game).emit({ type: 'tv-station', you: id, them: who });
    respond(true);
  });

  socket.on('business-center', ({ who, yours, theirs }, respond) => {
    if(store.getState() === store.nextState(Action.Game.BusinessCenter({ game, you: id, them: who, yours, theirs }))) {
      respond(false);
    } else {
      socket.to(game).emit({ type: 'business-center', you: id, them: who, yours, theirs });
      respond(true);
    }
  });

  socket.on('disconnect', () => {
    console.log("Connection closed");
    // automatically leave, etc
  });
});

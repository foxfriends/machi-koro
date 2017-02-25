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
  let game, user, id = () => store.getState().games[game].players.indexOf(user);
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
    respond(store.getState().games[game]);
    socket.join(game);
    socket.to(game).emit('join-game', { userName: user });
  });

  socket.on('leave-game', () => {
    const _id = id();
    store.dispatch(Action.Setup.Leave({ game, id: _id }));
    if(store.getState().games[game].players.length === 0) {
      store.dispatch(Action.Setup.Close({ game }));
    }
    socket.to(game).emit('leave-game', { id: _id });
    socket.leave(game);
    game = user = undefined;
  });

  socket.on('ready-to-start', () => {
    store.dispatch(Action.Setup.Ready({ game, id: id() }));
    io.to(game).emit('ready', { id: id() });
    for(let i = 0; i < store.getState().games[game].players.length; ++i) {
      if(!store.getState().games[game].ready[i]) {
        return;
      }
    }
    store.dispatch(Action.Setup.Start({ game }));
    io.to(game).emit('start', { turn: store.getState().games[game].turn });
  });

  socket.on('roll-dice', ({ count }, respond) => {
    const dice = [ Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1 ].slice(0, count);
    socket.to(game).emit('dice', dice);
    store.dispatch(Action.Game.Roll({ game, dice }));
    respond(dice);
  });

  socket.on('activate-cards', ({ roll }, respond) => {
    const actions = [];
    for(let card of cards) {
      if(card.activation.includes(roll)) {
        actions.push(Action.Game.Activate({ game, id: id(), card }));
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
    store.dispatch(Actions.Game.Stadium({ game, id: id() }));
    socket.to(game).emit('major-establishment', { type: 'stadium' });
  })

  socket.on('tv-station', ({ who }) => {
    store.dispatch(Action.Game.TVStation({ game, you: id(), them: who }))
    socket.to(game).emit('major-establishment', { type: 'tv-station', you: id(), them: who });
  });

  socket.on('business-center', ({ who, yours, theirs }, respond) => {
    if(store.getState() === store.nextState(Action.Game.BusinessCenter({ game, you: id(), them: who, yours, theirs }))) {
      respond(false);
    } else {
      socket.to(game).emit('major-establishment', { type: 'business-center', you: id(), them: who, yours, theirs });
      respond(true);
    }
  });

  socket.on('end-turn', () => {
    store.dispatch(Action.Game.EndTurn({ game }));
    io.to(game).emit('end-turn', { turn });
  });

  socket.on('disconnect', () => {
    console.log("Connection closed");
    if(game) {
      const _id = id();
      if(store.getState() === store.nextState(Action.Setup.Leave({ game, id: _id }))) {
        // game in progress
        if(store.getState().turn === _id && store.getState().dice !== null) {
          // forfeit remaining turn actions if you leave
          store.dispatch(Action.Game.EndTurn({ game }));
          io.to(game).emit('end-turn', { turn });
        }
        // then leave game
        store.dispatch(Action.Game.Leave({ game, id: _id }));
      }
      io.to(game).emit('leave-game', { id: _id });
    }
  });
});

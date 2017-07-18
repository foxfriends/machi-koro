'use strict';
import * as express from 'express';
import * as socket from 'socket.io';

import store, * as Action from './store';
import { Card, Color } from '../cards';
import Landmark from '../landmarks';

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
    let start = false;
    if(store.getState() === store.nextState(Action.Setup.Join({ gameName, userName }))) {
      if(store.getState().games[gameName].turn === null) {
        // cannot join a game already being set up
        return respond(null);
      }
      if(store.getState() === store.nextState(Action.Game.Join({ gameName, userName }))) {
        // all games full
        return respond(null);
      } else {
        // join existing game
        start = true;
      }
    }
    // game joined
    game = gameName;
    user = userName;
    respond(store.getState().games[game]);
    socket.join(game);
    socket.to(game).emit('join-game', { userName: user });
    if(start) {
      io.to(game).emit('start', { turn: store.getState().games[game].turn });
    }
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

  socket.on('ready-to-start', (respond) => {
    respond();
    store.dispatch(Action.Setup.Ready({ game, id: id() }));
    io.to(game).emit('ready', { id: id() });
    if(store.getState().games[game].players.length <= 1) { return; }
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
    io.to(game).emit('dice', { dice });
    store.dispatch(Action.Game.Roll({ game, dice }));
    respond(dice);
  });

  socket.on('activate-cards', ({ roll }, respond) => {
    const actions = [];
    for(let card of Card) {
      if(card.activation.includes(roll)) {
        actions.push(Action.Game.Activate({ game, id: id(), card }));
      }
    }
    actions.sort((a, b) => {
      const order = [Color.Red, Color.Blue, Color.Green, Color.Purple];
      return order[a] - order[b];
    })
    actions.forEach(store.dispatch);
    const clientActions = actions.map(({ id, card }) => ({ id, card }))
    io.to(game).emit('actions', { actions: clientActions });
    respond(clientActions);
  });

  socket.on('stadium', (respond) => {
    store.dispatch(Action.Game.Stadium({ game, id: id() }));
    io.to(game).emit('stadium', { id: id() });
    respond();
  })

  socket.on('tv-station', ({ who }, respond) => {
    store.dispatch(Action.Game.TVStation({ game, you: id(), them: who }))
    io.to(game).emit('tv-station', { you: id(), them: who });
    respond();
  });

  socket.on('business-center', ({ who, yours, theirs }, respond) => {
    if(store.getState() === store.nextState(Action.Game.BusinessCenter({ game, you: id(), them: who, yours, theirs }))) {
      respond(false);
    } else {
      io.to(game).emit('business-center', { you: id(), them: who, yours, theirs });
      respond(true);
    }
  });

  socket.on('buy-establishment', ({ card }, respond) => {
    if(store.getState() === store.nextState(Action.Game.Purchase({ game, id: id(), card }))) {
      respond(false);
    } else {
      io.to(game).emit('buy-establishment', { id: id(), card });
      respond(true);
    }
  });

  socket.on('buy-landmark', ({ landmark }, respond) => {
    if(store.getState() === store.nextState(Action.Game.Construct({ game, id: id(), landmark }))) {
      respond(false);
    } else {
      io.to(game).emit('buy-landmark', { id: id(), landmark });
      respond(true);
    }
  });

  socket.on('end-turn', () => {
    store.dispatch(Action.Game.EndTurn({ game }));
    io.to(game).emit('end-turn', { turn: store.getState().games[game].turn });
  });

  socket.on('game-over', () => {
    io.to(game).emit('game-over', { winner: id() });
  });

  socket.on('disconnect', () => {
    console.log("Connection closed");
    if(game) {
      const _id = id();
      if(store.getState() === store.nextState(Action.Setup.Leave({ game, id: _id }))) {
        // game in progress
        const { turn, dice } = store.getState().games[game];
        if(turn === _id && dice) {
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

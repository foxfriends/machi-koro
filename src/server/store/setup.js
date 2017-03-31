'use strict';

function shuffle(a) {
  a = [...a];
  for (let i = a.length; i > 0; --i) {
    let j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
  return a;
}

class Game {
  turn : Number = null;
  turnOrder : { [String] : Number } =
    shuffle([ 0, 1, 2, 3 ])
      .map((_, i, a) => [a[i], a[(i + 1) % a.length]])
      .reduce((m, [k,v]) => ({...m, [k]: v}), {});
  players : Array<String> = [];
  ready : Array<Boolean> = [false, false, false, false];
  // prefill these so they don't have to be dealt with later
  money : Array<Number> = [3, 3, 3, 3];
  cardsLeft : Array<Number> = [6, 6, 6, 6, 6, 6, 4, 4, 4, 6, 6, 6, 6, 6, 6];
  cards : Array<Array<Number>> = [
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  goals : Array<Array<Boolean>> = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
  ];
  dice : Array<Number> = null;

  constructor(host) {
    this.players = [host];
  }
}

export function Join({ gameName, userName }) {
  return {
    type: (state, { gameName, userName }) => {
      if(state.games[gameName]) {
        if(state.games[gameName].turn !== null || state.games[gameName].players.length === 4 || state.games[gameName].players.includes(userName)) {
          return state;
        }
      }
      return {
        ...state,
        games: {
          ...state.games,
          [gameName]: state.games[gameName]
            ? { ...state.games[gameName], players: [...state.games[gameName].players, userName ] }
            : new Game(userName)
        }
      }
    },
    gameName, userName
  };
}

export function Leave({ game, id }) {
  return {
    type: (state, { game, id }) => {
      if(state.games[game].turn !== null) { return state; }
      return {
        ...state,
        games: {
          ...state.games,
          [game]: {
            ...state.games[game],
            players: state.games[game].players.filter((_, i) => i !== id),
            ready: [...state.games[game].ready.filter((_, i) => i !== id), false]
          }
        }
      }
    },
    game, id
  };
}

export function Ready({ game, id }) {
  return {
    type: (state, { game, id }) => ({
      ...state,
      games: {
        ...state.games,
        [game]: {
          ...state.games[game],
          ready: state.games[game].ready.map((ready, i) => ready || i === id)
        }
      }
    }),
    game, id
  }
}

export function Close({ game }) {
  return {
    type: (state, { game }) => {
      const games = {...state.games};
      delete games[game];
      return { ...state, games };
    },
    game
  }
}

export function Start({ game }) {
  return {
    type: (state, { game }) => ({
      ...state,
      games: {
        ...state.games,
        [game]: {
          ...state.games[game],
          turn: Math.floor(Math.random() * state.games[game].players.length)
        }
      }
    }),
    game
  }
}

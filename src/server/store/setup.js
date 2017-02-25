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
  turn = null;
  turnOrder = shuffle([ 0, 1, 2, 3 ]).map((_, i, a) => [a[i], a[(i + 1) % a.length]]).reduce((m, p) => ({...m, [p[0]]: p[1]}), {});
  players = [];
  ready = [false, false, false, false];
  // prefill these so they don't have to be dealt with later
  money = [3, 3, 3, 3];
  cardsLeft = [6, 6, 6, 6, 6, 6, 4, 4, 4, 6, 6, 6, 6, 6, 6];
  cards = [
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  goals = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
  ];

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
    type: (state, { game, id }) => ({
      ...state,
      games: {
        ...state.games,
        [game]: {
          ...state.games[game],
          players: state.games[game].players.filter((_, i) => i !== id),
          ready: [...state.games[game].ready.filter((_, i) => i !== id), false]
        }
      }
    }),
    game, id
  };
}

export function Ready({ game, user }) {
  return {
    type: (state, { game, user }) => ({
      ...state,
      games: {
        ...state.games,
        [game]: {
          ...state.games[game],
          ready: state.games[game].ready.map((ready, i) => ready || i === user)
        }
      }
    }),
    game, user
  }
}

export function Close({ gameName }) {
  return {
    type: (state, { gameName }) => {
      const games = {...state.games};
      delete games[gameName];
      return { ...state, games };
    },
    gameName
  }
}

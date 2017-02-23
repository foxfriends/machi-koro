'use strict';

function Game(host) {
  return {
    turn: null,
    players: [host],
    // prefill these so they don't have to be dealt with later
    money: [3, 3, 3, 3],
    cards: [
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    goals: [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ]
  };
}

export function Join({gameName, userName}) {
  return {
    type: (state, action) => {
      if(state.games[gameName]) {
        if(state.games[gameName].turn !== null || state.games[gameName].players.length === 4 || state.games[gameName].players.includes(userName)) {
          return state;
        }
      }
      return {
        ...state,
        games: {
          ...state.games,
          [action.gameName]: state.games[action.gameName]
            ? { ...state.games[action.gameName], players: [...state.games[action.gameName].players, action.userName ] }
            : Game(action.userName)
        }
      }
    },
    gameName, userName
  };
}

export function Leave({gameName, userName}) {
  return {
    type: (state, action) => ({
      ...state,
      games: {
        ...state.games,
        [action.gameName]: {
          ...state.games[action.gameName],
          players: state.games[action.gameName].players.filter(name => name !== action.userName)
        }
      }
    }),
    gameName, userName
  };
}

export function Close({gameName}) {
  return {
    type: (state, action) => {
      const games = {...state.games};
      delete games[gameName];
      return { ...state, games };
    },
    gameName
  }
}

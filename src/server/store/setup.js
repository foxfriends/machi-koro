'use strict';

function Game(host) {
  return {
    players: [host]
  };
}

export function Join({gameName, userName}) {
  return {
    type: (state, action) => {
      if(state.games[gameName] && state.games[gameName].players.length === 4) { return state; }
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

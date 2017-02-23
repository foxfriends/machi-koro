'use strict';

import { Phase } from './';

export function Join({data, game, name}) {
  return {
    type: (state, { data, game }) => ({
      ...state,
      phase: Phase.Setup,
      data,
      name,
      game
    }),
    data, game, name
  };
}

export function Leave() {
  return {
    type: (state) => ({
      ...state,
      phase: Phase.Menu,
      data: null,
      game: '',
      name: ''
    })
  };
}

export function Arrival({ userName: name }) {
  return {
    type: (state, { name }) => ({
      ...state,
      data: {
        ...state.data,
        players: [...state.data.players, name]
      }
    }),
    name
  };
}

export function Departure({ userName: name }) {
  return {
    type: (state, { name }) => ({
      ...state,
      data: {
        ...state.data,
        players: state.data.players.filter(n => n !== name)
      }
    }),
    name
  };
}

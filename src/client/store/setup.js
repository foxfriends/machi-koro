'use strict';

import { Phase } from './';

export function Join({data, game, name}) {
  return {
    type: (state, { data, game, name }) => ({
      ...state,
      id: data.players.indexOf(name),
      phase: Phase.Setup,
      data,
      name,
      game,
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
      name: '',
    })
  };
}

export function Arrival({ userName: name }) {
  return {
    type: (state, { name }) => ({
      ...state,
      data: {
        ...state.data,
        players: [...state.data.players, name],
      }
    }),
    name
  };
}

export function Ready({ id }) {
  return {
    type: (state, { id }) => ({
      ...state,
      data: {
        ...state.data,
        ready: state.data.ready.map((ready, i) => ready || i === id),
      }
    }),
    id
  }
}

export function Departure({ id }) {
  return {
    type: (state, { id }) => ({
      ...state,
      data: {
        ...state.data,
        players: state.data.players.filter((_, i) => i !== id),
        ready: [...state.data.ready.filter((_, i) => i !== id), false],
      }
    }),
    id
  };
}

export function Start({ turn }) {
  return {
    type: (state) => ({
      ...state,
      phase: Phase.Game,
      data: {
        ...state.data,
        turn
      },
    })
  }
}

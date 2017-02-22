'use strict';

import { Phase } from './';

export function Join({data, game, name}) {
  return {
    type: (state, { data, game }) => ({ ...state, phase: Phase.Setup, data, name, game }),
    data, game, name
  };
}

export function Leave() {
  return {
    type: (state) => ({ ...state, phase: Phase.Menu, data: null, game: '', name: '' })
  };
}

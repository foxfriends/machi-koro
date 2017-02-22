'use strict';

import { createStore } from 'redux';

export const Phase = {
  Menu: Symbol('Phase.Menu'),
  Setup: Symbol('Phase.Setup'),
  Game: Symbol('Phase.Game'),
};

const initial = {
  phase: Phase.Menu,
  name: '',
  game: null,
};

function reducer(state = initial, action) {
  if(typeof action.type === 'function') {
    return action.type(state, action);
  }
  return state;
}

import * as Setup from './setup';
export { Setup };

export default createStore(reducer);

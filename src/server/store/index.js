'use strict';
import { createStore } from 'redux';

const initial = {
   games: {}
}

function reducers(state = initial, action) {
  if(typeof action.type === 'function') {
    return action.type(state, action);
  }
  return state;
}

import * as Setup from './setup';
import * as Game from './game';

export { Setup, Game };

const store = createStore(reducers);
export default {
  ...store,
  nextState(action) {
    store.dispatch(action);
    return store.getState();
  }
};

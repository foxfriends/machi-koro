'use strict';
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { SocketProvider } from 'socket.io-react';
import { render } from 'react-dom';

import store from './store';
import socket from './socket';
import MachiKoro from './app';

render(
  <SocketProvider socket={ socket }>
    <Provider store={ store }>
      <MachiKoro />
    </Provider>
  </SocketProvider>,
  document.querySelector('#machi-koro')
)

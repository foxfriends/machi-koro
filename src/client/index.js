'use strict';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { SocketProvider } from 'socket.io-react';
import { render } from 'react-dom';

import store from './store';
import socket from './socket';
import MachiKoro from './app';

render(
  <SocketProvider socket={ socket }>
    <ReduxProvider store={ store }>
      <MachiKoro />
    </ReduxProvider>
  </SocketProvider>,
  document.querySelector('#machi-koro')
)

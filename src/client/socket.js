'use strict';

import io from 'socket.io-client';
const socket = io();

// promisify emit so it's more useful
socket.__emit = socket.emit;
socket.emit = (...args) => new Promise((resolve) => socket.__emit(...args, resolve));

export default socket;

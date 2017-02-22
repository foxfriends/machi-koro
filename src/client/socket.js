'use strict';

import io from 'socket.io-client';
const socket = io();

// socket.on('error', error);
// socket.on('notification', notification);
// socket.on('success', success);
// socket.on('data:update', (d) => setData(JSON.parse(d)));

// promisify emit so it's more useful
socket.__emit = socket.emit;
socket.emit = (...args) => new Promise((resolve) => socket.__emit(...args, resolve));

export default socket;

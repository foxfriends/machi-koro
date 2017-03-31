'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { socketConnect as socket } from 'socket.io-react';

import * as Action from '../../store';

@socket
@connect(
  ({ name, game, data: { players, ready } }) => ({ name, game, players, ready }),
  dispatch => ({
    leave: () => dispatch(Action.Setup.Leave()),
    arrival: (user) => dispatch(Action.Setup.Arrival(user)),
    departure: (user) => dispatch(Action.Setup.Departure(user)),
    readyToStart: (user) => dispatch(Action.Setup.Ready(user)),
    start: (turn) => dispatch(Action.Setup.Start(turn)),
  })
)
class Setup extends React.Component {
  props : {
    socket: SocketIO,
    name: String,
    game: String,
    players: Array<String>,
    ready: Array<Boolean>,
    leave: Function,
    arrival: Function,
    departure: Function,
    readyToStart: Function,
    start: Function,
  }

  leave() {
    this.props.socket.emit('leave-game', { gameName: this.props.game, userName: this.props.name });
    this.props.leave();
  }

  componentWillMount() {
    this.props.socket.on('join-game', this.props.arrival);
    this.props.socket.on('leave-game', this.props.departure);
    this.props.socket.on('ready', this.props.readyToStart);
    this.props.socket.on('start', this.props.start);
  }

  componentWillUnmount() {
    this.props.socket.off('join-game', this.props.arrival);
    this.props.socket.off('leave-game', this.props.departure);
    this.props.socket.off('ready', this.props.readyToStart);
    this.props.socket.off('start', this.props.start);
  }

  ready() {
    this.props.socket.emit('ready-to-start');
  }

  render() {
    return (
      <div>
        <p>Game: {this.props.game}</p>
        <p>Me: {this.props.name}</p>
        <p>Players: {this.props.players.join(', ')}</p>
        <p>Ready: {this.props.ready.join(', ')}</p>
        <button onClick={() => this.ready()}>Ready</button>
        <button onClick={() => this.leave()}>Back</button>
      </div>
    );
  }
}

export default Setup;

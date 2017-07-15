'use strict';
import React from 'react';
import { connect as reduxConnect } from 'react-redux';
import { socketConnect } from 'socket.io-react';

import * as Action from '../../store';
import { _if, pair } from '../../helper';
import './index.scss';

@socketConnect
@reduxConnect(
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
  props: {
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
    const players = pair(this.props.players, this.props.ready);
    const ready = players.find(_ => _[0] === this.props.name)[1];
    return (
      <div className="setup">
        <div className="setup__players">
          { players.map(([name, ready]) =>
              <div className={[`setup__player${name === this.props.name ? '--me' : ''}`]} key={name}>
                <div className="setup__name">{ name }</div>
                <div className="setup__ready">
                  { ready ? 'check' : 'close' }
                </div>
              </div>
            )
          }
        </div>
        <div className="setup__actions">
          <button className="setup__action--small" onClick={() => this.leave()}>Back</button>
          <button className="setup__action--large" onClick={() => this.ready()} disabled={ready}>
            { ready
              ? 'The game will start when all players are ready'
              : 'Ready!' }
          </button>
        </div>
      </div>
    );
  }
}

export default Setup;

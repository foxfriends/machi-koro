'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { socketConnect as socket } from 'socket.io-react';

import * as Action from '../../store';



@socket
@connect(
  ({ name, game, data: { players } }) => ({ name, game, players }),
  dispatch => ({
    leave: () => dispatch(Action.Setup.Leave()),
    arrival: (user) => dispatch(Action.Setup.Arrival(user)),
    departure: (user) => dispatch(Action.Setup.Departure(user)),
  })
)
class Setup extends React.Component {
  props : {
    socket: SocketIO,
    name: String,
    game: String,
    players: Array<String>,
    leave: Function,
    arrival: Function,
    departure: Function,
  }

  leave() {
    this.props.socket.emit('leave-game', { gameName: this.props.game, userName: this.props.name });
    this.props.leave();
  }

  componentWillMount() {
    this.props.socket.on('join-game', this.props.arrival);
    this.props.socket.on('leave-game', this.props.departure);
  }

  componentWillUnmount() {
    this.props.socket.off('join-game', this.props.arrival);
    this.props.socket.off('leave-game', this.props.departure);
  }

  render() {
    return (
      <div>
        <p>Game: {this.props.game}</p>
        <p>Me: {this.props.name}</p>
        <p>Players: {this.props.players.join(', ')}</p>
        <button onClick={this.leave.bind(this)}>Back</button>
      </div>
    );
  }
}

export default Setup;

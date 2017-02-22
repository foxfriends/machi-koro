'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { socketConnect as socket } from 'socket.io-react';

import * as Action from '../../store';

@socket
@connect(
  ({ name, game, data: { players } }) => ({ name, game, players }),
  dispatch => ({
    back: () => dispatch(Action.Setup.Leave())
  })
)
class Setup extends React.Component {
  props : {
    socket: SocketIO,
    name: String,
    game: String,
    players: Array<String>,
    back: Function,
  }

  back() {
    this.props.socket.emit('leave-game', { gameName: this.props.game, userName: this.props.name });
    this.props.back();
  }

  render() {
    return (
      <div>
        <p>Game: {this.props.game}</p>
        <p>Me: {this.props.name}</p>
        <p>Players: {this.props.players}</p>
        <button onClick={this.back.bind(this)}>Back</button>
      </div>
    );
  }
}

export default Setup;

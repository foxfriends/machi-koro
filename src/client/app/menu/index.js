'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { socketConnect as socket } from 'socket.io-react';

import * as Action from '../../store';
import { _if } from '../../helper';
import LoadingPane from '../../components/loading-pane';
import ErrorMessage from '../../components/error-message';

@socket
@connect(
  () => ({}),
  dispatch => ({
    joinGame: (data, game, name) => dispatch(Action.Setup.Join({data, game, name}))
  })
)
class Menu extends React.Component {
  props : {
    socket : SocketIO,
    joinGame : (GameData) => _
  };

  state = {
    userName: '',
    gameName: '',
    loading: false
  };

  handleChange(event) {
    this.setState({ [event.target.getAttribute('name')] : event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { gameName, userName } = this.state;
    if(gameName === '' || userName === '') return;
    this.setState({ loading: true });
    this.props.socket.emit('join-game', { gameName, userName }).then(data => {
      this.setState({ loading: false });
      if(data !== null) {
        this.props.joinGame(data, gameName, userName);
      } else {
        this.setState({ errorMsg: `Could not join ${gameName}`});
      }
    });
  }

  clearError() {
    this.setState({ errorMsg: '' });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input type="text" name="gameName" onChange={this.handleChange.bind(this)} placeholder="Game name"/>
        <input type="text" name="userName" onChange={this.handleChange.bind(this)} placeholder="Your name"/>
        <input type="submit" value="Submit" />
        { _if (this.state.loading) (<LoadingPane />) }
        { _if (this.state.errorMsg !== '') (<ErrorMessage message={this.state.errorMsg} close={this.clearError.bind(this)} />)}
      </form>
    );
  }
}

export default Menu;

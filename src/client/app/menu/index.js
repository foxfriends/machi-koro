'use strict';
import React from 'react';
import { connect as reduxConnect } from 'react-redux';
import { socketConnect } from 'socket.io-react';

import * as Action from '../../store';
import { _if } from '../../helper';
import LoadingPane from '../../components/loading-pane';
import ErrorMessage from '../../components/error-message';
import './index.scss';

@socketConnect
@reduxConnect(
  () => ({}),
  dispatch => ({
    joinGame: (data, game, name) => dispatch(Action.Setup.Join({data, game, name}))
  })
)
class Menu extends React.Component {
  props : {
    socket : SocketIO,
    joinGame : (GameData) => null,
  };

  state = {
    userName: '',
    gameName: '',
    loading: false,
    backgroundsVisible: '',
    inputValid: false,
  };

  handleChange(event) {
    this.setState({ [event.target.getAttribute('name')] : event.target.value }, () => {
      this.setState({ inputValid: this.state.userName && this.state.gameName });
    });
  }

  componentDidMount() {
    setTimeout(() => this.setState({ backgroundsVisible: 'main-menu__image--visible' }));
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
      <div className="main-menu">
        <div className={`main-menu__image--back main-menu__image ${this.state.backgroundsVisible || ''}`} />
        <div className={`main-menu__image--middle main-menu__image ${this.state.backgroundsVisible || ''}`} />
        <div className={`main-menu__image--front main-menu__image ${this.state.backgroundsVisible || ''}`} />
        <form className="main-menu__form" onSubmit={(e) => this.handleSubmit(e)}>
          {/* TODO: make these into components? it's basically mdInput */}
          <span className="main-menu__input">
            <input type="text" name="gameName" onChange={(e) => this.handleChange(e)} placeholder="Game name"/>
            <span className="main-menu__input-underline" />
          </span>
          <span className="main-menu__input">
            <input type="text" name="userName" onChange={(e) => this.handleChange(e)} placeholder="Your name"/>
            <span className="main-menu__input-underline" />
          </span>
          <input className="main-menu__button" type="submit" value="Join game!" disabled={!this.state.inputValid} />
          { _if (this.state.loading) (<LoadingPane />) }
          { _if (this.state.errorMsg !== '') (<ErrorMessage message={this.state.errorMsg} close={() => this.clearError()} />)}
        </form>
      </div>
    );
  }
}

export default Menu;

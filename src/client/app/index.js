'use strict';

import React from 'react';
import { connect as reduxConnect } from 'react-redux';
import Menu from './menu';
import Setup from './setup';
import Game from './game';
import { Phase } from '../store';

@reduxConnect(({ phase }) => ({ phase }))
class MachiKoro extends React.Component {
  render() {
    switch(this.props.phase) {
      case Phase.Menu:
        return <Menu />;
      case Phase.Setup:
        return <Setup />;
      case Phase.Game:
      case Phase.Done:
        return <Game />;
    }
  }
}

export default MachiKoro;

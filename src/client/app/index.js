'use strict';

import React from 'react';
import { connect } from 'react-redux';
import Menu from './menu';
import Setup from './setup';
import Game from './game';
import { Phase } from '../store';

// base controller

@connect(({ phase }) => ({ phase }))
class MachiKoro extends React.Component {
  render() {
    switch(this.props.phase) {
      case Phase.Menu:
        return <Menu />;
      case Phase.Setup:
        return <Setup />;
      case Phase.Game:
        return <Game />;
    }
  }
}

export default MachiKoro;

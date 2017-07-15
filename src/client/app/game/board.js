'use strict';
import * as React from 'react';
import { connect as reduxConnect} from 'react-redux';
import cards from '../../../cards';
import * as Action from '../../store';

import './board.scss';

@reduxConnect(
  ({ data : { cardsLeft: cards, turn, dice, players } }) => ({ cards, turn, dice, players })
)
class Board extends React.Component {
  props: {
    cards : Array<Number>,
    turn : Number,
    dice: Array<Number>,
    players: Array<String>,
  };

  render() {
    return (
      <div className="board">
        <p className="board__turn">{this.props.players[this.props.turn]}'s turn</p>
        <div className="board__dice">Dice: {this.props.dice}</div>
        <div className="board__cards">
          { [...cards].map(({name, id}) =>
            <div className={`board__card-backing board__card-backing--depth-${this.props.cards[id]}`}>
              <div className={`board__card board__card--${name.toLowerCase().replace(/\W/g, '-')}`} key={`${id}`} />
            </div>) }
        </div>
      </div>
    )
  }
}

export default Board;

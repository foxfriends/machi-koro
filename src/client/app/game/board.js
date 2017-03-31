'use strict';
import * as React from 'react';
import { socketConnect as socket } from 'socket.io-react';
import { connect } from 'react-redux';
import cards from '../../../cards';
import * as Action from '../../store';

@connect(
  ({ data : { cardsLeft : cards, turn, dice } }) => ({ cards, turn, dice })
)
class Board extends React.Component {
  props : {
    cards : Array<Number>,
    turn : Number,
    dice: Array<Number>,
  };

  render() {
    return (
      <div>
        <p>Current turn: {this.props.turn}</p>
        <p>Cards Remaining</p>
        <ul>
        { [...cards].map(({name, id}) => <li key={`${id}`}>{name}: {this.props.cards[id]}</li>) }
        </ul>
        <p>Dice: {this.props.dice}</p>
      </div>
    )
  }
}

export default Board;

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
        <div className="board__info">
          <div className="board__turn">{this.props.players[this.props.turn]}'s turn</div>
          <div className="board__dice">{(this.props.dice || []).map((side, i) => <div className={`board__${i ? 'r' : 'y'}die--side-${side}`} key={i} />)}</div>
        </div>
        <div className="board__cards">
          { [...cards].map(({name, id}) =>
            <div className={`board__card-backing board__card-backing--depth-${this.props.cards[id]}`} key={id}>
              <div className={`board__card board__card--${name.toLowerCase().replace(/\W/g, '-')}`} />
            </div>)
          }
        </div>
        <div className="board__info" />
      </div>
    )
  }
}

export default Board;

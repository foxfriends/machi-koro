'use strict';
import * as React from 'react';
import { connect as reduxConnect } from 'react-redux';
import landmarks from '../../../landmarks';
import cards from '../../../cards';
import './player.scss';

function asCoins(money) {
  const coins = { [1]: 0, [5]: 0, [10]: 0 };

  while(money > 0) {
    if(money >= 10) {
      money -= 10;
      coins[10]++;
    } else if(money >= 5) {
      money -= 5;
      coins[5]++;
    } else {
      coins[1] += money;
      money = 0;
    }
  }

  return [
    <div className={`player__coin--value-10 player__coin--depth-${coins[10]}`} key="10" />,
    <div className={`player__coin--value-5 player__coin--depth-${coins[5]}`} key="5" />,
    <div className={`player__coin--value-1 player__coin--depth-${coins[1]}`} key="1" />,
  ]
}

@reduxConnect(
  ({data : { cards, money, goals }}, {name, pid, index}) => ({ cards : cards[pid], money: money[pid], goals: goals[pid], name, index })
)
class Player extends React.Component {
  props : {
    index : Number,
    name : String,
    goals: Array<Boolean>,
    cards: Array<Number>,
    money: Number,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={`player player--${this.props.index}`}>
        <div className="player__name">{this.props.name}</div>
        <div className="player__coins">{asCoins(this.props.money)}</div>
        <div className="player__cards">
          { this.props.cards.map((quantity, i) =>
            <div className={`player__card-backing player__card-backing--small player__card-backing--depth-${quantity}`} key={i}>
              <div className={`player__card player__card--${cards[i].name.toLowerCase().replace(/\W/g, '-')} player__card--small`}>
                { quantity }
              </div>
            </div>
          )}
        </div>
        <div className="player__goals">
          { this.props.goals.map((purchased, i) =>
            <div className="player__card-backing player__card-backing--depth-1" key={i}>
              <div className={`player__card--${landmarks[i].name.toLowerCase().replace(/\W/g, '-')}${purchased ? '' : '-back'}`} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Player;

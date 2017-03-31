'use strict';
import * as React from 'react';
import { connect } from 'react-redux';
import { socketConnect as socket } from 'socket.io-react';

@connect(
  ({data : { cards, money, goals }}, {name, index}) => ({ cards : cards[index], money: money[index], goals: goals[index], name, index })
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
      <div>
        <p>Name: {this.props.name}</p>
        <p>Cards: {this.props.cards.join(', ')}</p>
        <p>Money: {this.props.money}</p>
        <p>Goals: {this.props.goals.join(', ')}</p>
      </div>
    );
  }
}

export default Player;

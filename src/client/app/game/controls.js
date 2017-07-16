'use strict';
import React from 'react';
import { socketConnect } from 'socket.io-react';
import { connect as reduxConnect } from 'react-redux';
import Deferred from 'promise-defer';

import { _if } from '../../helper';
import Landmark from '../../../landmarks';
import { Card, Color, Purchase } from '../../../cards';
import './controls.scss';

const Phase = {
  Start: Symbol(),
  Dice: Symbol(),
  RadioTower: Symbol(),
  Cards: Symbol(),
  TVStation: Symbol(),
  BusinessCenter: {
    Who: Symbol(),
    Theirs: Symbol(),
    Yours: Symbol(),
  },
  Buy: Symbol(),
  AmusementPark: Symbol(),
};

@socketConnect
@reduxConnect(
  ({ name, data: { turn, goals, money, players, cards } }) => ({ name, goals: goals[turn], money: money[turn], players, cards, turn })
)
class Controls extends React.Component {
  props : {
    goals: Array<Boolean>,
    money: Number,
    players: Array<String>,
    cards: Array<Array<Number>>,
    turn: Number,
    name: String,
  };

  state = { phase: Phase.Start, promise: null };

  constructor(props) {
    super(props)
  }

  get input() {
    const deferred = Deferred();
    this.setState({ resolve: (...args) => deferred.resolve(...args) });
    return deferred.promise;
  }

  async startTurn() {
    this.setState({ phase: Phase.Dice });
    let count = await this.input;
    let dice = await this.props.socket.emit('roll-dice', { count });
    if(this.props.goals[Landmark.RadioTower.id]) {
      this.setState({ phase: Phase.RadioTower });
      if(count = await this.input) {
        dice = await this.props.socket.emit('roll-dice', { count });
      }
    }
    this.setState({ phase: Phase.Cards });
    const actions = await this.props.socket.emit('activate-cards', { roll: dice.reduce((a, b) => a + b, 0) });
    for(let { card } of actions.filter(({ card: { color } }) => color === Color.Purple).sort(({ card : { id: a } }, { card : { id: b } }) => a - b)) {
      if(!this.props.cards[this.props.turn][card.id]) { continue; }
      switch(card.id) {
        case Card.Stadium.id:
          await this.props.socket.emit('stadium');
          break;
        case Card.TVStation.id:
          // choose another player
          {
            this.setState({ phase: Phase.TVStation });
            const who = await this.input;
            await this.props.socket.emit('tv-station', { who });
          }
          break;
        case Card.BusinessCenter.id:
          // choose another player's card
          {
            let who, yours, theirs;
            do {
              this.setState({ phase: Phase.BusinessCenter.Who });
              who = await this.input;
              this.setState({ phase: Phase.BusinessCenter.Theirs, who });
              theirs = await this.input;
              if(theirs === -1) { continue; }
              this.setState({ phase: Phase.BusinessCenter.Yours });
              yours = await this.input;
              if(yours === -1) { continue; }
            } while(false);
            await this.props.socket.emit('business-center', { who, theirs, yours });
          }
          break;
      }
    }
    this.setState({ phase: Phase.Buy });
    let purchase = await this.input;
    if(purchase) {
      if(this.props.money >= purchase.cost) {
        if(purchase.type === Purchase.Establishment) {
          if(await this.props.socket.emit('buy-establishment', { card: purchase.id })) {
          } else {
            console.log("You can't afford it");
          }
        } else if(purchase.type === Purchase.Landmark) {
          if(await this.props.socket.emit('buy-landmark', { landmark: purchase.id })) {
          } else {
            console.log("You can't afford it");
          }
        }
      }
    }
    if(this.props.goals[Landmark.AmusementPark.id] && dice.length === 2 && dice[0] === dice[1]) {
      this.setState({ phase: Phase.AmusementPark });
      await this.input;
      return this.startTurn();
    }
    this.props.socket.emit('end-turn');
  }

  render() {
    return (
      <div className="controls">
        { this[this.state.phase]() }
      </div>
    );
  }

  [Phase.Start]() {
    return (
      <div className="start-phase">
        <div className="start-phase__container">
          <button className="start-phase__button" onClick={() => this.startTurn()}>Start Turn!</button>
        </div>
      </div>
    );
  }

  [Phase.Dice]() {
    return (
      <div className="dice-phase">
        <div className="dice-phase__container">
          <p className="dice-phase__label">Roll how many?</p>
          <button className="dice-phase__button" onClick={() => this.state.resolve(1)}>1</button>
          {_if (this.props.goals[Landmark.TrainStation.id]) (
            <button className="dice-phase__button" onClick={() => this.state.resolve(2)}>2</button>
          )}
        </div>
      </div>
    );
  }

  [Phase.RadioTower]() {
    return (
      <div>
        Use radio tower to reroll?
        <button onClick={() => this.state.resolve(0)}>Keep your roll</button>
        <button onClick={() => this.state.resolve(1)}>Roll 1 die</button>
        {_if (this.props.goals[Landmark.TrainStation.id]) (
          <button onClick={() => this.state.resolve(2)}>Roll 2 dice</button>
        )}
      </div>
    );
  }

  [Phase.Cards]() {
    return null;
  }

  [Phase.TVStation]() {
    return (
      <div>
        Take 5 coins from...
        this.props.players.map((player, i) =>
          player !== this.props.name ? <button key={`${i}`} onClick={() => this.state.resolve(i)}>{player}</button> : null
        )
      </div>
    );
  }

  [Phase.BusinessCenter.Who]() {
    return (
      <div>
        Swap establishments with...
        this.props.players.map((player, i) =>
          player !== this.props.name ? <button key={`${i}`} onClick={() => this.state.resolve(i)}>{player}</button> : null
        )
      </div>
    );
  }

  [Phase.BusinessCenter.Theirs]() {
    return (
      <div>
        Take which card...
        <button onClick={() => this.state.resolve(-1)}>Start over</button>
        {this.props.cards[this.state.who].map((card, i) =>
          card ? <button key={`${i}`} onClick={() => this.state.resolve(i)}>{Card[i].name}</button> : null
        )}
      </div>
    );
  }

  [Phase.BusinessCenter.Yours]() {
    return (
      <div>
        Give which card...
        <button onClick={() => this.state.resolve(-1)}>Start over</button>
        {this.props.cards[this.props.turn].map((card, i) =>
          card ? <button key={`${i}`} onClick={() => this.state.resolve(i)}>{Card[i].name}</button> : null
        )}
      </div>
    );
  }

  [Phase.Buy]() {
    return (
      <div>
        Buy?
        <button onClick={() => this.state.resolve(null)}>End turn</button>
        {[...Card].map((card) =>
          this.props.money >= card.cost ? <button key={`est-${card.id}`} onClick={() => this.state.resolve(card)}>{card.name}</button> : null
        )}
        {[...Landmark].map((card, i) =>
          this.props.money >= card.cost && !this.props.goals[i] ? <button key={`lmk-${card.id}`} onClick={() => this.state.resolve(card)}>{card.name}</button> : null
        )}
      </div>
    );
  }

  [Phase.AmusementPark]() {
    return (
      <div>
        You rolled doubles! <button onClick={() => this.state.resolve()}>Go again!</button>
      </div>
    );
  }
}

export default Controls;

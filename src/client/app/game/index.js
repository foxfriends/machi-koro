'use strict';
import * as React from 'react';
import { connect as reduxConnect } from 'react-redux';
import { socketConnect } from 'socket.io-react';
import { _if, calcIndex } from '../../helper';

import Board from './board';
import Player from './player';
import Controls from './controls';

import * as Action from '../../store';
const Phase = Action.Phase;
import './index.scss';

@socketConnect
@reduxConnect(
  ({ id: pid, data : { players, turn }, phase }) => ({ players, turn, phase, pid }),
  dispatch => ({
    diceRolled: (dice) => dispatch(Action.Game.Dice(dice)),
    processActions: ({ actions }) => actions.map(Action.Game.ActivateCard).forEach(dispatch),
    stadium: (action) => dispatch(Action.Game.Stadium(action)),
    tvStation: (action) => dispatch(Action.Game.TVStation(action)),
    businessCenter: (action) => dispatch(Action.Game.BusinessCenter(action)),
    buyEstablishment: (establishment) => dispatch(Action.Game.Purchase(establishment)),
    buyLandmark: (landmark) => dispatch(Action.Game.Construct(landmark)),
    endTurn: (turn) => dispatch(Action.Game.EndTurn(turn)),
    gameOver: (winner) => dispatch(Action.Game.EndGame(winner)),
  })
)
class Game extends React.Component {
  props : {
    pid: Number,
    turn: Number,
    players: Array<String>,
    diceRolled: Function,
    processActions: Function,
    stadium: Function,
    tvStation: Function,
    businessCenter: Function,
    buyEstablishment: Function,
    buyLandmark: Function,
    endTurn: Function,
    gameOver: Function,
  };

  componentWillMount() {
    this.props.socket.on('end-turn', this.props.endTurn);
    this.props.socket.on('dice', this.props.diceRolled);
    this.props.socket.on('actions', this.props.processActions);
    this.props.socket.on('stadium', this.props.stadium);
    this.props.socket.on('tv-station', this.props.tvStation);
    this.props.socket.on('business-center', this.props.businessCenter);
    this.props.socket.on('buy-landmark', this.props.buyLandmark);
    this.props.socket.on('buy-establishment', this.props.buyEstablishment);
    this.props.socket.on('game-over', this.props.gameOver);
  }

  componentWillUnmount() {
    this.props.socket.off('end-turn', this.props.endTurn);
    this.props.socket.off('dice', this.props.diceRolled);
    this.props.socket.off('actions', this.props.processActions);
    this.props.socket.off('stadium', this.props.stadium);
    this.props.socket.off('tv-station', this.props.tvStation);
    this.props.socket.off('business-center', this.props.businessCenter);
    this.props.socket.off('buy-landmark', this.props.buyLandmark);
    this.props.socket.off('buy-establishment', this.props.buyEstablishment);
    this.props.socket.off('game-over', this.props.gameOver);
  }

  render() {
    return (
      <div className="game">
        <div className="game__board">
          <Board />
        </div>
        <div className="game__players">
          { this.props.players.map((name, i) =>
            <Player name={name} key={`${i}`} pid={i} index={calcIndex(i, this.props.pid, this.props.players.length)} id={`player-${i}`} />)
          }
        </div>
        { _if(this.props.phase === Phase.Game)(
          <div className="game__controls">
            { _if(this.props.turn === this.props.pid) (<Controls />) }
          </div>
        )}
        { _if(this.props.phase === Phase.Done)(
          <div className="game__done">
            <div className="start-phase">
              <div className="start-phase__container">
                { this.props.players[this.props.turn] } wins!
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Game;

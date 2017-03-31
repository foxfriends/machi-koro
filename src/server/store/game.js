'use strict';
import { Card, Color } from '../../cards';
import Landmark from '../../landmarks';

export function Join({ gameName, userName }) {
  return {
    type: (state, { gameName, userName }) => {
      const id = state.games[gameName].players.indexOf(userName);
      if(id === -1) { return state; }
      return {
        ...state,
        games: {
          ...state.games,
          [gameName]: {
            ...state.games[gameName],
            ready: state.games[gameName].ready.map((p, i) => i === id || p)
          }
        }
      }
    },
    gameName, userName
  };
}

export function Leave({ game, id }) {
  return {
    type: (state, { game, id }) => ({
      ...state,
      games: {
        ...state.games,
        [game]: {
          ...state.games[game],
          ready: state.games[game].ready.map((ready, i) => i !== id && ready)
        }
      }
    }),
    game, id
  };
}

export function Roll({ game, dice }) {
  return {
    type: (state, { game, dice }) => ({
      ...state,
      games: {
        ...state.games,
        [game]: {
          ...state.games[game],
          dice
        }
      }
    }),
    game, dice
  }
}

export function Purchase({ game, id, card }) {
  card = Card[card];
  return {
    type: (state, { game, id, card }) => {
      if(state.games[game].money[id] < card.cost) { return state; }
      if(state.games[game].cardsLeft[card.id] === 0) { return state; }
      if(card.color === Color.Purple && state.games[game].cards[id][card.id]) { return state; }
      return {
        ...state,
        games: {
          ...state.games,
          [game]: {
            ...state.games[game],
            cardsLeft: state.games[game].cardsLeft.map((qty, i) => i !== card.id ? qty : qty - 1),
            cards: state.games[game].cards.map((list, i) => i !== id
              ? [...list]
              : list.map((count, i) => i !== card.id ? count : count + 1)
            ),
            money: state.games[game].money.map((qty, i) => i !== id ? qty : qty - card.cost)
          }
        }
      }
    },
    game, id, card
  };
}

export function Construct({ game, id, landmark }) {
  landmark = Landmark[landmark];
  return {
    type: (state, { game, id, landmark }) => {
      if(state.games[game].money[id] < landmark.cost) { return state; }
      if(state.games[game].goals[id][landmark.id]) { return state; }
      return {
        ...state,
        games: {
          ...state.games,
          [game]: {
            ...state.games[game],
            money: state.games[game].money.map((qty, i) => i !== id ? qty : qty - landmark.cost),
            goals: state.games[game].goals.map((list, i) => i !== id
              ? [...list]
              : list.map((built, i) => landmark.id === i || built))
          }
        }
      }
    },
    game, id, landmark
  }
}

export function Activate({ game, id, card }) {
  switch(card.color) {
    case Color.Blue:
      return {
        type: (state, { game, id, card }) => ({
          ...state,
          games: {
            ...state.games,
            [game]: {
              ...state.games[game],
              money: state.games[game].money.map((qty, i) =>
                qty + state.games[game].cards[i][card.id] * (
                  card.cards = state.games[game].cards[i],
                  card.goals = state.games[game].goals[i],
                  card.value
                )
              )
            }
          }
        }),
        game, id, card
      }
    case Color.Green:
      return {
        type: (state, { game, id, card }) => ({
          ...state,
          games: {
            ...state.games,
            [game]: {
              ...state.games[game],
              money: state.games[game].money.map((qty, i) => i !== id
                ? qty
                : qty + state.games[game].cards[i][card.id] * (
                  card.cards = state.games[game].cards[i],
                  card.goals = state.games[game].goals[i],
                  card.value
                )
              )
            }
          }
        }),
        game, id, card
      };
    case Color.Red:
      return {
        type: (state, { game, id, card }) => {
          const money = [...state.games[game].money]
          for(let i = state.games[game].turnOrder[id]; i !== id; i = state.games[game].turnOrder[i]) {
            if(i >= state.games[game].players.length) { continue; }
            if(state.games[game].cards[i][card.id] > 0) {
              card.cards = state.games[game].cards[i];
              card.goals = state.games[game].goals[i];
              const profit = Math.min(money[id], state.games[game].cards[i][card.id] * card.value);
              money[id] -= profit;
              money[i] += profit;
            }
          }
          return ({
            ...state,
            games: {
              ...state.games,
              [game]: { ...state.games[game], money }
            }
          });
        },
        game, id, card
      };
    case Color.Purple:
      // purple are too special, so do it manually from the client side
      return { type: state => state, game, id, card };
  }
}

export function Stadium({ game, id }) {
  return {
    type: (state, { game, id }) => {
      const money = [...state.games[game].money];
      for(let i = 0; i < state.games[game].players.length; ++i) {
        if(i === id) { continue; }
        const profit = Math.min(money[i], Card.Stadium.value);
        money[i] -= profit;
        money[id] += profit;
      }
      return {
        ...state,
        games: {
          ...state.games,
          [game]: { ...state.games[game], money }
        }
      };
    },
    game, id
  }
}

export function TVStation({ game, you, them }) {
  return {
    type: (state, { game, you, them }) => {
      const money = [...state.games[game].money]
      const profit = Math.min(money[them], Card.TVStation.value);
      money[them] -= profit;
      money[you] += profit;
      return {
        ...state,
        games: {
          ...state.games,
          [game]: { ...state.games[game], money }
        }
      };
    },
    game, you, them
  }
}

export function BusinessCenter({ game, you, them, yours, theirs }) {
  return {
    type: (state, { game, you, them, yours, theirs }) => {
      if(theirs.color === Color.Purple || yours.color === Color.Purple) { return state; }
      if(state.games[game].cards[you][yours.id] === 0 || state.games[game].cards[them][theirs.id] === 0) { return state; }
      if(yours.id === theirs.id) { return {...state}; } // this is a valid action, but does not change anything
      return {
        ...state,
        games: {
          ...state.games,
          [game]: {
            ...state.games[game],
            cards: state.games[game].cards.map((list, i) => i === you
              ? list.map((qty, i) => i === yours.id ? qty - 1 : i === theirs.id ? qty + 1 : qty)
              : i === them
                ? list.map((qty, i) => i === theirs.id ? qty - 1 : i === yours.id ? qty + 1 : qty)
                : [...list]
              )
          }
        }
      }
    },
    game, you, them, yours, theirs
  }
}

export function EndTurn({ game }) {
  return {
    type: (state, { game }) => {
      let turn = state.games[game].turnOrder[state.games[game].turn];
      while(turn >= state.games[game].players.length) {
        turn = state.games[game].turnOrder[turn];
      }
      return {
        ...state,
        games: {
          ...state.games,
          [game]: {
            ...state.games[game],
            dice: null,
            turn
          }
        }
      };
    },
    game
  };
}

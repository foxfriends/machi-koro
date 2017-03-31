'use strict';

import { Card, Color } from '../../cards';
import Landmark from '../../landmarks';

export function Dice({ dice }) {
  return {
    type: (state, { dice }) => ({
      ...state,
      data: {
        ...state.data,
        dice
      }
    }),
    dice
  };
}

export function ActivateCard({ id, card }) {
  card = Card[card.id]; // refresh card so value is calculated correctly
  switch(card.color) {
    case Color.Red:
      return {
        type: (state, { id, card }) => {
          const money = [...state.data.money]
          for(let i = state.data.turnOrder[id]; i !== id; i = state.data.turnOrder[i]) {
            if(i >= state.data.players.length) { continue; }
            if(state.data.cards[i][card.id] > 0) {
              card.cards = state.data.cards[i];
              card.goals = state.data.goals[i];
              const profit = Math.min(money[id], state.data.cards[i][card.id] * card.value);
              money[id] -= profit;
              money[i] += profit;
            }
          }
          return ({
            ...state,
            data: { ...state.data, money }
          });
        },
        id, card
      };
    case Color.Green:
      return {
        type: (state, { id, card }) => ({
          ...state,
          data: {
            ...state.data,
            money: state.data.money.map((qty, i) => i !== id
              ? qty
              : qty + state.data.cards[i][card.id] * (
                card.cards = state.data.cards[i],
                card.goals = state.data.goals[i],
                card.value
              )
            )
          }
        }),
        id, card
      };
    case Color.Blue:
      return {
        type: (state, { id, card }) => ({
          ...state,
          data: {
            ...state.data,
            money: state.data.money.map((qty, i) =>
              qty + state.data.cards[i][card.id] * (
                card.cards = state.data.cards[i],
                card.goals = state.data.goals[i],
                card.value
              )
            )
          }
        }),
        id, card
      };
    case Color.Purple:
      return { type: state => state };
  }
}

export function Stadium({ id }) {
  return {
    type: (state, { id }) => {
      const money = [...state.data.money];
      for(let i = 0; i < state.data.players.length; ++i) {
        if(i === id) { continue; }
        const profit = Math.min(money[i], Card.Stadium.value);
        money[i] -= profit;
        money[id] += profit;
      }
      return {
        ...state,
        data: { ...state.data, money }
      };
    },
    id
  };
}

export function TVStation({ you, them }) {
  return {
    type: (state, { you, them }) => {
      const money = [...state.data.money]
      const profit = Math.min(money[them], Card.TVStation.value);
      money[them] -= profit;
      money[you] += profit;
      return {
        ...state,
        data: { ...state.data, money }
      };
    },
    you, them
  }
}

export function BusinessCenter({ you, yours, them, theirs }) {
  return {
    type: (state, { you, them, yours, theirs }) => {
      if(theirs.color === Color.Purple || yours.color === Color.Purple) { return state; }
      if(state.data.cards[you][yours.id] === 0 || state.data.cards[them][theirs.id] === 0) { return state; }
      if(yours.id === theirs.id) { return {...state}; } // this is a valid action, but does not change anything
      return {
        ...state,
        data: {
          ...state.data,
          cards: state.data.cards.map((list, i) => i === you
            ? list.map((qty, i) => i === yours.id ? qty - 1 : i === theirs.id ? qty + 1 : qty)
            : i === them
              ? list.map((qty, i) => i === theirs.id ? qty - 1 : i === yours.id ? qty + 1 : qty)
              : [...list]
            )
        }
      };
    },
    you, them, yours, theirs
  }
}


export function Purchase({ id, card }) {
  return {
    type: (state, { id, card }) => {
      card = Card[card];
      if(state.data.money[id] < card.cost) { return state; }
      if(state.data.cardsLeft[card.id] === 0) { return state; }
      if(card.color === Color.Purple && state.data.cards[id][card.id]) { return state; }
      return {
        ...state,
        data: {
          ...state.data,
          cardsLeft: state.data.cardsLeft.map((qty, i) => i !== card.id ? qty : qty - 1),
          cards: state.data.cards.map((list, i) => i !== id
            ? [...list]
            : list.map((count, i) => i !== card.id ? count : count + 1)
          ),
          money: state.data.money.map((qty, i) => i !== id ? qty : qty - card.cost)
        }
      }
    },
    id, card
  };
}

export function Construct({ id, landmark }) {
  return {
    type: (state, { game, id, landmark }) => {
      landmark = Landmark[landmark];
      if(state.data.money[id] < landmark.cost) { return state; }
      if(state.data.goals[id][landmark.id]) { return state; }
      return {
        ...state,
        data: {
          ...state.data,
          money: state.data.money.map((qty, i) => i !== id ? qty : qty - landmark.cost),
          goals: state.data.goals.map((list, i) => i !== id
            ? [...list]
            : list.map((built, i) => landmark.id === i || built))
        }
      }
    },
    id, landmark
  }
}

export function EndTurn({ turn }) {
  return {
    type: (state, { turn }) => ({
      ...state,
      data: {
        ...state.data,
        turn,
      }
    }),
    turn
  };
}

'use strict';
import Landmark from './landmarks';

const Color = {
  Blue: Symbol('Color.Blue'),
  Green: Symbol('Color.Green'),
  Red: Symbol('Color.Red'),
  Purple: Symbol('Color.Purple')
};

// to get actual values, be sure to set cards and goals
class Card {
  static get WheatField() {
    return {
      cost: 1,
      activation: [1],
      color: Color.Blue,
      value: 1,
      id: 0,
    }
  }
  static get [0]() { return Card.WheatField; }

  static get Ranch() {
    return {
      cost: 1,
      activation: [2],
      color: Color.Blue,
      value: 1,
      id: 1,
    }
  }
  static get [1]() { return Card.Ranch; }

  static get Bakery() {
    return {
      cost: 1,
      activation: [2, 3],
      color: Color.Green,
      get value() { return this.goals[Landmark.ShoppingMall.id] ? 2 : 1 },
      id: 2,
    }
  }
  static get [2]() { return Card.Bakery; }

  static get Cafe() {
    return {
      cost: 2,
      activation: [3],
      color: Color.Red,
      get value() { return this.goals[Landmark.ShoppingMall.id] ? 2 : 1 },
      id: 3,
    }
  }
  static get [3]() { return Card.Cafe; }

  static get ConvenienceStore() {
    return {
      cost: 2,
      activation: [4],
      color: Color.Green,
      get value() { return this.goals[Landmark.ShoppingMall.id] ? 4 : 3 },
      id: 4,
    }
  }
  static get [4]() { return Card.ConvenienceStore; }

  static get Forest() {
    return {
      cost: 3,
      activation: [5],
      color: Color.Blue,
      value: 1,
      id: 5,
    }
  }
  static get [5]() { return Card.Forest; }

  static get Stadium() {
    return {
      cost: 6,
      activation: [6],
      color: Color.Purple,
      value: 2,
      id: 6,
    }
  }
  static get [6]() { return Card.Stadium; }

  static get TVCenter() {
    return {
      cost: 7,
      activation: [6],
      color: Color.Purple,
      value: 5,
      id: 7,
    }
  }
  static get [7]() { return Card.TVCenter; }

  static get BusinessCenter() {
    return {
      cost: 8,
      activation: 6,
      color: Color.Purple,
      value: 0,
      id: 8,
    }
  }
  static get [8]() { return Card.BusinessCenter; }

  static get CheeseFactory() {
    return {
      cost: 5,
      activation: [7],
      color: Color.Green,
      get value() { return this.cards[Card.Ranch.id] * 3 },
      id: 9,
    }
  }
  static get [9]() { return Card.CheeseFactory; }

  static get FurnitureFactory() {
    return {
      cost: 3,
      activation: [8],
      color: Color.Green,
      get value() { return (this.cards[Card.Forest.id] + this.cards[Card.Mine.id]) * 3 },
      id: 10,
    }
  }
  static get [10]() { return Card.FurnitureFactory; }

  static get Mine() {
    return {
      cost: 6,
      activation: [9],
      color: Color.Blue,
      value: 5,
      id: 11,
    }
  }
  static get [11]() { return Card.Mine; }

  static get FamilyRestaurant() {
    return {
      cost: 3,
      activation: [9, 10],
      color: Color.Red,
      get value() { return this.goals[Landmark.ShoppingMall.id] ? 4 : 3 },
      id: 12,
    }
  }
  static get [12]() { return Card.FamilyRestaurant; }

  static get AppleOrchard() {
    return {
      cost: 3,
      activation: [10],
      color: Color.Blue,
      value: 3,
      id: 13,
    }
  }
  static get [13]() { return Card.AppleOrchard; }

  static get FruitAndVegetableMarket() {
    return {
      cost: 2,
      activation: [11, 12],
      color: Color.Green,
      get value() { return (this.cards[Card.WheatField.id] + this.cards[Card.AppleOrchard.id]) * 2 },
      id: 14,
    }
  }
  static get [14]() { return Card.FruitAndVegetableMarket; }

  static *[Symbol.iterator]() {
    for(let i = 0; i < 15; ++i) {
      yield Card[i];
    }
  }
}

export default Card;
export { Card, Color };

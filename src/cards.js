'use strict';
import { Landmark, Purchase } from './landmarks';

const Color = {
  Blue: 'blue',
  Green: 'green',
  Red: 'red',
  Purple: 'purple',
};

function nonenumerable(target, name, descriptor) {
  descriptor.enumerable = false;
  return descriptor;
}

// to get actual values, be sure to set cards and goals
class Card {
  static get WheatField() {
    return {
      name: 'Wheat Field',
      cost: 1,
      activation: [1],
      color: Color.Blue,
      value: 1,
      id: 0,
      type: Purchase.Establishment,
    }
  }
  static get [0]() { return Card.WheatField; }

  static get Ranch() {
    return {
      name: 'Ranch',
      cost: 1,
      activation: [2],
      color: Color.Blue,
      value: 1,
      id: 1,
      type: Purchase.Establishment,
    }
  }
  static get [1]() { return Card.Ranch; }

  static get Bakery() {
    return {
      name: 'Bakery',
      cost: 1,
      activation: [2, 3],
      color: Color.Green,
      @nonenumerable get value() { return this.goals[Landmark.ShoppingMall.id] ? 2 : 1 },
      id: 2,
      type: Purchase.Establishment,
    }
  }
  static get [2]() { return Card.Bakery; }

  static get Cafe() {
    return {
      name: 'Cafe',
      cost: 2,
      activation: [3],
      color: Color.Red,
      @nonenumerable get value() { return this.goals[Landmark.ShoppingMall.id] ? 2 : 1 },
      id: 3,
      type: Purchase.Establishment,
    }
  }
  static get [3]() { return Card.Cafe; }

  static get ConvenienceStore() {
    return {
      name: 'Convenience Store',
      cost: 2,
      activation: [4],
      color: Color.Green,
      @nonenumerable get value() { return this.goals[Landmark.ShoppingMall.id] ? 4 : 3 },
      id: 4,
      type: Purchase.Establishment,
    }
  }
  static get [4]() { return Card.ConvenienceStore; }

  static get Forest() {
    return {
      name: 'Forest',
      cost: 3,
      activation: [5],
      color: Color.Blue,
      value: 1,
      id: 5,
      type: Purchase.Establishment,
    }
  }
  static get [5]() { return Card.Forest; }

  static get Stadium() {
    return {
      name: 'Stadium',
      cost: 6,
      activation: [6],
      color: Color.Purple,
      value: 2,
      id: 6,
      type: Purchase.Establishment,
    }
  }
  static get [6]() { return Card.Stadium; }

  static get TVStation() {
    return {
      name: 'TV Station',
      cost: 7,
      activation: [6],
      color: Color.Purple,
      value: 5,
      id: 7,
      type: Purchase.Establishment,
    }
  }
  static get [7]() { return Card.TVStation; }

  static get BusinessCenter() {
    return {
      name: 'Business Center',
      cost: 8,
      activation: [6],
      color: Color.Purple,
      value: 0,
      id: 8,
      type: Purchase.Establishment,
    }
  }
  static get [8]() { return Card.BusinessCenter; }

  static get CheeseFactory() {
    return {
      name: 'Cheese Factory',
      cost: 5,
      activation: [7],
      color: Color.Green,
      @nonenumerable get value() { return this.cards[Card.Ranch.id] * 3 },
      id: 9,
      type: Purchase.Establishment,
    }
  }
  static get [9]() { return Card.CheeseFactory; }

  static get FurnitureFactory() {
    return {
      name: 'Furniture Factory',
      cost: 3,
      activation: [8],
      color: Color.Green,
      @nonenumerable get value() { return (this.cards[Card.Forest.id] + this.cards[Card.Mine.id]) * 3 },
      id: 10,
      type: Purchase.Establishment,
    }
  }
  static get [10]() { return Card.FurnitureFactory; }

  static get Mine() {
    return {
      name: 'Mine',
      cost: 6,
      activation: [9],
      color: Color.Blue,
      value: 5,
      id: 11,
      type: Purchase.Establishment,
    }
  }
  static get [11]() { return Card.Mine; }

  static get FamilyRestaurant() {
    return {
      name: 'Family Restaurant',
      cost: 3,
      activation: [9, 10],
      color: Color.Red,
      @nonenumerable get value() { return this.goals[Landmark.ShoppingMall.id] ? 4 : 3 },
      id: 12,
      type: Purchase.Establishment,
    }
  }
  static get [12]() { return Card.FamilyRestaurant; }

  static get AppleOrchard() {
    return {
      name: 'Apple Orchard',
      cost: 3,
      activation: [10],
      color: Color.Blue,
      value: 3,
      id: 13,
      type: Purchase.Establishment,
    }
  }
  static get [13]() { return Card.AppleOrchard; }

  static get FruitAndVegetableMarket() {
    return {
      name: 'Fruit and Vegetable Market',
      cost: 2,
      activation: [11, 12],
      color: Color.Green,
      @nonenumerable get value() { return (this.cards[Card.WheatField.id] + this.cards[Card.AppleOrchard.id]) * 2 },
      id: 14,
      type: Purchase.Establishment,
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
export { Card, Color, Purchase };

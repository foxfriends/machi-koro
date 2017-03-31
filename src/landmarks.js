'use strict';

const Purchase = {
  Landmark: 'landmark',
  Establishment: 'establishment',
};

class Landmark {
  static get TrainStation() {
    return {
      name: 'Train Station',
      cost: 4,
      id: 0,
      type: Purchase.Landmark,
    }
  }
  static get [0]() { return Landmark.TrainStation; }

  static get ShoppingMall() {
    return {
      name: 'Shopping Mall',
      cost: 10,
      id: 1,
      type: Purchase.Landmark,
    }
  }
  static get [1]() { return Landmark.ShoppingMall; }

  static get AmusementPark() {
    return {
      name: 'Amusement Park',
      cost: 16,
      id: 2,
      type: Purchase.Landmark,
    }
  }
  static get [2]() { return Landmark.AmusementPark; }

  static get RadioTower() {
    return {
      name: 'Radio Tower',
      cost: 22,
      id: 3,
      type: Purchase.Landmark,
    }
  }
  static get [3]() { return Landmark.RadioTower; }

  static *[Symbol.iterator]() {
    for(let i = 0; i < 4; ++i) {
      yield Landmark[i];
    }
  }
}

export default Landmark;
export { Landmark, Purchase };

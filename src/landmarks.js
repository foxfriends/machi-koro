'use strict';

class Landmark {
  static get TrainStation() {
    return {
      cost: 4,
      id: 0,
    }
  }
  static get [0]() { return Landmark.TrainStation; }

  static get ShoppingMall() {
    return {
      cost: 10,
      id: 1,
    }
  }
  static get [1]() { return Landmark.ShoppingMall; }

  static get AmusementPark() {
    return {
      cost: 16,
      id: 2,
    }
  }
  static get [2]() { return Landmark.AmusementPark; }

  static get RadioTower() {
    return {
      cost: 22,
      id: 3,
    }
  }
  static get [3]() { return Landmark.RadioTower; }
}

export default Landmark;
export { Landmark };

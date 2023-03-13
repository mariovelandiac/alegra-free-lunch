const possibleDishes = [
  'gratinChicken',
  'steak',
  'lemonChicken',
  'gratinMeat',
  'mixedRice',
  'veggie'
];
const dishesDetail = {
  gratinChicken: {
    name: 'Pollo gratinado',
    ingredients: {
      cheese: 2,
      chicken: 1,
      onion: 1,
      potato:2,
    },
  },
  steak: {
    name: 'Bistek de Carne',
    ingredients: {
      ketchup: 2,
      meat: 1,
      tomato: 2,
      rice: 1,
    }
  },
  lemonChicken: {
    name: 'Pollo al Limón',
    ingredients: {
      chicken: 1,
      lemon: 2,
      lettuce: 1,
      rice: 1,
    }
  },
  gratinMeat: {
    name: 'Bistek gratinado',
    ingredients: {
      cheese: 1,
      meat: 1,
      onion: 1,
      rice: 2,
    }
  },
  mixedRice: {
    name: 'Arroz Mixto',
    ingredients: {
      chicken: 1,
      meat: 1,
      onion: 1,
      rice: 2,
      tomato: 1,
    }
  },
  veggie: {
    name: 'Vegetariano',
    ingredients: {
      cheese:2,
      onion: 1,
      potato: 1,
      rice: 1,
      tomato: 1,
    }
  }

};
const max = 6; // cantidad de platos entre los que se puede escoger
const {v4} = require('uuid');

class Dish {
  constructor() {
    this.id = v4(); // id del plato pedido
    this.name = ''; // nombre del plato
    this.ingredients = {}; // ingredientes del plato
    this.delivered = false; // por defecto el plato aleatorio no se entrega cuando se genera, solo hasta que se obtienen los ingredientes
    this._init();
  };

  _init() {
    this.getRandomDish();
  }

  getRandomDish() {
    const randomDish = RandomDish.make();
    this.name = randomDish.name;
    this.ingredients = randomDish.ingredients;
  };

  deliver() {
    this.delivered = true;
  };


};

class RandomDish {
  constructor() {
  };

  static getRandomNumber() {
    return Math.floor((max)*Math.random());
  };

  static make() {
    const randomNumber = this.getRandomNumber(); // este número estará entre 0 y 5, que son los espacios disponibles por el array dishes
    const dishName = possibleDishes[randomNumber];
    const dish = dishesDetail[dishName];
    return dish
  };

};

module.exports = Dish;



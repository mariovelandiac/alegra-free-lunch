const {v4} = require('uuid');
const store = require('./../store/dynamodb');
const MENU_ENTITY = 'menu';
const config = require('./../config')

class Dish {
  constructor() {
    this.entity = 'Dish';
    this.id = v4(); // id del plato pedido
    this.name = ''; // nombre del plato
    this.ingredients = {}; // ingredientes del plato
    this.delivered = "false"; // por defecto el plato aleatorio no se entrega cuando se genera, solo hasta que se obtienen los ingredientes
    this.createdAt = new Date().toString();
  };

  async create() {
    await this.getRandomDish();
  }

  async getRandomDish() {
    const randomDish = await RandomDish.make();
    this.name = await randomDish.name;
    this.ingredients = await randomDish.ingredients;
  };

  deliver() {
    this.delivered = "true";
  };


};

class RandomDish {
  constructor() {
  };

  static async make() {
    const menu = new Menu;
    const randomNumber = this.getRandomNumber(menu.max); // este número estará entre 0 y 5, que son los espacios disponibles por el array dishes
    const dish = await menu.chooseDish(randomNumber);
    return dish
  };

  static getRandomNumber(max) {
    return Math.floor((max)*Math.random());
  };

};



class Menu {
  constructor() {
    this.max = config.menu.max // numero máximo de platos disponibles para escoger
  };

  async chooseDish(randomNumber) {
    const dish = await store.get(MENU_ENTITY, randomNumber.toString())
    return dish;
  };
};

module.exports = Dish;



const store = require('./../../store/dummy');
const TABLA = 'menu';

class Menu {
  constructor() {
    if (typeof Menu.instance === 'object') {
      console.log('aplica singleton');
      return Menu.instance
    };
    this.singleton = false;
  };

  async init() {
    this.menu = await this.getMenu();
    this.max = await this.menu.length
    this.singleton = true;
    Menu.instance = this;
    console.log('No aplica singleton');
    return this
  };

  async getMenu() {
    return await store.list(TABLA);
  }

  async chooseDish(randomNumber) {
    return this.menu[randomNumber];
  };

  async max() {
    return await this.menu.length;
  }
};

module.exports = Menu

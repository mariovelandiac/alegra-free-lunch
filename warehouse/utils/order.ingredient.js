const {v4} = require('uuid');
const boom = require('@hapi/boom');
const fetch = require('node-fetch');
const config = require('../../config');
const marketPlaceUrl = config.marketPlace.url;
const ORDERS_TABLE = 'ordersToMarket';
const store = require('../../store/dummy');

class OrderIngredient {
  constructor(name, dishId) {
    this.id = v4();
    this.name = name;
    this.quantitySold;
    this.dishId = dishId;
    this.createdAt = new Date();
    this.status;
    this.purchased;
  };

  async _init() {
    await this.marketPlace();
    await this.updateOnDB(store)
  };

  async marketPlace() {
    // Se realiza la petición al marketplace
    this.quantitySold = await this.getOnMarketPlace();

    // Si es igual a cero se vuelve a intentar hasta que sea diferente de cero
    while (this.quantitySold === 0) {
      this.quantitySold = await this.getOnMarketPlace();
    };
    // se verifica y se cambia el estado de la entrega del producto
    if (this.quantitySold !== 0) {
      this.purchased = true
    };
  }

  async getOnMarketPlace() {
    const url = `${marketPlaceUrl}/?ingredient=${this.name}`;
    const response = await fetch(url);
     // petición a la plaza de mercado
    if (response.status === 200) {
      const {quantitySold} = await response.json(); // paso a Json
      this.status = response.status
      return quantitySold;
    };

    if (response.status === 500) {
      this.status = response.status;
      this.purchased = false;
      throw boom.internal('No se puede establecer conexión con la plaza de mercado')
    };

    if (response.status === 404) {
      this.status = response.status;
      this.purchased = false;
      throw boom.notFound('No se encuentra el ingrediente pedido')
    } else {
      this.status = response.status;
      this.purchased = false;
      throw new Error(`Error en la plaza de mercado`)
    };
  };

  async updateOnDB(store) {
    await store.update(ORDERS_TABLE, this);
  };

};

module.exports = OrderIngredient

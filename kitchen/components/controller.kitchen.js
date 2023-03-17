const fetch = require('node-fetch');
const config = require('../config');
const Dish = require('./random.dish');
const boom = require('@hapi/boom');
const DISH_ENTITY = 'Dish';


// Se le inyecta un store al controller para que pueda cambiar de db fácilmente
function controller(injectedStore) {
  const store = injectedStore;
  if (!store) {
    // store = backup database
  };

  async function makeDish() {

    const newDish = new Dish(); // se crea una instancia de la clase plato
    await newDish.create(); // creación del nuevo plato
    // Plato creado y alamacenado
    await writeDishToHistory(newDish);

    // Petición a Warehouse
    const {error, status, body} = await getIngredientsOnWarehouse(newDish);

    const isValid = validateResponse(error, status, body);

    if (isValid) {
      const dish = cook(newDish.name); // se cocinan los ingredientes
      await updateDish(newDish); // se guarda el plato en el historial
      return {
        dish,
      };
    };
  };

  async function getQueue() {
    const queue = await store.getByIndex(DISH_ENTITY, 'false');
    return queue
  };

  async function getHistory(limit) {
    const queue = await store.list(DISH_ENTITY, parseInt(limit));
    return queue
  };

  function cook(name) {
    return `Disfrute de su plato: ${name}`;
  };

  async function getIngredientsOnWarehouse(dish) {
    const warehouseURL = `${config.warehouse.url}/api/warehouse/get-ingredients`;
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api': config.warehouse.key
      },
      body: JSON.stringify(dish),
    };
    const response = await fetch(warehouseURL, params); // Obtener ingredientes de la bodega
    const {error, status, body} = await response.json();
    return {
      error,
      status,
      body
    }

  };

  async function writeDishToHistory(dish) {
    await store.insert(dish);
  };

  async function updateDish(dish) {
    dish.deliver();
    await store.updateDishDelivered(dish.id, dish.delivered);
  };

  function validateResponse(error, status, body) {

    if(status === 404) {
      throw boom.notFound('Algo ha ocurrido en la bodega, vuelve a intentar');
    };

    if(status === 401) {
      throw boom.unauthorized('Problema con la api Key de la bodega');
    };

    if(status === 400) {
      throw boom.conflict('Ha ocurrido un problema consultando los ingredientes');
    };

    if(!body) {
      throw boom.failedDependency('Ha ocurrido un problema con la bodega');
    }

    if (error) {
      throw boom.conflict('Ha ocurrido un error en la bodega');
    };

    return true
  }

  return {
    makeDish,
    getQueue,
    getHistory
  }
};

module.exports = controller

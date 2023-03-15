const fetch = require('node-fetch');
const config = require('./../../../config');
const Dish = require('../../utils/create.random.dish');
const boom = require('@hapi/boom');
const DISH_TABLA = 'dishQueue';
const DISH_HISTORY = 'dishHistory';
const storedb = require('./../../../store/db')

// Se le inyecta un store al controller para que pueda cambiar de db fácilmente
function controller(injectedStore) {
  const store = injectedStore;
  if (!store) {
    // store = backup database
  };

  async function makeDish() {

    const newDish = new Dish(); // se crea una instancia de la clase plato
    await newDish.create(); // creación del nuevo plato
    // Plato almacenado en cola de platos pendientes
    await writeDishToQueue(newDish);

    // Petición a Warehouse
    const {error, status, body} = await getIngredientsOnWarehouse(newDish);


    const valid = validateResponse(error, status, body);

    if (valid) {
      const dish = cook(newDish.name); // se cocinan los ingredientes
      await removeDishFromQueue(newDish); // se elimina de la lista de pedidos pendeinte
      await writeDishToHistory(newDish); // se guarda el plato en el historial
      return {
        dish,
      };
    };
  };

  async function getQueue() {
    const queue = await store.list(DISH_TABLA);
    return queue
  };

  async function getHistory() {
    const queue = await store.list(DISH_HISTORY);
    return queue
  };

  function cook(name) {
    return `Disfrute de su plato: ${name}`;
  };

  async function getIngredientsOnWarehouse(dish) {
    const warehouseURL = `${config.warehouse.host}:${config.warehouse.port}/get-ingredients`;
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

  async function removeDishFromQueue (dish) {
    setTimeout(async () => {
      const response = await store.remove(DISH_TABLA, dish.id);
      if (!response) {
        throw boom.conflict('No se ha podido elimina de la lista, DB')
      };
    }, 5000)
  };

  async function writeDishToQueue(dish) {
    const dishToQueue = {...dish};
    const response = await store.insert(DISH_TABLA, dishToQueue);
    const response2 = await storedb.insert(dishToQueue, 'dish');
    console.log(response2)
    if (!response) {
      return false
    };
  };

  async function writeDishToHistory(dish) {
    dish.deliver();
    await store.insert(DISH_HISTORY, dish);
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

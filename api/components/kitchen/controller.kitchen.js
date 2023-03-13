const fetch = require('node-fetch');
const config = require('./../../../config');
const Dish = require('../../utils/create.random.dish');
const boom = require('@hapi/boom');
const DISH_TABLA = 'dishQueue';
const DISH_HISTORY = 'dishHistory';

// Se le inyecta un store al controller para que pueda cambiar de db fácilmente
function controller(injectedStore) {
  const store = injectedStore;
  if (!store) {
    // store = backup database
  };

  async function makeDish() {

    const newDish = new Dish(); // se escoge un plato al azar entre las recetas disponibles en ./utils/select.one.dish
    const ingredientsRequired = newDish.ingredients;
    // Plato almacenado en cola de platos pendientes
    await writeDishToQueue(newDish);

    // Petición a Warehouse
    const {error, status, body} = await getIngredientsOnWarehouse(ingredientsRequired);
    if (error) {
      throw boom.conflict('Ha ocurrido un error en la bodega');
    };

    if (!body) {
      throw boom.serverUnavailable('El servicio de bodega no está disponible');
    };

    if(status === 404) {
      throw boom.notFound('Algo ha ocurrido en la bodega, vuelve a intentar');
    };

    if (body && status === 200) {
      const ingredients = body;
      const dish = cook(newDish.name); // se cocinan los ingredientes
      await removeDishFromQueue(newDish); // se elimina de la lista de pedidos pendeinte
      await writeDishToHistory(newDish); // se guarda el plato en el historial
      return {
        dish,
        ingredientsRequired,
        ingredients
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

  async function getIngredientsOnWarehouse(ingredientsRequired) {
    const warehouseURL = `${config.warehouse.host}:${config.warehouse.port}/get-ingredients`;
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ingredientsRequired)
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
    if (!response) {
      return false
    };
  };

  async function writeDishToHistory(dish) {
    dish.deliver();
    await store.insert(DISH_HISTORY, dish);
  };

  return {
    makeDish,
    getQueue,
    getHistory
  }
};

module.exports = controller

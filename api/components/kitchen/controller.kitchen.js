const selectOneDish = require('../../utils/select.one.dish');
const fetch = require('node-fetch');
const config = require('./../../../config');
// Se le inyecta un store al controller para que pueda cambiar de db fácilmente
module.exports = function (injectedStore) {
  const store = injectedStore;

  if (!store) {
    // store = backup database
  };

  async function makeDish() {
    const {details} = selectOneDish(); // se escoge un plato al azar entre las recetas disponibles en ./utils/select.one.dish
    const warehouseURL = `http://${config.warehouse.host}:${config.warehouse.port}/get-ingredients`
    const ingredientsRequired = details.ingredients;
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ingredientsRequired)
    }
    const response = await fetch(warehouseURL, params); // Obtener ingredientes de la bodega
    const {error, status, body} = await response.json();

    if (error) {
      throw new Error(error)
    }

    if (!body) {
      throw new Error('No se puede prerparar el plato')
    }

    if (body && status === 200) {
      const ingredients = body;
      const dish = cook(details.name); // se cocinan los ingredientes
      return {
        dish,
        ingredientsRequired,
        ingredients
      }
    }
  };

  function cook(name) {
    return `Disfrute de su plato: ${name}`;
  }

  return {
    makeDish
  }
};




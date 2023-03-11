const selectOneDish = require('../../utils/select.one.dish');
const warehouse = require('./../warehouse');
// Se le inyecta un store al controller para que pueda cambiar de db fácilmente
module.exports = function (injectedStore) {
  const store = injectedStore;

  if (!store) {
    // store = backup database
  };

  async function makeDish() {
    const {details} = selectOneDish(); // se escoge un plato al azar entre las recetas disponibles en ./utils/select.one.dish
    console.log('Ingredientes Pedidos:', details.ingredients);
    const ingredients = await warehouse.getIngredients(details.ingredients); // Obtener ingredientes de la bodega
    if (ingredients) {
      const dish = cook(details.name); // se cocinan los ingredientes
      return dish
    } else {
      throw new Error(`No se pudo preparar el plato ${details.name}`);
    }
  };

  function cook(dish) {
    return `Disfrute de su plato: ${dish}`;
  }

  return {
    makeDish
  }
};




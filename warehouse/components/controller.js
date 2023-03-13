const config = require('../../config');
const marketPlaceUrl = config.marketPlace.url;
const fetch = require('node-fetch');
const boom = require('@hapi/boom');
const TABLE = 'stock';

// Se le inyecta un store al controller para que pueda cambiar de db fácilmente
function controller(injectedStore) {

  const store = injectedStore;
  if (!store) {
    // store = backup database
  };

  async function getIngredients(ingredients) {

    // stock regresa un objeto literal con la cantidad restante de los ingredientes en la bodega en caso de ser suficiente, lack retorna en un array los faltantes en caso de que así sea
    let {newStock, lack} = await seekIngredients(ingredients);

    // En caso de que no haga falta comprar ingredientes
    if (lack.length === 0) {
      const response = await store.update(TABLE, newStock); // se actualiza la base de datos con el stock despues de obtener los ingredientes
      return response
    };

    // de acá en adelante solamente nos centraremos en los faltantes
    // Declaración de variables a usar dentro de las iteraciones
    let ingredientName, boughtIngredient, lackOfIngredient, ingredientToStock
    const boughtToStock = [];
    const orderIngredient = [];

    // Abastesimiento de ingredientes faltantes con una iteración de promesas
    const promises = await Promise.allSettled(
      // Lack es un array en donde el iéismo elemento impar corresponde con el ingrediente que falta y el iésimo elemento par es la cantidad
      lack.map(async item => {
        ingredientName = item[0];
        lackOfIngredient = item[1];

        // compra de ingredientes realizada al mercado
        boughtIngredient = await buyIngredient(ingredientName, lackOfIngredient);
        // se añade un array con las cantidades compradas al mercado
        orderIngredient.push(boughtIngredient);
        // se resta lo comprado menos lo necesitado para retornar al stock
        ingredientToStock = await boughtIngredient - lackOfIngredient;
        // bougthStock es un array en donde el íesimo elmento corresponde al iésimo elemento que se acabó, pero la nueva cantidad tras haber comprado más
        boughtToStock.push(ingredientToStock);
      })
    );
    const newOrder = {}
    console.log(promises);

    // array con todos los ingredientes faltantes
    const ingredientLack = lack.flat().filter(item => typeof item === 'string');
    // nuevo Objeto con los valores comprados según el ingrediente
    ingredientLack.forEach(function (item, iterator) {
      newStock[item] = boughtToStock[iterator]; // asociación del ingrediente faltante con la cantidad restante en el stock
      newOrder[item] = orderIngredient[iterator];
    });
    console.log('newOrder', newOrder);
    // se actualiza la base de datos
    const response = await store.update(TABLE, newStock); // se actualiza la base de datos con el stock despues de obtener los ingredientes
    return response
  };

  async function seekIngredients(ingredients) {

    // buscar en la bodega los disponibles
    const available = await store.list(TABLE);
    const name = Object.keys(ingredients);
    const value = Object.values(ingredients);
    let lack = [];
    let newStock = {};
    let amountAvailable, required, difference;

    name.forEach((item, iterator) => {
      amountAvailable = available[item]; // cantidad disponible del ingrediente iésimo;
      required = value[iterator]; // cantidad requerida por ingredientes
      difference = amountAvailable - required; // diferencia entre cantidad disponible y cantidad requerida

      if (difference <= 0) {
        lack.push([item, Math.abs(difference)]); // Array con elementos disponibles ara preparar la receta
      } else {
        newStock[item] = difference; // Objeto literal de elementos consumidos por la receta
      };
    });
    // newStock es un objeto literal con los items restantes tras consumirlos
    // lack es un array con los faltantes para cocinar el plato
    return {
      newStock,
      lack
    };
  };

  async function buyIngredient(ingredient, lackOfIngredient) {

    let quantitySold = await getIngredientOnMarketPlace(ingredient); // Se compra

    if (quantitySold > lackOfIngredient) {
        return quantitySold
    };
    // Si es cero o menor que lo necesitado, se vuelve a intentar hasta que sea suficiente
    while (quantitySold <= lackOfIngredient) {
      quantitySold += await getIngredientOnMarketPlace(ingredient);
    };
    return quantitySold
  }

  async function getIngredientOnMarketPlace(ingredient) {
    const url = `${marketPlaceUrl}/?ingredient=${ingredient}`
    const response = await fetch(url); // petición a la plaza de mercado

    if (response.status === 200) {
      const {quantitySold} = await response.json(); // paso a Json
      return quantitySold;
    };

    if (response.status === 500) {
      throw boom.internal('No se puede establecer conexión con la plaza de mercado')
    };

    if (response.status === 404) {
      throw boom.notFound('No se encuentra el ingrediente pedido')
    } else {
      throw new Error(`Error en la plaza de mercado`)
    };
  };

  return {
    getIngredients
  }
};

module.exports = controller

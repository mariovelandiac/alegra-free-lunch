const boom = require('@hapi/boom');
const OrderIngredient = require('../../utils/order.ingredient');
const STOCK_ENTITY = 'Stock';
const STOCK_ID = 'v1';
const ORDERS_ENTITY = 'OrderIngredient';
const config = require('./../../../config/index')


// Se le inyecta un store al controller para que pueda cambiar de db fácilmente
function controller(injectedStore) {
  const store = injectedStore;

  if (!store) {
    // store = backup database
  };

  async function getIngredients(dish) {
    // stock regresa un objeto literal con la cantidad restante de los ingredientes en la bodega en caso de ser suficiente, lack retorna en un array los faltantes en caso de que así sea
    let {available, lack} = await seekIngredients(dish.ingredients);
    // aqui voy, el problema básicament es que stock no es un stock sino un remaining y el available vendría siendo el stock actual, es necesario hacer la "resta"
    // En caso de que no haga falta comprar ingredientes
    if (lack.length === 0) {
      await validateStock(available);
      const response = await store.updateStock(available); // se actualiza la base de datos con el stock despues de obtener los ingredientes
      return response
    } else {
      // newIngredient es un objeto con las compras realizadas al marketplace
      // newStock es el resante de los ingredientes no consumidos en el marketplace
      const newStock = await buyIngredient(dish, lack);
      available = {
        ...available,
        ...newStock
      };
      await validateStock(available);
      const response = await store.updateStock(available); // se actualiza la base de datos con el stock despues de obtener los ingredientes
      return response
    };
  };

  async function getStock() {
    const stock = await store.get(STOCK_ENTITY, STOCK_ID);
    return stock
  };

  async function getOrders() {
    const orders = await store.list(ORDERS_ENTITY);
    return orders
  };

  async function seekIngredients(ingredients) {
    // buscar en la bodega los disponibles

    const response = await store.get(STOCK_ENTITY, STOCK_ID);
    const available = response.stock
    const name = Object.keys(ingredients);
    const value = Object.values(ingredients);
    let lack = [];
    let amountAvailable, required, difference;

    name.forEach((item, iterator) => {
      amountAvailable = available[item]; // cantidad disponible del ingrediente iésimo;
      required = value[iterator]; // cantidad requerida por ingredientes
      difference = amountAvailable - required; // diferencia entre cantidad disponible y cantidad requerida

      if (difference <= 0) {
        lack.push([item, Math.abs(difference)]); // Array con elementos disponibles ara preparar la receta
      } else {
        available[item] = difference; // Objeto literal de elementos consumidos por la receta
      };
    });
    // stock es un objeto literal con los items restantes tras consumirlos
    // lack es un array con los faltantes para cocinar el plato
    return {
      available,
      lack
    };
  };

  async function buyIngredient(dish, lack) {
    // Declaración de variables a usar dentro de las iteraciones
    let name, missingAmount, count
    const boughtToStock = [];
    const newStock = {};
    // Abastesimiento de ingredientes faltantes con una iteración de promesas
    await Promise.allSettled(
    // Lack es un array en donde el iéismo elemento impar corresponde con el ingrediente que falta y el iésimo elemento par es la cantidad
      lack.map(async item => {
        name = item[0];
        missingAmount = item[1];
        // Creacicón de orden de compra para cada ingrediente
        let orderIngredient = new OrderIngredient(name, dish.id);
        await orderIngredient._init();
        count = await orderIngredient.quantitySold;
        // Se realizan ordenes de compra hasta que la cantidad comprada sea mayor a la requerida
        while (count < missingAmount) {
          orderIngredient = new OrderIngredient(name, dish.id);
          count += orderIngredient.quantitySold;
        };
        // bougthStock es un array en donde el íesimo elmento corresponde al iésimo elemento que se acabó, pero la nueva cantidad tras haber comprado más
        boughtToStock.push(count);
      })
    );

    // array con todos los ingredientes faltantes
    const ingredientLack = lack.flat().filter(item => typeof item === 'string');
    // nuevo Objeto con los valores comprados según el ingrediente
    ingredientLack.forEach(function (item, iterator) {
      if (typeof boughtToStock[iterator] !== 'number') {
        throw boom.conflict('Error en la adquisición de ingredientes')
      }
      newStock[item] = boughtToStock[iterator]; // asociación del ingrediente faltante con la cantidad restante en el stock
    });
    return newStock
  };

  async function validateStock(stock) {
    const keys = Object.keys(stock);
    const values = Object.values(stock);
    if (keys.length != config.ingredients.max) {
      throw new Error('La dimensión del stock se ha modificado');
    }
    keys.forEach(item => {
      if (typeof item !== 'string') {
        throw new Error('Algo ha ocurrido con el stock');
      };
    values.forEach(item => {
      if (typeof item !== 'number' || isNaN(item)) {
        throw new Error('Algo ha ocurrido con el stock');
      };
    })
    });
  };

  return {
    getIngredients,
    getStock,
    getOrders
  }
};

module.exports = controller

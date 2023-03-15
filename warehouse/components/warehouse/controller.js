const boom = require('@hapi/boom');
const OrderIngredient = require('../../utils/order.ingredient');
const STOCK_TABLE = 'stock';
const ORDERS_TABLE = 'ordersToMarket';

// Se le inyecta un store al controller para que pueda cambiar de db fácilmente
function controller(injectedStore) {
  const store = injectedStore;

  if (!store) {
    // store = backup database
  };

  async function getIngredients(dish) {
    // stock regresa un objeto literal con la cantidad restante de los ingredientes en la bodega en caso de ser suficiente, lack retorna en un array los faltantes en caso de que así sea
    let {stock, lack} = await seekIngredients(dish.ingredients);
    // En caso de que no haga falta comprar ingredientes
    if (lack.length === 0) {
      await validateStock(stock);
      const response = await store.update(STOCK_TABLE, stock); // se actualiza la base de datos con el stock despues de obtener los ingredientes
      return response
    } else {
      // newIngredient es un objeto con las compras realizadas al marketplace
      // newStock es el resante de los ingredientes no consumidos en el marketplace
      const newStock = await buyIngredient(dish, lack);
      stock = {
        ...stock,
        ...newStock
      };
      await validateStock(stock);
      const response = await store.update(STOCK_TABLE, stock); // se actualiza la base de datos con el stock despues de obtener los ingredientes
      return response
    };
  };

  async function getStock() {
    const stock = await store.list(STOCK_TABLE);
    return stock
  };

  async function getOrders() {
    const orders = await store.list(ORDERS_TABLE);
    return orders
  };

  async function seekIngredients(ingredients) {
    // buscar en la bodega los disponibles
    const available = await store.list(STOCK_TABLE);
    const name = Object.keys(ingredients);
    const value = Object.values(ingredients);
    let lack = [];
    let stock = {};
    let amountAvailable, required, difference;

    name.forEach((item, iterator) => {
      amountAvailable = available[item]; // cantidad disponible del ingrediente iésimo;
      required = value[iterator]; // cantidad requerida por ingredientes
      difference = amountAvailable - required; // diferencia entre cantidad disponible y cantidad requerida

      if (difference <= 0) {
        lack.push([item, Math.abs(difference)]); // Array con elementos disponibles ara preparar la receta
      } else {
        stock[item] = difference; // Objeto literal de elementos consumidos por la receta
      };
    });
    // stock es un objeto literal con los items restantes tras consumirlos
    // lack es un array con los faltantes para cocinar el plato
    return {
      stock,
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

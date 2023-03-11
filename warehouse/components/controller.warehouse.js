const config = require('./../../config');
const marketPlaceUrl = config.marketPlace.url;
const fetch = require('node-fetch');


// Se le inyecta un store al controller para que pueda cambiar de db fácilmente
module.exports = function (injectedStore) {
  const store = injectedStore;
  if (!store) {
    // store = backup database
  };

  async function getIngredients(ingredients) {


    let {stock, lack} = await areEnough(ingredients); // stock regresa un objeto listeral con la cantidad restante de los ingredientes en la bodega en caso de ser suficiente, lack retorna en un array los faltantes en caso de que así sea
    // En caso de que no falte nada
    if (lack.length === 0) {
      const response = await store.update(stock); // se actualiza la base de datos con el stock despues de obtener los ingredientes
      return response
    };

    // de acá en adelante solamente nos centraremos en los faltantes
    // Declaración de variables a usar dentro de las iteraciones
    let ingredientName, boughtIngredient, lackOfIngredient, ingredientStock
    let boughtStock = [];
    // Abastesimiento de ingredientes faltantes con una iteración de promesas
    await Promise.allSettled(
      // Lack es un array en donde el iéismo elemento corresponde con el ingrediente que falta y la cantidad que falta
      lack.map(async item => {
        ingredientName = item[0];
        lackOfIngredient = item[1];
        // está función retorna una cantidad de ingredientes que sea mayor a la que es requerida
        boughtIngredient = await buyIngredient(ingredientName, lackOfIngredient);
        ingredientStock = await boughtIngredient - lackOfIngredient; // se resta lo comprado menos lo necesitado para retornar al stock
        // bougthStock es un array en donde el íesimo elmento corresponde al iésimo elemento que se acabó, pero la nueva cantidad tras haber comprado más
        boughtStock.push(ingredientStock);
      })
    );



      // array con todos los ingredientes faltantes
      const ingredientLack = lack.flat().filter(item => typeof item === 'string');
      // nuevo Objeto con los valores comprados según el ingrediente

      const newStock = {};
      ingredientLack.map(async function (item, i) {
        return newStock[item] = boughtStock[i]; // asociación del ingrediente faltante con la cantidad restante en el stock
      });

      stock = {
        ...stock,
        ...newStock
      };
      // se actualiza la base de datos
    const response = await store.update(stock); // se actualiza la base de datos con el stock despues de obtener los ingredientes
    return response
  };

  async function areEnough(ingredients) {
    const available = await store.list();
    const ingredientsArray = Object.entries(ingredients);
    let lack = [];
    let stock = {};
    let amountOfIngredientAvailable, recipeName, required, difference;

    ingredientsArray.forEach(item => {
      recipeName = item[0];
      required = item[1];
      amountOfIngredientAvailable = available[recipeName]; // cantidad disponible del ingrediente iésimo;
      difference = amountOfIngredientAvailable - required; // diferencia entre cantidad disponible y cantidad requerida

      if (difference <= 0) {
        lack.push([recipeName, Math.abs(difference)]); // Array con elementos disponibles ara preparar la receta
      } else {
        stock[recipeName] = difference; // Objeto literal de elementos consumidos por la receta
      };
    });

    // acá se puede retornar un array más,con la cantidad faltante y lo que hay que pedir
    return {
      stock,
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
      } else {
        throw new Error(`No se puede establacer conexión con ${url}`)
      };
    };

  return {
    getIngredients
  }
};




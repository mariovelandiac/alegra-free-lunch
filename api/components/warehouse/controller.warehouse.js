const config = require('./../../../config');
const marketPlaceUrl = config.marketPlace.url;
const fetch = require('node-fetch');
let newStock = {};

// Se le inyecta un store al controller para que pueda cambiar de db fácilmente
module.exports = function (injectedStore) {
  const store = injectedStore;
  if (!store) {
    // store = backup database
  };

  async function getIngredients(ingredients) {

    let {stock, lack} = await areEnough(ingredients); // stock regresa un objeto listeral con la cantidad restante de los ingredientes en la bodega en caso de ser suficiente, lack retorna en un array los faltantes en caso de que así sea
    if (lack.length === 0) {
      const response = await store.update(stock); // se actualiza la base de datos con el stock despues de obtener los ingredientes
      return response
    };
    console.log('lack',lack);
    // de acá en adelante solamente nos centraremos en los faltantes
    // si con el pedido se termina un recurso, de hace el pedido y se actualiza la base de datos
    let ingredientName, boughtIngredient, lackOfIngredient, ingredientStock;


    // revisar, cuando hay dos o más elementos en lack, algo empieza a fallar
    await Promise.allSettled(
      lack.map(async item => {
        ingredientName = item[0];
        console.log('ingredientName', ingredientName)
        lackOfIngredient = item[1];
        boughtIngredient = await buyIngredient(ingredientName); // ingrediente y cantidad requerida, la respuesta el cantidad comprada, mayor que cero
        while (boughtIngredient <=   lackOfIngredient) { // Se garantiza que la cantidad comprada sea mayor a la requerida
          console.log(`Repited bought of ${ingredientName}`, boughtIngredient)
          boughtIngredient = boughtIngredient + await buyIngredient(ingredientName);
        };

        ingredientStock = await boughtIngredient - lackOfIngredient;
        console.log(`Nuevo numero de ${ingredientName} en Stock`, ingredientStock);

        stock[ingredientName] = ingredientStock
      })
    );

    console.log('Stock actualizado', stock)
    const response = await store.update(stock); // se actualiza la base de datos con el stock despues de obtener los ingredientes
    return response
  };


  async function buyIngredient(ingredient) {
    const response = await fetch(`${marketPlaceUrl}/?ingredient=${ingredient}`);
    let {quantitySold} = await response.json();
    console.log(`Compra de ${quantitySold} unidades de ${ingredient}`);
    if (quantitySold === 0) { // uso de recurrencia para garantizar que se retorna un valor diferente de cero
      quantitySold = await buyIngredient(ingredient);
      return quantitySold;
    } else {
      return quantitySold
    }
  }

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
    return {
      stock,
      lack
    };

  };




  return {
    getIngredients
  }
};




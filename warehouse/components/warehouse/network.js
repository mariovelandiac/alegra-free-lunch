const express = require('express');
const router = express.Router(); // router
const response = require('./../../../network/response'); // respuestas de la api
const controller = require('./index'); // conexión a base de datos
const {checkApiKey} = require('../../../middlewares/auth.handler');
const validatorHandler = require('../../../middlewares/validator.handler');
const getIngredientsSchema = require('./../../schemas/ingredients.schema')

router.post('/get-ingredients',
validatorHandler(getIngredientsSchema, 'body'), // validacion de datos entrantes para asegurar el funcionamiento del microservicio
checkApiKey, // para hacer una petición post es necesaria la clave de la api
getIngredients
);

router.get('/orders-history', ordersHistory);
router.get('/stock', getStock);

// Otras peticiones
router.get('/:else', function (req, res) {
  response.error(req, res, 'Not Found', 404);
});

// funciones del CRUD

async function getIngredients(req, res, next) {
  try {
    const dish = req.body;
    const ingredients = await controller.getIngredients(dish);
    response.success(req, res, ingredients, 200);
  } catch (e) {
    next(e)
  }
};

async function ordersHistory(req, res, next) {
  try {
    const orders = await controller.getOrders();
    response.success(req, res, orders, 200);
  } catch (e) {
    next(e)
  }
};

async function getStock(req, res, next) {
  try {
    const orders = await controller.getStock();
    response.success(req, res, orders, 200);
  } catch (e) {
    next(e)
  }
};


module.exports = router

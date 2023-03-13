const express = require('express');
const router = express.Router(); // router
const response = require('../../network/response'); // respuestas de la api
const controller = require('./index'); // conexión a base de datos


router.post('/get-ingredients', getIngredients);
router.get('/orders-history', ordersHistory);

// Otras peticiones
router.get('/:else', function (req, res) {
  response.success(req, res, 'Not Found', 404);
});

// funciones del CRUD

async function getIngredients(req, res, next) {
  try {
    const ingredientsRequired = req.body;
    const ingredients = await controller.getIngredients(ingredientsRequired);
    response.sucess(req, res, ingredients, 200);
  } catch (e) {
    next(e)
  }
};

async function ordersHistory(req, res, next) {
  try {
    const orders = await controller.getMarketplaceHistory();
    response.sucess(req, res, orders, 200);
  } catch (e) {
    next(e)
  }
};


module.exports = router

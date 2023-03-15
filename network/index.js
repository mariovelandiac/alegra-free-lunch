const express = require('express');
const router = express.Router();
const response = require('./response');
const kitchenRouter = require('./../api/components/kitchen/network.kitchen');

function routerApi(app) {

    app.get('/', (req, res) => { // endpoint documentación
      response.success(req, res, 'Pide tu plato', 200)
    });

    app.use('/', router);
    router.use('/kitchen', kitchenRouter); // Router de la cocina

    app.use('/:else', (req, res) => response.error(req, res, 'Not found', 404)); // respuesta para todas las demás peticiones
}
module.exports = routerApi;

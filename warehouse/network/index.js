const express = require('express');
const router = express.Router();
const response = require('./response');
const warehouseRouter = require('./../components/network.warehouse');

function routerApi(app) {

    app.get('/', (req, res) => { // endpoint documentación
      response.success(req, res, 'Bienvenido/a a la Bodega', 200)
    });

    app.use('/', router);
    router.use('/api/warehouse', warehouseRouter); // Router de la cocina

    app.use('/:else', (req, res) => response.error(req, res, 'Not found', 404)); // respuesta para todas las demás peticiones
}
module.exports = routerApi;

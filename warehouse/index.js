const express = require('express');
const app = express();
const config = require('./../config');
const apiRouter = require('./components/network');
const {logErrors, errorHandler} = require('./../middlewares/error.handler');

// uso de formatos tipo JSON
app.use(express.json());

// rutas
app.use(apiRouter);

// middelware de errores
app.use(logErrors);
app.use(errorHandler);


app.listen(config.warehouse.port, () => {
  console.log(`Bodega escuchando en el puerto ${config.warehouse.port}`)
})

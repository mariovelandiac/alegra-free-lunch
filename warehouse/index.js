const express = require('express');
const app = express();
const config = require('./config');
const apiRouter = require('./components/network.warehouse');
const {logErrors, errorHandler, boomErrorHandler} = require('./middlewares/error.handler');

// uso de formatos tipo JSON
app.use(express.json());

// rutas
app.use(apiRouter);

// middelware de errores
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);


app.listen(config.port, () => {
  console.log(`Bodega escuchando en el puerto ${config.port}`)
})

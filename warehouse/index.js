const express = require('express');
const app = express();
const cors = require('cors');
const config = require('./config');
const apiRouter = require('./components/network.warehouse');
const {logErrors, errorHandler, boomErrorHandler} = require('./middlewares/error.handler');

// uso de formatos tipo JSON
app.use(express.json());

// Cors
// array preparado para ingresar IPS de dominios permitidos para hacer peticiones. Por caso de uso, se deja abierta la API
const whitelist = [];
const options = {
  origin: (origin, cb) => {
    if (whitelist.includes(origin) || !origin) {
      cb(null, true)
    } else {
      cb(new Error("domain not allowed"))
    };
  }
};
app.use(cors(options));

// rutas
app.use(apiRouter);

// middelware de errores
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);


app.listen(config.port, () => {
  console.log(`Bodega escuchando en el puerto ${config.port}`)
})

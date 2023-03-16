const express = require('express');
const app = express();
const cors = require('cors');
const config = require('./config');
const routerApi = require('./network/');
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
routerApi(app);

// middelware de errores
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);


app.listen(config.port, () => {
  if (!config.isProd) {
     console.log(`Bodega escuchando en el puerto ${config.port}`)
  };
})

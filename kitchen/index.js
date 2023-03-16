const express = require('express'); // importación de express
const app = express(); // aplicación de express
const cors = require('cors');
const config = require('./config'); // archivo de configuración
const routerApi = require('./network'); // router de la api de kitchen
const {logErrors, errorHandler, boomErrorHandler} = require('./middlewares/error.handler');

// habilitamos uso de JSON
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

// router
routerApi(app);

// middleware de errores
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

// Se le levanta la api de la cocina en el puerto dado por el archivo de configuración
app.listen(config.port, () => {
    if (!config.isProd) {		
    	console.log(`kitchen-api listening on port ${config.port}`)
    };
});

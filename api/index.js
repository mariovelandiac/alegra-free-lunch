const express = require('express'); // importación de express
const app = express(); // aplicación de express
app.use(express.json()); // habilitamos uso de JSON
const config = require('./../config'); // archivo de configuración
const routerApi = require('../network'); // router de la api de kitchen
const {logErrors, errorHandler, boomErrorHandler} = require('./../middlewares/error.handler');
// router
routerApi(app);

// middleware de errores
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

// Se le levanta la api de la cocina en el puerto dado por el archivo de configuración
app.listen(config.port, () => {
    console.log(`kitchen-api listening on port ${config.port}`)
});

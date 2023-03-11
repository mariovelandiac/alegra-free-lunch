const express = require('express'); // importación de express
const app = express(); // aplicación de express
app.use(express.json()); // habilitamos uso de JSON
const config = require('./../config'); // archivo de configuración
const router = require('../network'); // router de la api de kitchen

router(app);


// Se le levanta la api de la cocina en el puerto dado por el archivo de configuración
app.listen(config.port, () => {
    console.log(`kitchen-api listening on port ${config.port}`)
});

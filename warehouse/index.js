const express = require('express');
const app = express();
const config = require('./config');
const routerApi = require('./network/');
const cors = require('cors');
const {logErrors, errorHandler, boomErrorHandler} = require('./middlewares/error.handler');

const options = {
  origin: '*'
};

app.use(cors(options));
// uso de formatos tipo JSON
app.use(express.json());

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

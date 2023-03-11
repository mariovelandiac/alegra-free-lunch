const response = require('./../network/response');
const config = require('./../config');


function logErrors (err, req, res, next) {
  if (!config.isProd) {
    console.log(err);
  }
  next(err);
}


function errorHandler (err, req, res, next) {
  response.error(req, res, err, 500);
}

module.exports = {
  logErrors,
  errorHandler,
};

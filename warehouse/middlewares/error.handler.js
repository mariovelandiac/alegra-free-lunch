const response = require('./../network/response');
const config = require('./../config');

function logErrors (err, req, res, next) {
  if (!config.isProd) {
    console.log(err);
  }
  next(err);
};

function boomErrorHandler (err, req, res, next) {
  if (err.isBoom) {
    const {output} = err;
    response.error(req, res, output.payload, output.statusCode);
  } else {
    next(err)
  }
};

function errorHandler (err, req, res, next) {
  response.error(req, res, err, 500);
};

module.exports = {
  logErrors,
  boomErrorHandler,
  errorHandler,
};

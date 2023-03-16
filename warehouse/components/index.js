const store = require('./../store/dynamodb');
const controller = require('./controller.warehouse');

module.exports = controller(store);


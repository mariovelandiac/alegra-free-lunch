const store = require('./../store/dynamodb');
const controller = require('./controller.kitchen');

module.exports = controller(store);



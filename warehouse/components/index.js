const store = require('./../../store/dummy');
const controller = require('./controller.warehouse');

module.exports = controller(store);


// let store, cache;
// if (config.remoteDB) {
//   store = require('../../../store/remote-mysql');
//   cache = require('../../../store/remote-redis');
// } else {
//   store = require('./../../../store/mysql');
//   cache = require('./../../../store/redis');
// };

const pocketService = require('../modules/pocket/pocket.service');

const constructorPocketHelper = arr =>
  arr.map(el => pocketService.getPocketById(el));

module.exports = {
  constructorPocketHelper,
};

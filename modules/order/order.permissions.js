const { inputDataValidation } = require('../../utils/rules');
const {
  INPUT_FIELDS: { ORDER },
} = require('../../consts/input-fields');
const { orderValidator } = require('../../validators/order.validator');

const orderPermissionsMutation = {
  addOrder: inputDataValidation(ORDER, orderValidator),
  updateOrder: inputDataValidation(ORDER, orderValidator),
};

module.exports = { orderPermissionsMutation };

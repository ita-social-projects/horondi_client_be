const { and } = require('graphql-shield');

const { inputDataValidation } = require('../../utils/rules');
const {
  INPUT_FIELDS: { ORDER, LIMIT, SKIP, FILTER, DATE },
} = require('../../consts/input-fields');
const {
  orderValidator,
  getAllOrdersValidator,
  getOrdersStatisticValidator,
} = require('../../validators/order.validator');

const orderPermissionsMutation = {
  addOrder: inputDataValidation(ORDER, orderValidator),
  updateOrder: inputDataValidation(ORDER, orderValidator),
};

const orderPermissionsQuery = {
  getAllOrders: and(
    inputDataValidation(LIMIT, getAllOrdersValidator.limitValidator),
    inputDataValidation(SKIP, getAllOrdersValidator.skipValidator)
  ),
  getPaidOrdersStatistic: inputDataValidation(
    DATE,
    getOrdersStatisticValidator
  ),
  getOrdersStatistic: inputDataValidation(DATE, getOrdersStatisticValidator),
};

module.exports = { orderPermissionsMutation, orderPermissionsQuery };

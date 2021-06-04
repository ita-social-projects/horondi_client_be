const { and, or } = require('graphql-shield');
const { roles } = require('../../consts');

const {
  inputDataValidation,
  hasRoles,
  isAuthorized,
} = require('../../utils/rules');
const {
  INPUT_FIELDS: { ORDER, LIMIT, SKIP, FILTER, DATE },
} = require('../../consts/input-fields');

const { ADMIN, SUPERADMIN, USER } = roles;

const {
  orderValidator,
  getAllOrdersValidator,
  getOrdersStatisticValidator,
} = require('../../validators/order.validator');

const orderPermissionsMutation = {
  addOrder: inputDataValidation(ORDER, orderValidator),
  updateOrder: and(
    inputDataValidation(ORDER, orderValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteOrder: hasRoles([ADMIN, SUPERADMIN]),
};

const orderPermissionsQuery = {
  getAllOrders: and(
    inputDataValidation(LIMIT, getAllOrdersValidator.limitValidator),
    inputDataValidation(SKIP, getAllOrdersValidator.skipValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  getPaidOrdersStatistic: and(
    inputDataValidation(DATE, getOrdersStatisticValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  getOrdersStatistic: and(
    inputDataValidation(DATE, getOrdersStatisticValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  getOrderById: or(isAuthorized, hasRoles([ADMIN, SUPERADMIN, USER])),
};

module.exports = { orderPermissionsMutation, orderPermissionsQuery };

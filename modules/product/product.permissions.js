const { and } = require('graphql-shield');
const { productInputValidator } = require('../../validators/product.validator');
const { inputDataValidation } = require('../../utils/rules');
const { hasRoles } = require('../../utils/rules');
const {
  PRODUCT_FEATURES: { PRODUCT },
} = require('../../consts/product-features');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');

const productPermissionsMutation = {
  addProduct: and(
    inputDataValidation(PRODUCT, productInputValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  updateProduct: and(
    inputDataValidation(PRODUCT, productInputValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteProduct: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { productPermissionsMutation };

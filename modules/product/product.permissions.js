const { and } = require('graphql-shield');
const {
  productInputValidator,
  productFromConstructorInputValidator,
} = require('../../validators/product.validator');
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
  addProductFromConstructor: and(
    inputDataValidation(PRODUCT, productFromConstructorInputValidator)
  ),
  updateProduct: and(
    inputDataValidation(PRODUCT, productInputValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteProducts: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { productPermissionsMutation };

const {
  productInputValidator,
  deleteProductValidator,
} = require('../../validators/product.validator');
const { inputDataValidation } = require('../../utils/rules');
const { and } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const {
  PRODUCT_FEATURES: { PRODUCT, ID },
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
  deleteProduct: and(
    inputDataValidation(ID, deleteProductValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
};

module.exports = { productPermissionsMutation };

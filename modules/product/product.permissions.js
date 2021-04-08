const { hasRoles } = require('../../utils/rules');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');

const productPermissionsMutation = {
  addProduct: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { productPermissionsMutation };

const { allow } = require('graphql-shield');

const aboutUsPermissionsQuery = {
  getAllBlocks: allow,
};

const aboutUsPermissionsMutation = {
  addAboutUsBlock: allow,
};

module.exports = { aboutUsPermissionsQuery, aboutUsPermissionsMutation };

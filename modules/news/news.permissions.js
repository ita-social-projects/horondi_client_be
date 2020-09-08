const { allow } = require('graphql-shield');
const { isAuthorizedAdmin } = require('../../utils/rules');

const newsPermissionsQuery = {
    getAllNews: allow,
    getNewsById: allow
};

const newsPermissionsMutations = {
    deleteNews: isAuthorizedAdmin,
    addNews: isAuthorizedAdmin,
    updateNews: isAuthorizedAdmin
};

module.exports = { newsPermissionsQuery, newsPermissionsMutations }
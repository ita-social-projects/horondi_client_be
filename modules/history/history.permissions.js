const { hasRoles } = require('../../utils/rules');
const {
  roles: { SUPERADMIN, ADMIN },
} = require('../../consts');

const historyPermissionsQuery = {
  getAllHistoryRecords: hasRoles([SUPERADMIN, ADMIN]),
  getHistoryRecordById: hasRoles([SUPERADMIN, ADMIN]),
};

module.exports = { historyPermissionsQuery };

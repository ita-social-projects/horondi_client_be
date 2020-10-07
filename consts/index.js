const roles = {
  USER: 'user',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
};

const availableForRegistrationRoles = [roles.ADMIN];

const monthInMilliseconds = 2592000000;

module.exports = {
  roles,
  availableForRegistrationRoles,
  monthInMilliseconds,
};

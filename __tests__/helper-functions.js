const User = require('../modules/user/user.model');
const { ApolloServer } = require('apollo-server-express');
const config = require('../app');
const { createTestClient } = require('apollo-server-testing');
const bcrypt = require('bcryptjs');
const {
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD,
} = require('../dotenvValidator');
const registerAdmin = async (email, password) => {
  await User.deleteOne({ email: email });
  const admin = new User();
  admin.firstName = 'Super аdmin';
  admin.lastName = 'Super admin full';
  admin.email = email;
  admin.role = 'superadmin';
  admin.credentials = [
    {
      source: 'horondi',
      tokenPass: await bcrypt.hash(password, 12),
    },
  ];
  await admin.save();
  return admin;
};
const setupApp = async user => {
  const admin = await registerAdmin(SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD);

  const server = new ApolloServer({
    ...config,
    context: { user: user || admin },
  });
  return createTestClient(server);
};

module.exports = { setupApp, registerAdmin };

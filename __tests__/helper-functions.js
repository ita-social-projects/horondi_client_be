const { gql } = require('@apollo/client');
const User = require('../modules/user/user.model');
const { ApolloServer } = require('apollo-server-express');
const config = require('../app');
const { createTestClient } = require('apollo-server-testing');
const bcrypt = require('bcryptjs');

const setupApp = async user => {
  await User.deleteOne({ email: process.env.SUPER_ADMIN_EMAIL });
  const admin = new User();
  admin.firstName = 'Super аdmin';
  admin.lastName = 'Super admin full';
  admin.email = process.env.SUPER_ADMIN_EMAIL;
  admin.role = 'superadmin';
  admin.credentials = [
    {
      source: 'horondi',
      tokenPass: await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 12),
    },
  ];
  await admin.save();
  const server = new ApolloServer({
    ...config,
    context: { user: user || admin },
  });
  return createTestClient(server);
};

module.exports = { setupApp };

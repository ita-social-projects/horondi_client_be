const { gql } = require('@apollo/client');
const User = require('../modules/user/user.model');
const { ApolloServer } = require('apollo-server-express');
const client = require('../utils/apollo-test-client');
const config = require('../app');
const { createTestClient } = require('apollo-server-testing');
const bcrypt = require('bcryptjs');

const adminLogin = async user => {
  const result = await client.mutate({
    mutation: gql`
      mutation($user: LoginInput!) {
        loginAdmin(loginInput: $user) {
          token
        }
      }
    `,
    variables: {
      user: {
        email: user ? user.email : process.env.SUPER_ADMIN_EMAIL,
        password: user ? user.password : process.env.SUPER_ADMIN_PASSWORD,
      },
    },
  });
  return result.data.loginAdmin.token;
};

const setupApp = async () => {
  await User.deleteOne({ email: process.env.SUPER_ADMIN_EMAIL });
  const admin = new User();
  admin._id = '5f830b0ba0bc014974da66d7';
  admin.firstName = 'Super admin';
  admin.lastName = 'Super admin full';
  admin.email = process.env.SUPER_ADMIN_EMAIL;
  admin.role = 'admin';
  admin.credentials = [
    {
      source: 'horondi',
      tokenPass: await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 12),
    },
  ];
  await admin.save();
  const server = new ApolloServer({
    ...config,
    context: { user: admin },
  });
  return createTestClient(server);
};

module.exports = { adminLogin, setupApp };

require('dotenv').config();
const { gql } = require('apollo-boost');
const client = require('./apollo-test-client');

const loginInput = {
  email: process.env.ADMIN_LOGIN,
  password: process.env.ADMIN_PASSWORD,
};

const loginAdminOperation = async () => {
  const login = await client.mutate({
    mutation: gql`
      mutation($loginInput: LoginInput!) {
        loginAdmin(loginInput: $loginInput) {
          token
        }
      }
    `,
    variables: { loginInput },
  });

  return login.data.loginAdmin.token;
};

module.exports = loginAdminOperation;

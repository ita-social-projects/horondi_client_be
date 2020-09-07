/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
const {
  patternToAdd,
  patternToUpdate,
  patternAlreadyExist,
} = require('./pattern.variables');
const {
  PATTERN_ALREADY_EXIST,
} = require('../../error-messages/pattern.messages');
require('dotenv').config();

let patternId = '';
const patternDoesNotExistId = '5f311ec5f2983e390432a8c3';
let token = '';

describe('pattern mutation tests', () => {
  beforeAll(async () => {
    const user = await client.mutate({
      variables: {
        LoginInput: {
          email: process.env.ADMIN_EMAIL,
          password: process.env.PASS,
        },
      },
      mutation: gql`
        mutation($loginInput: LoginInput!) {
          loginAdmin(loginInput: $loginInput) {
            token
          }
        }
      `,
    });
    token = user.data.loginAdmin.token;
  });
  it('#1 should add pattern to database', async () => {
    const res = await client
      .mutate({
        variables: { pattern: patternToAdd },
        mutation: gql`
          mutation($pattern: PatternInput!) {
            addPattern(pattern: $pattern) {
              ... on Pattern {
                _id
              }
              ... on Error {
                message
                statusCode
              }
            }
          }
        `,
      })
      .catch(e => e);
    patternId = res.data.addPattern._id;
  });
  it('adding pattern that already exist should return error', async () => {
    const res = await client
      .mutate({
        context: {
          headers: {
            token,
          },
        },
        variables: { pattern: patternAlreadyExist },
        mutation: gql`
          mutation($pattern: PatternInput!) {
            addPattern(pattern: $pattern) {
              ... on Pattern {
                _id
              }
              ... on Error {
                message
                statusCode
              }
            }
          }
        `,
      })
      .catch(e => e);
    expect(res.data.addPattern).toHaveProperty(
      'message',
      PATTERN_ALREADY_EXIST,
    );
    expect(res.data.addPattern).toHaveProperty('statusCode', 400);
  });

  test(' update pattern', async () => {
    const res = await client
      .mutate({
        variables: { id: patternId, pattern: patternToUpdate },

        mutation: gql`
          mutation($id: ID!, $pattern: PatternInput!) {
            updatePattern(id: $id, pattern: $pattern) {
              ... on Pattern {
                _id
                name {
                  lang
                  value
                }
                description {
                  lang
                  value
                }
                images {
                  large
                  medium
                  small
                  thumbnail
                }
                material
                handmade
                available
              }
              ... on Error {
                message
              }
            }
          }
        `,
      })
      .catch(e => e);
    expect(res.data.updatePattern).toHaveProperty('name', patternToUpdate.name);
    expect(res.data.updatePattern.name).toBeInstanceOf(Array);
  });
  it(' should delete pattern from database', async () => {
    await client
      .mutate({
        mutation: gql`
          mutation($id: ID!) {
            deletePattern(id: $id) {
              ... on Pattern {
                _id
              }
              ... on Error {
                statusCode
                message
              }
            }
          }
        `,
        variables: { id: patternDoesNotExistId },
      })
      .catch(e => e);
  });
});

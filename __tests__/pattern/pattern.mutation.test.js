/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
const {
  patternToAdd,
  patternToUpdate,
  patternAlreadyExist,
  patternDoesNotExistId,
  user,
  testValue,
  updateValue,
} = require('./pattern.variables');
const {
  PATTERN_ALREADY_EXIST,
  PATTERN_NOT_FOUND,
} = require('../../error-messages/pattern.messages');
require('dotenv').config();
const { adminLogin } = require('../helper-functions');

let patternId = '';
let token = '';

describe('pattern mutation tests', () => {
  beforeAll(async () => {
    token = await adminLogin(user);
  });
  it('#1 should add pattern to database', async () => {
    const res = await client
      .mutate({
        context: { headers: { token } },
        variables: { pattern: patternToAdd },
        mutation: gql`
          mutation($pattern: PatternInput!) {
            addPattern(pattern: $pattern) {
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
                handmade
                available
                material
                images {
                  large
                  medium
                  small
                  thumbnail
                }
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
    expect(res.data.addPattern).toHaveProperty('name', [
      {
        __typename: 'Language',
        lang: 'uk',
        value: testValue,
      },
      {
        __typename: 'Language',
        lang: 'en',
        value: testValue,
      },
    ]);
    expect(res.data.addPattern).toHaveProperty('description', [
      {
        __typename: 'Language',
        lang: 'uk',
        value: testValue,
      },
      {
        __typename: 'Language',
        lang: 'en',
        value: testValue,
      },
    ]);

    expect(res.data.addPattern).toHaveProperty('images', {
      __typename: 'ImageSet',
      large: 'large_335nr4j5dkebkw5cy_test.jpg',
      medium: 'medium_335nr4j5dkebkw5cy_test.jpg',
      small: 'small_335nr4j5dkebkw5cy_test.jpg',
      thumbnail: 'thumbnail_335nr4j5dkebkw5cy_test.jpg',
    });
    expect(res.data.addPattern).toHaveProperty(
      'handmade',
      patternToAdd.handmade,
    );
    expect(res.data.addPattern).toHaveProperty(
      'available',
      patternToAdd.available,
    );
    expect(res.data.addPattern).toHaveProperty(
      'material',
      patternToAdd.material,
    );
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
        context: { headers: { token } },
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

    expect(res.data.updatePattern).toHaveProperty('name', [
      {
        __typename: 'Language',
        lang: 'uk',
        value: testValue,
      },
      {
        __typename: 'Language',
        lang: 'en',
        value: testValue,
      },
    ]);
    expect(res.data.updatePattern.name).toBeInstanceOf(Array);
    expect(res.data.updatePattern).toHaveProperty('description', [
      {
        __typename: 'Language',
        lang: 'uk',
        value: updateValue,
      },
      {
        __typename: 'Language',
        lang: 'en',
        value: updateValue,
      },
    ]);
    expect(res.data.updatePattern.description).toBeInstanceOf(Array);
    expect(res.data.updatePattern).toHaveProperty('images', {
      __typename: 'ImageSet',
      large: 'large_335nr4j5dkebkw5cy_test.jpg',
      medium: 'medium_335nr4j5dkebkw5cy_test.jpg',
      small: 'small_335nr4j5dkebkw5cy_test.jpg',
      thumbnail: 'thumbnail_335nr4j5dkebkw5cy_test.jpg',
    });
    expect(res.data.updatePattern).toHaveProperty(
      'handmade',
      patternToAdd.handmade,
    );
    expect(res.data.updatePattern).toHaveProperty(
      'available',
      patternToAdd.available,
    );
  });

  test(' update pattern with wrong id should return error', async () => {
    const res = await client
      .mutate({
        variables: { id: patternDoesNotExistId, pattern: patternToUpdate },
        context: { headers: { token } },
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
                statusCode
              }
            }
          }
        `,
      })
      .catch(e => e);
    expect(res.data.updatePattern).toHaveProperty('statusCode', 404);
    expect(res.data.updatePattern).toHaveProperty('message', PATTERN_NOT_FOUND);
  });
  test(' update pattern with existing name should return error', async () => {
    const res = await client
      .mutate({
        variables: { id: patternId, pattern: patternAlreadyExist },
        context: { headers: { token } },
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
                statusCode
              }
            }
          }
        `,
      })
      .catch(e => e);
    expect(res.data.updatePattern).toHaveProperty('statusCode', 400);
    expect(res.data.updatePattern).toHaveProperty(
      'message',
      PATTERN_ALREADY_EXIST,
    );
  });

  it(' should delete pattern from database', async () => {
    await client
      .mutate({
        context: { headers: { token } },
        variables: { id: patternId },
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
      })
      .catch(e => e);
  });
  it('deleting not existing pattern should return error', async () => {
    const res = await client
      .mutate({
        context: { headers: { token } },
        variables: { id: patternDoesNotExistId },
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
      })
      .catch(e => e);
    expect(res.data.deletePattern).toHaveProperty('statusCode', 404);
    expect(res.data.deletePattern).toHaveProperty('message', PATTERN_NOT_FOUND);
  });
});

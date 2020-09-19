/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
const {
  patternToUpdate,
  patternAlreadyExist,
  patternDoesNotExistId,
  user,
  mutationPatternToAdd,
  languageTypeName,
  imageTypeName,
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
        variables: { pattern: mutationPatternToAdd },
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
    const addedPattern = res.data.addPattern;
    expect(addedPattern).toHaveProperty(
      'name',
      mutationPatternToAdd.name.map(item => ({
        ...languageTypeName,
        ...item,
      }))
    );
    expect(addedPattern).toHaveProperty(
      'description',
      mutationPatternToAdd.description.map(item => ({
        ...languageTypeName,
        ...item,
      }))
    );
    expect(addedPattern).toHaveProperty('images', {
      ...imageTypeName,
      ...mutationPatternToAdd.images,
    });
    expect(addedPattern).toHaveProperty(
      'handmade',
      mutationPatternToAdd.handmade
    );
    expect(addedPattern).toHaveProperty(
      'available',
      mutationPatternToAdd.available
    );
    expect(addedPattern).toHaveProperty(
      'material',
      mutationPatternToAdd.material
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
      PATTERN_ALREADY_EXIST
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
    const updatedPattern = res.data.updatePattern;

    expect(updatedPattern).toHaveProperty(
      'name',
      patternToUpdate.name.map(item => ({
        ...languageTypeName,
        ...item,
      }))
    );
    expect(updatedPattern.name).toBeInstanceOf(Array);
    expect(updatedPattern).toHaveProperty(
      'description',
      patternToUpdate.description.map(item => ({
        ...languageTypeName,
        ...item,
      }))
    );
    expect(updatedPattern.description).toBeInstanceOf(Array);
    expect(updatedPattern).toHaveProperty('images', {
      ...imageTypeName,
      ...patternToUpdate.images,
    });

    expect(updatedPattern).toHaveProperty('handmade', patternToUpdate.handmade);
    expect(updatedPattern).toHaveProperty(
      'available',
      patternToUpdate.available
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
      PATTERN_ALREADY_EXIST
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

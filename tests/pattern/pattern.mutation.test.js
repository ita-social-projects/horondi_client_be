/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const {
  patternToUpdate,
  patternDoesNotExistId,
  mutationPatternToAdd,
} = require('./pattern.variables');
const {
  PATTERN_ALREADY_EXIST,
  PATTERN_NOT_FOUND,
} = require('../../error-messages/pattern.messages');
const { setupApp } = require('../helper-functions');
jest.mock('../../modules/upload/upload.service');

let patternId = '';
let secondPatternId = '';
let operations;

describe('pattern mutation tests', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });
  it('should add pattern to database', async () => {
    const res = await operations.mutate({
      mutation: gql`
        mutation($pattern: PatternInput!) {
          addPattern(pattern: $pattern, image: []) {
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
      variables: { pattern: mutationPatternToAdd },
    });

    patternId = res.data.addPattern._id;
    const addedPattern = res.data.addPattern;
    expect(addedPattern).toHaveProperty(
      'name',
      mutationPatternToAdd.name.map(item => ({
        ...item,
      }))
    );
    expect(addedPattern).toHaveProperty(
      'description',
      mutationPatternToAdd.description.map(item => ({
        ...item,
      }))
    );
    expect(addedPattern).toHaveProperty('images');
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

  it('should return error if we try to create pattern with name that already exists', async () => {
    const res = await operations.mutate({
      variables: { pattern: mutationPatternToAdd },
      mutation: gql`
        mutation($pattern: PatternInput!) {
          addPattern(pattern: $pattern, image: []) {
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
    });

    expect(res.data.addPattern).toHaveProperty(
      'message',
      PATTERN_ALREADY_EXIST
    );
    expect(res.data.addPattern).toHaveProperty('statusCode', 400);
  });

  it('should update pattern', async () => {
    const res = await operations.mutate({
      variables: { id: patternId, pattern: patternToUpdate },
      mutation: gql`
        mutation($id: ID!, $pattern: PatternInput!) {
          updatePattern(id: $id, pattern: $pattern, image: []) {
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
    });
    const updatedPattern = res.data.updatePattern;

    expect(updatedPattern.name).toBeInstanceOf(Array);
    expect(updatedPattern).toHaveProperty('name', patternToUpdate.name);
    expect(updatedPattern).toHaveProperty(
      'description',
      patternToUpdate.description
    );
    expect(updatedPattern.description).toBeInstanceOf(Array);
    expect(updatedPattern).toHaveProperty('images');

    expect(updatedPattern).toHaveProperty('handmade', patternToUpdate.handmade);
    expect(updatedPattern).toHaveProperty(
      'available',
      patternToUpdate.available
    );
  });

  it('should return error if we try to update pattern with wrong id', async () => {
    patternToUpdate.name[0].value = 'duplicated value';
    patternToUpdate.name[1].value = 'duplicated value';

    const res = await operations.mutate({
      variables: { id: patternDoesNotExistId, pattern: patternToUpdate },
      mutation: gql`
        mutation($id: ID!, $pattern: PatternInput!) {
          updatePattern(id: $id, pattern: $pattern, image: []) {
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
    });
    expect(res.data.updatePattern).toHaveProperty('statusCode', 404);
    expect(res.data.updatePattern).toHaveProperty('message', PATTERN_NOT_FOUND);
  });

  it('should return error if we try to update pattern with existing name ', async () => {
    const addPattern = await operations.mutate({
      mutation: gql`
        mutation($pattern: PatternInput!) {
          addPattern(pattern: $pattern, image: []) {
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
      variables: { pattern: patternToUpdate },
    });
    secondPatternId = addPattern.data.addPattern._id;
    const res = await operations.mutate({
      variables: { id: patternId, pattern: patternToUpdate },
      mutation: gql`
        mutation($id: ID!, $pattern: PatternInput!) {
          updatePattern(id: $id, pattern: $pattern, image: []) {
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
    });

    expect(res.data.updatePattern).toHaveProperty('statusCode', 400);
    expect(res.data.updatePattern).toHaveProperty(
      'message',
      PATTERN_ALREADY_EXIST
    );
  });

  it('should delete pattern from database', async () => {
    await operations.mutate({
      variables: { id: patternId },
      mutation: gql`
        mutation($id: ID!) {
          deletePattern(id: $id) {
            ... on Pattern {
              _id
              name {
                value
              }
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
    });
    await operations.mutate({
      variables: { id: secondPatternId },
      mutation: gql`
        mutation($id: ID!) {
          deletePattern(id: $id) {
            ... on Pattern {
              _id
              name {
                value
              }
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
    });
  });
  it('should return error if we try to delete not existing pattern', async () => {
    const res = await operations.mutate({
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
    });
    expect(res.data.deletePattern).toHaveProperty('statusCode', 404);
    expect(res.data.deletePattern).toHaveProperty('message', PATTERN_NOT_FOUND);
  });
});

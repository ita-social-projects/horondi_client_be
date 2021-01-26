const { gql } = require('@apollo/client');
/* eslint-disable no-undef */
const { PATTERN_NOT_FOUND } = require('../../error-messages/pattern.messages');
const { setupApp } = require('../helper-functions');
jest.mock('../../modules/upload/upload.service');

const {
  patternDoesNotExistId,
  skip,
  limit,
  wrongLimit,
  wrongSkip,
  queryPatternToAdd,
  testImages,
} = require('./pattern.variables');

let patternId;
let operations;

describe('Pattern queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  beforeAll(async () => {
    const res = await operations
      .mutate({
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

        variables: { pattern: queryPatternToAdd },
      })
      .catch(e => e);
    patternId = res.data.addPattern._id;
  });

  describe('tests for all patterns and one pattern', () => {
    test('Should receive all patterns', async () => {
      const res = await operations
        .query({
          query: gql`
            query {
              getAllPatterns {
                items {
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
              }
            }
          `,
        })
        .catch(e => e);

      expect(res.data.getAllPatterns).toEqual({
        items: [queryPatternToAdd],
      });
    });
    test('Should receive one pattern', async () => {
      const res = await operations
        .query({
          query: gql`
            query($id: ID!) {
              getPatternById(id: $id) {
                ... on Pattern {
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
              }
            }
          `,
          variables: { id: patternId },
        })
        .catch(e => e);

      expect(res.data.getPatternById).toEqual(queryPatternToAdd);
    });
    test('request not existing pattern should throw error', async () => {
      const res = await operations
        .query({
          query: gql`
            query($id: ID!) {
              getPatternById(id: $id) {
                ... on Pattern {
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
                  statusCode
                  message
                }
              }
            }
          `,
          variables: { id: patternDoesNotExistId },
        })
        .catch(e => e);

      expect(res.data.getPatternById).toBeDefined();
      expect(res.data.getPatternById).toHaveProperty('statusCode', 404);
      expect(res.data.getPatternById).toHaveProperty(
        'message',
        PATTERN_NOT_FOUND
      );
    });

    test('pattern pagination test', async () => {
      const res = await operations
        .query({
          variables: { skip, limit },
          query: gql`
            query($skip: Int, $limit: Int) {
              getAllPatterns(skip: $skip, limit: $limit) {
                items {
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
                count
              }
            }
          `,
        })
        .catch(e => e);

      expect(res.data.getAllPatterns.items).toHaveLength(1);
      expect(res.data.getAllPatterns.count).toEqual(1);
    });
    test('Expect negative values', async () => {
      const res = await operations
        .query({
          variables: { skip: wrongLimit, limit: wrongSkip },
          query: gql`
            query($skip: Int, $limit: Int) {
              getAllPatterns(skip: $skip, limit: $limit) {
                items {
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
                count
              }
            }
          `,
        })
        .catch(e => e);
      expect(res.errors[0].message).toEqual(
        'Skip value must be non-negative, but received: -5'
      );
    });
  });
  afterAll(async () => {
    await operations
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
        variables: { id: patternId },
      })
      .catch(e => e);
  });
});

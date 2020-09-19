const { gql } = require('apollo-boost');
/* eslint-disable no-undef */
const client = require('../../utils/apollo-test-client');
require('dotenv').config();
const {
  patternDoesNotExistId,
  skip,
  limit,
  wrongLimit,
  wrongSkip,
  languageTypeName,
  imageTypeName,
} = require('./pattern.variables');
const { PATTERN_NOT_FOUND } = require('../../error-messages/pattern.messages');

let patternId;

const testValue = 't e s t new';
const patternToAdd = {
  name: [
    {
      lang: 'uk',
      value: testValue,
    },
    {
      lang: 'en',
      value: testValue,
    },
  ],
  description: [
    {
      lang: 'uk',
      value: testValue,
    },
    {
      lang: 'en',
      value: testValue,
    },
  ],
  images: {
    large: 'large_335nr4j5dkebkw5cy_test.jpg',
    medium: 'medium_335nr4j5dkebkw5cy_test.jpg',
    small: 'small_335nr4j5dkebkw5cy_test.jpg',
    thumbnail: 'thumbnail_335nr4j5dkebkw5cy_test.jpg',
  },
  material: 'test',
  handmade: false,
  available: true,
};

describe('pattern query tests', () => {
  beforeAll(async () => {
    const res = await client
      .mutate({
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

        variables: { pattern: patternToAdd },
      })
      .catch(e => e);

    patternId = res.data.addPattern._id;
  });

  describe('tests for all patterns and one pattern', () => {
    test('#1 Should receive all patterns', async () => {
      const res = await client
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

      expect(res.data.getAllPatterns).toMatchSnapshot();
      expect(res.data.getAllPatterns).toBeDefined();
      expect(res.data.getAllPatterns.items).toContainEqual({
        __typename: 'Pattern',
        name: patternToAdd.name.map(item => ({ ...languageTypeName, ...item })),
        description: patternToAdd.description.map(item => ({
          ...languageTypeName,
          ...item,
        })),
        images: { ...imageTypeName, ...patternToAdd.images },
        material: patternToAdd.material,
        handmade: false,
        available: true,
      });
    });
    test('#2 Should receive one pattern', async () => {
      const res = await client
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
          variables: { id: patternId },
        })
        .catch(e => e);

      expect(res.data.getPatternById).toMatchSnapshot();
      expect(res.data.getPatternById).toBeDefined();
      expect(res.data.getPatternById.name).toBeInstanceOf(Array);
      expect(res.data.getPatternById).toHaveProperty(
        'name',
        patternToAdd.name.map(item => ({
          __typename: 'Language',
          ...item,
        }))
      );
      expect(res.data.getPatternById.images).toBeInstanceOf(Object);
      expect(res.data.getPatternById).toHaveProperty('images', {
        ...imageTypeName,
        ...patternToAdd.images,
      });
      expect(res.data.getPatternById.images).toBeInstanceOf(Object);
      expect(res.data.getPatternById).toHaveProperty(
        'description',
        ...patternToAdd.description.map(item => ({
          __typename: 'Language',
          ...item,
        }))
      );
      expect(res.data.getPatternById.description).toBeInstanceOf(Array);
      expect(res.data.getPatternById).toHaveProperty(
        'material',
        patternToAdd.material
      );
      expect(res.data.getPatternById.colors).toBeInstanceOf(String);
      expect(res.data.getPatternById).toHaveProperty(
        'handmade',
        patternToAdd.handmade
      );
      expect(res.data.getPatternById.handmade).toBeInstanceOf(Boolean);
      expect(res.data.getPatternById).toHaveProperty(
        'available',
        patternToAdd.available
      );
      expect(res.data.getPatternById.available).toBeInstanceOf(Boolean);
    });
    test('#3 request not existing pattern should throw error', async () => {
      const res = await client
        .query({
          query: gql`
            query($id: ID!) {
              getPatternId(id: $id) {
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
      console.log(res);
      expect(res.data.getPatternById).toMatchSnapshot();
      expect(res.data.getPatternById).toBeDefined();
      expect(res.data.getPatternById).toHaveProperty('statusCode', 404);
      expect(res.data.getPatternById).toHaveProperty(
        'message',
        PATTERN_NOT_FOUND
      );
    });

    test('pattern pagination test', async () => {
      const res = await client
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

      expect(res.data.getAllPatterns).toMatchSnapshot();
      expect(res.data.getAllPatterns.items).toHaveLength(5);
      expect(res.data.getAllPatterns.count).toEqual(16);
    });
    test('pattern pagination test with wrong arguments', async () => {
      const res = await client
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
      expect(res.graphQLErrors[0].message).toEqual(
        'Skip value must be non-negative, but received: -5'
      );
    });
  });
  afterAll(async () => {
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
        variables: { id: patternId },
      })
      .catch(e => e);
  });
});

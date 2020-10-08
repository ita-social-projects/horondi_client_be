const { gql } = require('@apollo/client');
/* eslint-disable no-undef */
const client = require('../../utils/apollo-test-client');
require('dotenv').config();
const { PATTERN_NOT_FOUND } = require('../../error-messages/pattern.messages');
const { adminLogin } = require('../helper-functions');

const {
  patternDoesNotExistId,
  skip,
  limit,
  wrongLimit,
  wrongSkip,
  user,
  languageTypeName,
  imageTypeName,
  queryPatternToAdd,
} = require('./pattern.variables');

let token;
let patternId;

describe('pattern query tests', () => {
  beforeAll(async () => {
    token = await adminLogin(user);
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

        variables: { pattern: queryPatternToAdd },
        context: { headers: { token } },
      })
      .catch(e => e);
    patternId = res.data.addPattern._id;
  });

  console.log(patternId);

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

      //console.log(res.data.getAllPatterns.items.length);

      //expect(res.data.getAllPatterns).toMatchSnapshot();
      expect(res.data.getAllPatterns).toBeDefined();
      expect(res.data.getAllPatterns.items).toContainEqual({
        __typename: 'Pattern',
        name: queryPatternToAdd.name.map(item => ({
          ...languageTypeName,
          ...item,
        })),
        description: queryPatternToAdd.description.map(item => ({
          ...languageTypeName,
          ...item,
        })),
        images: { ...imageTypeName, ...queryPatternToAdd.images },
        material: queryPatternToAdd.material,
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
        queryPatternToAdd.name.map(item => ({
          ...languageTypeName,
          ...item,
        }))
      );
      expect(res.data.getPatternById.images).toBeInstanceOf(Object);
      expect(res.data.getPatternById).toHaveProperty('images', {
        ...imageTypeName,
        ...queryPatternToAdd.images,
      });
      expect(res.data.getPatternById.images).toBeInstanceOf(Object);
      expect(res.data.getPatternById).toHaveProperty(
        'description',
        ...queryPatternToAdd.description.map(item => ({
          ...languageTypeName,
          ...item,
        }))
      );
      expect(res.data.getPatternById.description).toBeInstanceOf(Array);
      expect(res.data.getPatternById).toHaveProperty(
        'material',
        queryPatternToAdd.material
      );
      expect(res.data.getPatternById).toHaveProperty(
        'handmade',
        queryPatternToAdd.handmade
      );
      expect(res.data.getPatternById).toHaveProperty(
        'available',
        queryPatternToAdd.available
      );
    });
    test('#3 request not existing pattern should throw error', async () => {
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
        context: { headers: { token } },
      })
      .catch(e => e);
    expect(res.graphQLErrors[0].message).toEqual(
      'Skip value must be non-negative, but received: -5'
    );
  });
});

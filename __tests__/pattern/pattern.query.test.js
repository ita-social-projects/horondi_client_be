const { gql } = require('apollo-boost');
/* eslint-disable no-undef */
const client = require('../../utils/apollo-test-client');
require('dotenv').config();
const { PATTERN_NOT_FOUND } = require('../../error-messages/pattern.messages');
const { adminLogin } = require('../helper-functions');
const {
  user,
  patternDoesNotExistId,
  skip,
  limit,
  wrongLimit,
  wrongSkip,
} = require('./pattern.variables');

let token;
let patternId;
const testValue = 'testnew';
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

describe('pattern tests', () => {
  beforeAll(async () => {
    token = await adminLogin(user);
    const res = await client
      .mutate({
        variables: { pattern: patternToAdd },
        context: { headers: { token } },
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
  });
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

    expect(res.data.getAllPatterns).toBeDefined();
    expect(res.data.getAllPatterns.items).toContainEqual({
      __typename: 'Pattern',
      name: [
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
      ],
      description: [
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
      ],
      images: {
        __typename: 'ImageSet',
        large: 'large_335nr4j5dkebkw5cy_test.jpg',
        medium: 'medium_335nr4j5dkebkw5cy_test.jpg',
        small: 'small_335nr4j5dkebkw5cy_test.jpg',
        thumbnail: 'thumbnail_335nr4j5dkebkw5cy_test.jpg',
      },
      material: 'test',
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

    const newPattern = res.data.getPatternById;
    expect(newPattern).toBeDefined();
    expect(newPattern.name).toBeInstanceOf(Array);
    expect(newPattern).toHaveProperty('name', [
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
    expect(newPattern).toHaveProperty('description', [
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
    expect(newPattern.description).toBeInstanceOf(Array);
    expect(newPattern).toHaveProperty('images', {
      __typename: 'ImageSet',
      large: 'large_335nr4j5dkebkw5cy_test.jpg',
      medium: 'medium_335nr4j5dkebkw5cy_test.jpg',
      small: 'small_335nr4j5dkebkw5cy_test.jpg',
      thumbnail: 'thumbnail_335nr4j5dkebkw5cy_test.jpg',
    });
    expect(newPattern.images).toBeInstanceOf(Object);
    expect(newPattern).toHaveProperty('material', patternToAdd.material);
    expect(newPattern).toHaveProperty('handmade', patternToAdd.handmade);
    expect(newPattern).toHaveProperty('available', patternToAdd.available);
  });
  test('#3 request not existing pattern should throw error', async () => {
    const res = await client.query({
      query: gql`
        query($id: ID!) {
          getPatternById(id: $id) {
            ... on Pattern {
              name {
                lang
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
      variables: { id: patternDoesNotExistId },
    });
    const newPattern = res.data.getPatternById;
    expect(newPattern).toMatchSnapshot();
    expect(newPattern).toBeDefined();
    expect(newPattern).toHaveProperty('statusCode', 404);
    expect(newPattern).toHaveProperty('message', PATTERN_NOT_FOUND);
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

    expect(res.data.getAllPatterns.items).toHaveLength(5);
    expect(res.data.getAllPatterns.count).toEqual(18);
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

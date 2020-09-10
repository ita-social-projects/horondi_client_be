const { gql } = require('apollo-boost');
/* eslint-disable no-undef */
const client = require('../../utils/apollo-test-client');
require('dotenv').config();
const { PATTERN_NOT_FOUND } = require('../../error-messages/pattern.messages');
const { adminLogin } = require('../helper-functions');
const { user } = require('./pattern.variables');

let token;
let patternId;
const patternDoesNotExistId = '5f311ec5f2983e390432a8c3';
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

    expect(res.data.getPatternById).toBeDefined();
    expect(res.data.getPatternById.name).toBeInstanceOf(Array);
    expect(res.data.getPatternById).toHaveProperty('name', [
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
    expect(res.data.getPatternById).toHaveProperty('description', [
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
    expect(res.data.getPatternById.description).toBeInstanceOf(Array);
    expect(res.data.getPatternById).toHaveProperty('images', {
      __typename: 'ImageSet',
      large: 'large_335nr4j5dkebkw5cy_test.jpg',
      medium: 'medium_335nr4j5dkebkw5cy_test.jpg',
      small: 'small_335nr4j5dkebkw5cy_test.jpg',
      thumbnail: 'thumbnail_335nr4j5dkebkw5cy_test.jpg',
    });
    expect(res.data.getPatternById.images).toBeInstanceOf(Object);
    expect(res.data.getPatternById).toHaveProperty(
      'material',
      patternToAdd.material,
    );
    expect(res.data.getPatternById).toHaveProperty(
      'handmade',
      patternToAdd.handmade,
    );
    expect(res.data.getPatternById).toHaveProperty(
      'available',
      patternToAdd.available,
    );
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

    expect(res.data.getPatternById).toMatchSnapshot();
    expect(res.data.getPatternById).toBeDefined();
    expect(res.data.getPatternById).toHaveProperty('statusCode', 404);
    expect(res.data.getPatternById).toHaveProperty(
      'message',
      PATTERN_NOT_FOUND,
    );
  });
});

const { gql } = require('apollo-boost');
/* eslint-disable no-undef */
const client = require('../../utils/apollo-test-client');
require('dotenv').config();
const { patternToAdd } = require('./pattern.variables');
const { PATTERN_NOT_FOUND } = require('../../error-messages/pattern.messages');

let patternId = '';
const patternDoesNotExistId = '5f311ec5f2983e390432a8c3';

describe('pattern tests', () => {
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
    console.log(res);
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
            }
          }
        `,
      })
      .catch(e => e);
    expect(res.data.getAllPatterns).toBeDefined();
    expect(res.data.getAllPatterns.items).toContainEqual({
      name: [
        {
          lang: 'uk',
          value: 'test',
        },
        {
          lang: 'en',
          value: 'pattest',
        },
      ],
      description: [
        {
          lang: 'uk',
          value: 'тестовий опис',
        },
        {
          lang: 'en',
          value: 'test description',
        },
      ],
      images: {
        large: 'large_335nr4j5dkebkw5cy_test.jpg',
        medium: 'medium_335nr4j5dkebkw5cy_test.jpg',
        small: 'small_335nr4j5dkebkw5cy_test.jpg',
        thumbnail: 'thumbnail_335nr4j5dkebkw5cy_test.jpg',
      },
      material: 'Cotton',
      handmade: false,
      available: true,
    });
  });
  test('#2 Should receive one pattern', async () => {
    try {
      const res = await client
        .query({
          query: gql`
            query($id: ID!) {
              getPatternId(id: $id) {
                ... on Pattern {
                  title {
                    lang
                    value
                  }
                  text {
                    lang
                    value
                  }
                  images {
                    primary {
                      medium
                    }
                    additional {
                      medium
                    }
                  }
                  author {
                    name {
                      lang
                      value
                    }
                  }
                  date
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
      expect(res.data.getPatternById).toHaveProperty('name', patternToAdd.name);
      expect(res.data.getPatternById.images).toBeInstanceOf(Object);
      expect(res.data.getPatternById).toHaveProperty(
        'images',
        patternToAdd.images,
      );
      expect(res.data.getPatternById.images).toBeInstanceOf(Object);
      expect(res.data.getPatternById).toHaveProperty(
        'description',
        patternToAdd.description,
      );
      expect(res.data.getPatternById.description).toBeInstanceOf(Array);
      expect(res.data.getPatternById).toHaveProperty(
        'material',
        patternToAdd.material,
      );
      expect(res.data.getPatternById.colors).toBeInstanceOf(String);
      expect(res.data.getPatternById).toHaveProperty(
        'handmade',
        patternToAdd.handmade,
      );
      expect(res.data.getPatternById.handmade).toBeInstanceOf(Boolean);
      expect(res.data.getPatternById).toHaveProperty(
        'available',
        patternToAdd.available,
      );
      expect(res.data.getPatternById.available).toBeInstanceOf(Boolean);
    } catch (e) {
      console.error(e);
    }
  });
  test('#3 request not existing pattern should throw error', async () => {
    try {
      const res = await client
        .query({
          query: gql`
            query($id: ID!) {
              getPatternId(id: $id) {
                ... on Pattern {
                  title {
                    lang
                    value
                  }
                  text {
                    lang
                    value
                  }
                  images {
                    primary {
                      medium
                    }
                    additional {
                      medium
                    }
                  }
                  author {
                    name {
                      lang
                      value
                    }
                  }
                  date
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
      expect(res.data.getPatternById).toHaveProperty('statusCode', 404);
      expect(res.data.getPatternById).toHaveProperty(
        'message',
        PATTERN_NOT_FOUND,
      );
    } catch (e) {
      console.error(e);
    }
  });
});

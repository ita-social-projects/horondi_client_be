const { gql } = require('@apollo/client');
/* eslint-disable no-undef */
require('dotenv').config();
const { PATTERN_NOT_FOUND } = require('../../error-messages/pattern.messages');
const { setupApp } = require('../helper-functions');
jest.mock('../../modules/upload/upload.service');

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
      })
      .catch(e => e);
    patternId = res.data.addPattern._id;
  });

  console.log(process.env.MONGO_URL, 'MONGO_URL');

  describe('tests for all patterns and one pattern', () => {
    test('#1 Should receive all patterns', async () => {
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

      //expect(res.data.getAllPatterns).toMatchSnapshot();
      expect(res.data.getAllPatterns).toBeDefined();
      expect(res.data.getAllPatterns.items).toEqual([
        {
          name: queryPatternToAdd.name.map(item => ({
            ...languageTypeName,
            ...item,
          })),
          description: queryPatternToAdd.description.map(item => ({
            ...languageTypeName,
            ...item,
          })),
          images: { ...imageTypeName },
          material: queryPatternToAdd.material,
          handmade: false,
          available: true,
        },
      ]);
    });
    test('#2 Should receive one pattern', async () => {
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

      console.log(res.data.getPatternById.images);

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
      //expect(res.data.getPatternById.images).toBeInstanceOf(Object);
      expect(res.data.getPatternById).toHaveProperty('images', {
        ...imageTypeName,
        ...queryPatternToAdd.images,
      });
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

      //expect(res.data.getAllPatterns).toMatchSnapshot();
      expect(res.data.getAllPatterns.items).toHaveLength(1);
      expect(res.data.getAllPatterns.count).toEqual(1);
    });
    test('pattern pagination test with wrong arguments', async () => {
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
    expect(res.errors[0].message).toEqual(
      'Skip value must be non-negative, but received: -5'
    );
  });
});

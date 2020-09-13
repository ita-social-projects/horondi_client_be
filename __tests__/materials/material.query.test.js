/* eslint-disable object-curly-newline */
/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');

const {
  skip,
  limit,
  wrongSkip,
  wrongLimit,
  limitZero,
} = require('./material.variables');

const graphqlErrorMessage = 'Skip value must be non-negative, but received: -5';
describe('material query tests', () => {
  describe('material pagination tests', () => {
    test('#1 Should receive 5 materials', async () => {
      const res = await client
        .query({
          variables: { skip, limit },
          query: gql`
            query($skip: Int, $limit: Int) {
              getAllMaterials(skip: $skip, limit: $limit) {
                items {
                  name {
                    lang
                    value
                  }
                  description {
                    lang
                    value
                  }
                  purpose

                  colors {
                    code
                    name {
                      lang
                      value
                    }
                    simpleName {
                      lang
                      value
                    }
                    available
                    images {
                      large
                      medium
                      small
                      thumbnail
                    }
                  }
                  additionalPrice {
                    currency
                    value
                  }
                  available
                }
                count
              }
            }
          `,
        })
        .catch(e => e);
      const { count } = res.data.getAllMaterials;
      expect(res.data.getAllMaterials.items).toHaveLength(5);
      expect(count).not.toBeNull();
      expect(count).toEqual(6);
    });
    test('#2 Should receive error if skip is negative', async () => {
      const res = await client
        .query({
          variables: { skip: wrongSkip, limit },
          query: gql`
            query($skip: Int, $limit: Int) {
              getAllMaterials(skip: $skip, limit: $limit) {
                items {
                  name {
                    lang
                    value
                  }
                  description {
                    lang
                    value
                  }
                  purpose

                  colors {
                    code
                    name {
                      lang
                      value
                    }
                    simpleName {
                      lang
                      value
                    }
                    available
                    images {
                      large
                      medium
                      small
                      thumbnail
                    }
                  }
                  additionalPrice {
                    currency
                    value
                  }
                  available
                }
                count
              }
            }
          `,
        })
        .catch(e => e);
      expect(res.graphQLErrors[0].message).toEqual(graphqlErrorMessage);
    });
    test('#3 Should receive 3 materials if limit is -3', async () => {
      const res = await client
        .query({
          variables: { skip, limit: wrongLimit },
          query: gql`
            query($skip: Int, $limit: Int) {
              getAllMaterials(skip: $skip, limit: $limit) {
                items {
                  name {
                    lang
                    value
                  }
                  description {
                    lang
                    value
                  }
                  purpose

                  colors {
                    code
                    name {
                      lang
                      value
                    }
                    simpleName {
                      lang
                      value
                    }
                    available
                    images {
                      large
                      medium
                      small
                      thumbnail
                    }
                  }
                  additionalPrice {
                    currency
                    value
                  }
                  available
                }
                count
              }
            }
          `,
        })
        .catch(e => e);
      const { items } = res.data.getAllMaterials;
      expect(items.length).toEqual(3);
      expect(items).not.toBeNull();
    });
    test('#4 We hould receive all materials if skip is 0 and limit is 0', async () => {
      const res = await client
        .query({
          variables: { skip, limit: limitZero },
          query: gql`
            query($skip: Int, $limit: Int) {
              getAllMaterials(skip: $skip, limit: $limit) {
                items {
                  name {
                    lang
                    value
                  }
                  description {
                    lang
                    value
                  }
                  purpose

                  colors {
                    code
                    name {
                      lang
                      value
                    }
                    simpleName {
                      lang
                      value
                    }
                    available
                    images {
                      large
                      medium
                      small
                      thumbnail
                    }
                  }
                  additionalPrice {
                    currency
                    value
                  }
                  available
                }
                count
              }
            }
          `,
        })
        .catch(e => e);

      const { items } = res.data.getAllMaterials;
      expect(items.length).toEqual(6);
      expect(items).not.toBeNull();
    });
  });
});

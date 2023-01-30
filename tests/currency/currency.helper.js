const { gql } = require('@apollo/client');

const getAllCurrencies = async operations => {
  const result = await operations.query({
    query: gql`
      query {
        getAllCurrencies {
          _id
          convertOptions {
            UAH {
              name
              exchangeRate
            }
            USD {
              name
              exchangeRate
            }
          }
        }
      }
    `,
  });

  return result.data.getAllCurrencies;
};

const getCurrencyById = async (id, operations) => {
  const result = await operations.query({
    query: gql`
      query ($id: ID!) {
        getCurrencyById(id: $id) {
          ... on Currency {
            _id
            convertOptions {
              UAH {
                name
                exchangeRate
              }
              USD {
                name
                exchangeRate
              }
            }
          }

          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: { id },
  });

  return result.data.getCurrencyById;
};

const addCurrency = async (currency, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation ($currency: CurrencyInput!) {
        addCurrency(currency: $currency) {
          ... on Currency {
            _id
            convertOptions {
              UAH {
                name
                exchangeRate
              }
              USD {
                name
                exchangeRate
              }
            }
          }

          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: { currency },
  });

  return result.data.addCurrency;
};

const updateCurrency = async (id, currency, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation ($id: ID!, $currency: CurrencyInput!) {
        updateCurrency(id: $id, currency: $currency) {
          ... on Currency {
            _id
            convertOptions {
              UAH {
                name
                exchangeRate
              }
              USD {
                name
                exchangeRate
              }
            }
          }

          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: { id, currency },
  });

  return result.data.updateCurrency;
};

const deleteCurrency = async (id, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation ($id: ID!) {
        deleteCurrency(id: $id) {
          ... on Currency {
            _id
            convertOptions {
              UAH {
                name
                exchangeRate
              }
              USD {
                name
                exchangeRate
              }
            }
          }

          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: { id },
  });

  return result.data.deleteCurrency;
};

module.exports = {
  getAllCurrencies,
  getCurrencyById,
  addCurrency,
  updateCurrency,
  deleteCurrency,
};

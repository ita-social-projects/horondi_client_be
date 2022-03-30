const { gql } = require('@apollo/client');

const addPromoCode = async (promoCode, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation ($promoCode: PromoCodeInput!) {
        addPromoCode(promoCode: $promoCode) {
          ... on PromoCode {
            _id
            dateFrom
            dateTo
            code
            discount
          }
        }
      }
    `,
    variables: {
      promoCode,
    },
  });

  return res.data.addPromoCode;
};

const getAllPromoCodes = async operations => {
  const res = await operations.query({
    query: gql`
      query {
        getAllPromoCodes {
          items {
            _id
            dateFrom
            dateTo
            discount
            code
          }
        }
      }
    `,
  });

  return res.data.getAllPromoCodes;
};

const getPromoCodeByCode = async (code, operations) => {
  const res = await operations.query({
    query: gql`
      query ($code: String!) {
        getPromoCodeByCode(code: $code) {
          ... on PromoCode {
            _id
            code
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: {
      code,
    },
  });

  return res;
};

const deletePromoCode = async (id, operations) =>
  operations.mutate({
    mutation: gql`
      mutation ($id: ID!) {
        deletePromoCode(id: $id) {
          ... on PromoCode {
            _id
            dateFrom
            dateTo
            discount
            code
          }
        }
      }
    `,
    variables: { id },
  });

const updatePromoCode = async (id, promoCode, operations) =>
  operations.mutate({
    mutation: gql`
      mutation ($id: ID!, $promoCode: PromoCodeInput!) {
        updatePromoCode(id: $id, promoCode: $promoCode) {
          ... on PromoCode {
            _id
            dateFrom
            dateTo
            discount
            code
          }
        }
      }
    `,
    variables: { id, promoCode },
  });

module.exports = {
  addPromoCode,
  getAllPromoCodes,
  deletePromoCode,
  getPromoCodeByCode,
  updatePromoCode,
};

const { gql } = require('@apollo/client');

const addPromoCode = async (promoCode, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($promoCode: PromoCodeInput!) {
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
const deletePromoCode = async (id, operations) =>
  await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
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

module.exports = {
  addPromoCode,
  getAllPromoCodes,
  deletePromoCode,
};

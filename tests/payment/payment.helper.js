const { gql } = require('@apollo/client');

const getPaymentCheckout = async (data, operations) => {
  const res = await operations.query({
    query: gql`
      query($data: PaymentInput!) {
        getPaymentCheckout(data: $data) {
          ... on Order {
            _id
            orderNumber
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: {
      data,
    },
  });
  return res;
};

module.exports = {
  getPaymentCheckout,
};

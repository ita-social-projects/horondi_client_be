const { gql } = require('@apollo/client');

const getPaymentCheckout = async (data, language, operations) => {
  const res = await operations.query({
    query: gql`
      query($data: PaymentInput!, $language: Int!) {
        getPaymentCheckout(data: $data, language: $language) {
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
      language,
    },
  });
  return res;
};

const checkPaymentStatus = async (orderId, operations) => {
  const res = await operations.query({
    query: gql`
      query($orderId: String!) {
        checkPaymentStatus(orderId: $orderId) {
          orderId
          orderStatus
          orderTime
          amount
          currency
        }
      }
    `,
    variables: {
      orderId,
    },
  });

  return res;
};

module.exports = {
  getPaymentCheckout,
  checkPaymentStatus,
};

const { gql } = require('@apollo/client');

const getPaymentCheckout = async (data, operations) => {
  const res = await operations.query({
    query: gql`
      query ($data: PaymentInput!) {
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

  return res.data.getPaymentCheckout;
};

const getPaymentCheckoutForCertificates = async (data, operations) => {
  const res = await operations.query({
    query: gql`
      query ($data: PaymentInputForCertificate!) {
        getPaymentCheckoutForCertificates(data: $data) {
          ... on Certificates {
            __typename
            paymentUrl
            paymentToken
            certificatesOrderId
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: {
      data,
    },
  });

  return res.data.getPaymentCheckoutForCertificates;
};

const sendCertificatesCodesToEmail = async (
  language,
  certificates,
  operations
) => {
  const res = await operations.query({
    query: gql`
      query ($language: Int!, $certificates: [CertificateInput]!) {
        sendCertificatesCodesToEmail(
          language: $language
          certificates: $certificates
        ) {
          ... on Certificates {
            __typename
            certificates {
              name
            }
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: {
      certificates,
      language,
    },
  });

  return res.data.sendCertificatesCodesToEmail;
};

module.exports = {
  getPaymentCheckout,
  sendCertificatesCodesToEmail,
  getPaymentCheckoutForCertificates,
};

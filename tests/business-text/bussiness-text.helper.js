const { gql } = require('@apollo/client');

const addBusinessText = async (businessText, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation ($businessText: BusinessTextInput!) {
        addBusinessText(businessText: $businessText, files: []) {
          ... on BusinessText {
            _id
            code
            title {
              value
              lang
            }
            text {
              value
              lang
            }
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: {
      businessText,
    },
  });

  return res.data.addBusinessText;
};
const deleteBusinessText = async (id, operations) => {
  await operations.mutate({
    mutation: gql`
      mutation ($id: ID!) {
        deleteBusinessText(id: $id) {
          ... on BusinessText {
            _id
            code
            title {
              value
              lang
            }
            text {
              value
              lang
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
};
const getAllBusinessTexts = async operations => {
  const res = await operations.query({
    query: gql`
      query {
        getAllBusinessTexts {
          code
          title {
            value
            lang
          }
          text {
            lang
            value
          }
        }
      }
    `,
  });

  return res.data.getAllBusinessTexts;
};
const getBusinessTextById = async (id, operations) => {
  const res = await operations.query({
    query: gql`
      query ($id: ID!) {
        getBusinessTextById(id: $id) {
          ... on BusinessText {
            code
            title {
              value
              lang
            }
            text {
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
    variables: { id },
  });

  return res.data.getBusinessTextById;
};
const getBusinessTextByCode = async (code, operations) => {
  const res = await operations.query({
    query: gql`
      query ($code: String!) {
        getBusinessTextByCode(code: $code) {
          ... on BusinessText {
            code
            title {
              value
              lang
            }
            text {
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
    variables: { code },
  });

  return res.data.getBusinessTextByCode;
};
const updateBusinessText = async (id, businessText, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation ($id: ID!, $businessText: BusinessTextInput!) {
        updateBusinessText(id: $id, businessText: $businessText, files: []) {
          ... on BusinessText {
            _id
            code
            title {
              value
              lang
            }
            text {
              value
              lang
            }
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: {
      id,
      businessText,
    },
  });

  return res.data.updateBusinessText;
};

module.exports = {
  addBusinessText,
  deleteBusinessText,
  getAllBusinessTexts,
  getBusinessTextById,
  getBusinessTextByCode,
  updateBusinessText,
};

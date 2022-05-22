const { gql } = require('@apollo/client');

const addBusinessText = async (
  businessText,
  businessTextTranslationFields,
  operations
) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation (
        $businessText: BusinessTextInput!
        $businessTextTranslationFields: BusinessTextTranslationFieldsInput!
        $files: [Upload]!
      ) {
        addBusinessText(
          businessText: $businessText
          businessTextTranslationFields: $businessTextTranslationFields
          files: $files
        ) {
          ... on BusinessText {
            _id
            code
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
      businessTextTranslationFields,
      files: [],
    },
  });

  return res.data.addBusinessText;
};
const deleteBusinessText = async (id, operations) =>
  operations.mutate({
    mutation: gql`
      mutation ($id: ID!) {
        deleteBusinessText(id: $id) {
          ... on BusinessText {
            _id
            code
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

const getAllBusinessTexts = async operations => {
  const res = await operations.query({
    query: gql`
      query {
        getAllBusinessTexts {
          code
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
    variables: { code },
  });

  return res.data.getBusinessTextByCode;
};
const updateBusinessText = async (
  id,
  businessText,
  businessTextTranslationFields,
  operations
) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation (
        $id: ID!
        $businessText: BusinessTextInput!
        $businessTextTranslationFields: BusinessTextTranslationFieldsInput!
        $files: [Upload]!
        $populated: Boolean
      ) {
        updateBusinessText(
          id: $id
          businessText: $businessText
          businessTextTranslationFields: $businessTextTranslationFields
          files: $files
          populated: $populated
        ) {
          ... on BusinessTextWithPopulatedTranslationsKey {
            _id
            code
            languages
            translations {
              _id
              ua {
                title
                text
              }
              en {
                title
                text
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
    variables: {
      id,
      businessText,
      businessTextTranslationFields,
      files: [],
      populated: true,
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

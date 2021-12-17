const { gql } = require('@apollo/client');

const createColor = async (color, operations) => {
  const createdColor = await operations.mutate({
    mutation: gql`
      mutation($color: ColorInput!) {
        addColor(data: $color) {
          ... on Color {
            _id
            name {
              lang
              value
            }
            colorHex
            simpleName {
              lang
              value
            }
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: { color },
  });

  return createdColor.data.addColor;
};
const deleteColor = async (id, operations) => await operations.mutate({
  mutation: gql`
      mutation($id: ID!) {
        deleteColor(id: $id) {
          ... on Color {
            _id
            name {
              value
              lang
            }
            colorHex
            simpleName {
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
  },
});
const getAllColors = async (operations) => {
  const result = await operations.query({
    query: gql`
      query {
        getAllColors {
          _id
          name {
            lang
            value
          }
          colorHex
          simpleName {
            lang
            value
          }
        }
      }
    `,
  });
  return result.data.getAllColors;
};
const getColorById = async (id, operations) => {
  const result = await operations.query({
    query: gql`
      query($id: ID!) {
        getColorById(id: $id) {
          ... on Color {
            _id
            colorHex
            name {
              lang
              value
            }
            simpleName {
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
    variables: {
      id,
    },
  });
  return result.data.getColorById;
};

module.exports = {
  deleteColor,
  createColor,
  getAllColors,
  getColorById,
};

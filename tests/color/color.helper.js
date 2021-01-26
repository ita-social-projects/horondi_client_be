const { gql } = require('@apollo/client');

const createColor = async (color, operations) => {
  const createdColor = await operations.mutate({
    mutation: gql`
      mutation($color: ColorInput!) {
        addColor(data: $color) {
          ... on Color {
            _id
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

  return createdColor.data.addColor._id;
};
const deleteColor = async (id, operations) => {
  await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteColor(id: $id) {
          ... on Color {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      id,
    },
  });
};

module.exports = {
  deleteColor,
  createColor,
};

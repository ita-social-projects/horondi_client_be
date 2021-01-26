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

const getAllColors = async operations => {
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
        }
      }
    `,
    variables: {
      id,
    },
  });
  return result.data.getColorById;
};

const errorColor = async (id, operations) => {
  const result = await operations.query({
    query: gql`
      query($id: ID!) {
        getColorById(id: $id) {
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

const addColor = async (data, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation($data: ColorInput!) {
        addColor(data: $data) {
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
        }
      }
    `,
    variables: {
      data,
    },
  });
  return result.data.addColor;
};

const errorAdd = async (data, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation($data: ColorInput!) {
        addColor(data: $data) {
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
  return result.data.addColor;
};

const deleteColorMutation = async (id, operations) => {
  const result = await operations.mutate({
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
        }
      }
    `,
    variables: {
      id,
    },
  });
  return result.data.deleteColor;
};

const errorDelete = async (id, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteColor(id: $id) {
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
  return result.data.deleteColor;
};

module.exports = {
  deleteColor,
  createColor,
  getAllColors,
  getColorById,
  errorColor,
  addColor,
  errorAdd,
  deleteColorMutation,
  errorDelete,
};

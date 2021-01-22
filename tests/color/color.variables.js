const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');

const wrongID = '600987de4cf8d95fa80ddf9b';

const color = {
  name: [{ value: '222ddd', lang: 'UA' }],
  colorHex: '#3r56tg',
  simpleName: [{ value: '222ddd', lang: 'UA' }],
};

const color2 = {
  name: [{ value: '000fff', lang: 'UA' }],
  colorHex: '#13a3b7',
  simpleName: [{ value: '000fff', lang: 'UA' }],
};

const error_not_found = { message: 'COLOR_NOT_FOUND', statusCode: 404 };
const error_already_exists = {
  message: 'COLOR_ALREADY_EXIST',
  statusCode: 400,
};

const createdColor = async color => {
  operations = await setupApp();
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
    variables: {
      color,
    },
  });
  return createdColor.data.addColor._id;
};

module.exports = {
  wrongID,
  color,
  color2,
  error_not_found,
  error_already_exists,
  createdColor,
};

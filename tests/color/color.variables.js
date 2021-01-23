const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');

const WRONG_ID = '600987de4cf8d95fa80ddf9b';

const COLOR = {
  name: [{ value: '222ddd', lang: 'UA' }],
  colorHex: '#3r56tg',
  simpleName: [{ value: '222ddd', lang: 'UA' }],
};

const COLOR_2 = {
  name: [{ value: '000fff', lang: 'UA' }],
  colorHex: '#13a3b7',
  simpleName: [{ value: '000fff', lang: 'UA' }],
};

const ERROR_NOT_FOUND = { message: 'COLOR_NOT_FOUND', statusCode: 404 };
const ERROR_ALREDY_EXISTS = {
  message: 'COLOR_ALREADY_EXIST',
  statusCode: 400,
};

const createColor = async color => {
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
  WRONG_ID,
  COLOR,
  COLOR_2,
  ERROR_NOT_FOUND,
  ERROR_ALREDY_EXISTS,
  createColor,
};

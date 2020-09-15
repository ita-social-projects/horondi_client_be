const languageTypeName = { __typename: 'Language' };
const currencyTypeName = { __typename: 'CurrencySet' };
const imageTypeName = { __typename: 'ImageSet' };

const skip = 0;
const limit = 5;
const limitZero = 0;
const wrongSkip = -5;
const wrongLimit = -3;

module.exports = {
  languageTypeName,
  currencyTypeName,
  imageTypeName,
  skip,
  limit,
  wrongSkip,
  wrongLimit,
  limitZero,
};

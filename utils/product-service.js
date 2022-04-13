const getCurrencySign = (currency, UAH, USD) => {
  if (currency === 0) {
    return UAH;
  }

  return currency === 1 ? USD : '';
};

module.exports = {
  getCurrencySign,
};

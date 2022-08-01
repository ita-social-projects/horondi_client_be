const newCurrency = {
  lastUpdatedDate: String(Date.now()),
  convertOptions: {
    UAH: {
      name: 'test',
      exchangeRate: 2.5,
    },
    USD: {
      name: 'test',
      exchangeRate: 1.5,
    },
  },
};

const updatedCurrency = {
  lastUpdatedDate: String(Date.now()),
  convertOptions: {
    UAH: {
      name: 'updated_test',
      exchangeRate: 3.5,
    },
    USD: {
      name: 'updated_test',
      exchangeRate: 2.5,
    },
  },
};

const savedCurrency = {
  lastUpdatedDate: String(Date.now()),
  convertOptions: {
    UAH: {
      name: 'saved_test',
      exchangeRate: 3.5,
    },
    USD: {
      name: 'saved_test',
      exchangeRate: 2.5,
    },
  },
};

const invalidCurrencyID = '6043bf9e3e06ad3edcdb7b30';

module.exports = {
  newCurrency,
  updatedCurrency,
  savedCurrency,
  invalidCurrencyID,
};

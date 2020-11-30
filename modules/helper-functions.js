const { dayInMiliseconds } = require('../consts/');

const removeDaysFromData = (days, currentDate) =>
  currentDate - days * dayInMiliseconds;

const changeDataFormat = (data, options) =>
  new Date(data).toLocaleString('en-US', options);

const countItemsOccurency = items =>
  items.reduce((acc, el) => {
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {});

const reduceByMonths = (names, count) => {
  const newNames = names.map(name => name.split(' ')[0]);
  const result = {};

  for (let i = 0; i < newNames.length; i++) {
    if (result[newNames[i]] === undefined) {
      result[newNames[i]] = count[i];
    } else {
      result[newNames[i]] += count[i];
    }
  }

  return {
    names: Object.keys(result),
    counts: Object.values(result),
  };
};

module.exports = {
  reduceByMonths,
  removeDaysFromData,
  countItemsOccurency,
  changeDataFormat,
};

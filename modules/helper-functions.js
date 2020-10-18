const removeDaysFromData = (days, currentDate) =>
  currentDate - days * dayInMiliseconds;

const changeDataFormat = (data, options) =>
  new Date(data).toLocaleString('en-US', options);

const countItemsOccurency = items =>
  items.reduce((acc, el) => {
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {});

module.exports = {
  removeDaysFromData,
  countItemsOccurency,
  changeDataFormat,
};

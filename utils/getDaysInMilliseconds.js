const getDaysInMilliseconds = (daysCount = 1) => +(1000 * 60 * 60 * 24 * daysCount);

module.exports = {
  getDaysInMilliseconds,
};

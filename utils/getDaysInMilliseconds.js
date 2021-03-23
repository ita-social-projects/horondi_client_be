const getDaysInMilliseconds = (daysCount = 1) => {
  if (typeof daysCount === 'number') {
    return 1000 * 60 * 60 * 24 * daysCount;
  } else {
    return false;
  }
};

module.exports = {
  getDaysInMilliseconds,
};

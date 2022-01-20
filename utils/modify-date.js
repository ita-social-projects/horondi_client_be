const _ = undefined;

const modifyNowDate = (days = 0, months = 0, years = 0) => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + days);
  currentDate.setMonth(currentDate.getMonth() + months);
  currentDate.setFullYear(currentDate.getFullYear() + years);

  return currentDate;
};

module.exports = {
  modifyNowDate,
  _,
};

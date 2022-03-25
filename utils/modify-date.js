const modifyDate = ({ days = 0, months = 0, years = 0, date = new Date() }) => {
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  date.setMonth(date.getMonth() + months);
  date.setFullYear(date.getFullYear() + years);

  return date;
};

module.exports = {
  modifyDate,
};

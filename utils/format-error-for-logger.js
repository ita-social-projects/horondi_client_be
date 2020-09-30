module.exports = formatErrorForLogger = string => {
  return string.toLowerCase().replace(/_/g, ' ');
};

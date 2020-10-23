const formatErrorForLogger = string => {
  return string.toLowerCase().replace(/_/g, ' ');
};
module.exports = formatErrorForLogger;

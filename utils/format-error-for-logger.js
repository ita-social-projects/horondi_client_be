const formatErrorForLogger = (string) => string.toLowerCase().replace(/_/g, ' ');
module.exports = formatErrorForLogger;

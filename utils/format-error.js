const formatError = message => {
  let statusCode = 400;
  if (message.endsWith('NOT_FOUND')) {
    statusCode = 404;
  }
  return {
    message,
    statusCode,
  };
};

module.exports = {
  formatError,
};

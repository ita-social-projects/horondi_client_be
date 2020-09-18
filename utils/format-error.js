const formatError = err => {
  const { originalError } = err;

  if (originalError && originalError.name === 'RuleError') {
    return {
      message: originalError.message,
      statusCode: originalError.statusCode,
    };
  }

  return err;
};

module.exports = formatError;

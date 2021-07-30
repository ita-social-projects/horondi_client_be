const formatError = logFunction => err => {
  const { originalError } = err;

  if (originalError && originalError.name === 'RuleError') {
    return {
      message: originalError.message,
      statusCode: originalError.statusCode,
    };
  }

  try {
    logFunction(err);
  } catch (error) {
    console.error(error);
  }

  return err;
};

module.exports = formatError;

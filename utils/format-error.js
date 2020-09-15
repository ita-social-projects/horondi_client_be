const formatError = (err) => {
    const {originalError} = err;
    console.log(err);

    if(originalError && originalError.name === 'RuleError') {
      return {
        message: originalError.message,
        statusCode: originalError.statusCode
      }
    }

    return err;
}

module.exports = formatError;
const errorOutputPlugin = {
  requestDidStart() {
    return {
      willSendResponse(context) {
        if (
          context.errors
          && context.errors.some(
            (item) => item.originalError && item.originalError.name === 'RuleError',
          )
        ) {
          const errors = context.errors.map((item) => ({
            [item.path]: {
              message: item.originalError.message,
              statusCode: item.originalError.statusCode,
            },
          }));

          const responseData = context.response.data
            ? context.response.data
            : {};
          const data = Object.assign(responseData, ...errors);

          context.response.data = data;

          delete context.response.errors;
          delete context.errors;
        }
      },
    };
  },
};

module.exports = errorOutputPlugin;

const errorOutputPlugin = {
  requestDidStart() {
    return {
      willSendResponse(context) {
        if (
          context.errors.length &&
          context.errors.some(
            item =>
              item.originalError && item.originalError.name === 'RuleError'
          )
        ) {
          const errors = context.errors.map(item => ({
            [item.path]: {
              message: item.originalError.message,
              statusCode: item.originalError.statusCode,
            },
          }));

          const data = Object.assign(context.response.data, ...errors);

          context.response.data = data;

          delete context.response.errors;
          delete context.errors;
        }
      },
    };
  },
};

module.exports = errorOutputPlugin;

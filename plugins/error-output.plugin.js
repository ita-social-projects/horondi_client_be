const errorOutputPlugin = {
    requestDidStart(){
      return {
        willSendResponse(context){
          if (context.errors && context.errors.some((item) => item.name === "RuleError")) {
            context.response.data = {
              ...context.response.data,
              ...context.errors.map(item => ({
                  [item.path]: {
                      message: item.message,
                      statusCode: item.statusCode
                  }
              }))
            }
            delete context.response.errors
          }
        }
      }
    }
}

module.exports = errorOutputPlugin
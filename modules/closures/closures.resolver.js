const closureService = require('./closures.service');
const { CLOSURE_NOT_FOUND } = require('../../error-messages/closure.messages');

const closureQuery = {
  getAllClosure: (parent, args) => closureService.getAllClosures(args),
  getClosureById: async (parent, args) => {
    try {
      return await closureService.getClosureById(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};

const closureMutation = {
  addClosure: async (parent, args) => {
    try {
      return await closureService.addClosure(args.closure);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },
  updateClosure: async (parent, args) => {
    try {
      return await closureService.updateClosure(args);
    } catch (e) {
      return {
        statusCode: e.message === CLOSURE_NOT_FOUND ? 404 : 400,
        message: e.message,
      };
    }
  },
  deleteClosure: async (parent, args) => {
    try {
      return await closureService.deleteClosure(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};
module.exports = { closureQuery, closureMutation };

const ClosureService = require('./closures.service');
const { CLOSURE_NOT_FOUND } = require('../../error-messages/closures.messages');

const closureQuery = {
  getAllClosure: (parent, args) => ClosureService.getAllClosures(args),
  getClosureById: async (parent, args) => {
    try {
      return await ClosureService.getClosureById(args.id);
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
      return await ClosureService.addClosure(args.closure, args.upload);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },
  updateClosure: async (parent, args) => {
    try {
      return await ClosureService.updateClosure(
        args.id,
        args.closure,
        args.upload
      );
    } catch (e) {
      return {
        statusCode: e.message === CLOSURE_NOT_FOUND ? 404 : 400,
        message: e.message,
      };
    }
  },
  deleteClosure: async (parent, args) => {
    try {
      return await ClosureService.deleteClosure(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};
module.exports = { closureQuery, closureMutation };

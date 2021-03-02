const ClosureService = require('./closures.service');
const { CLOSURE_NOT_FOUND } = require('../../error-messages/closures.messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');

const closureQuery = {
  getAllClosure: (parent, args) => ClosureService.getAllClosure(args),
  getClosureById: async (parent, args) => {
    try {
      return await ClosureService.getClosureById(args.id);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
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
        statusCode: BAD_REQUEST,
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
        statusCode: e.message === CLOSURE_NOT_FOUND ? NOT_FOUND : BAD_REQUEST,
        message: e.message,
      };
    }
  },
  deleteClosure: async (parent, args) => {
    try {
      return await ClosureService.deleteClosure(args.id);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
};
module.exports = { closureQuery, closureMutation };

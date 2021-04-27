const ClosureService = require('./closures.service');
const { CLOSURE_NOT_FOUND } = require('../../error-messages/closures.messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const RuleError = require('../../errors/rule.error');

const closureQuery = {
  getAllClosure: (parent, args) => ClosureService.getAllClosure(args),
  getClosureById: async (parent, args) => {
    try {
      return await ClosureService.getClosureById(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const closureMutation = {
  addClosure: async (parent, args, { user }) => {
    try {
      return await ClosureService.addClosure(args.closure, args.upload, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateClosure: async (parent, args, { user }) => {
    try {
      return await ClosureService.updateClosure(
        args.id,
        args.closure,
        args.upload,
        user
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteClosure: async (parent, args, { user }) => {
    try {
      return await ClosureService.deleteClosure(args.id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};
module.exports = { closureQuery, closureMutation };

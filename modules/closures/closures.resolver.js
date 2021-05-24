const ClosureService = require('./closures.service');

const RuleError = require('../../errors/rule.error');

const closureQuery = {
  getAllClosure: async (_, args) => {
    try {
      return await ClosureService.getAllClosure(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getClosureById: async (_, { id }) => {
    try {
      return await ClosureService.getClosureById(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const closureMutation = {
  addClosure: async (_, { closure, upload }, { user }) => {
    try {
      return await ClosureService.addClosure(closure, upload, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateClosure: async (_, { id, closure, upload }, { user }) => {
    try {
      return await ClosureService.updateClosure(id, closure, upload, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteClosure: async (_, { id }, { user }) => {
    try {
      return await ClosureService.deleteClosure(id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};
module.exports = { closureQuery, closureMutation };

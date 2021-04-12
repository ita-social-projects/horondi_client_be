const Restriction = require('./restriction.model');
const RuleError = require('../../errors/rule.error');
const {
  restrictionMessages: { NOT_FOUND },
} = require('../../consts/restriction.messages');
const {
  STATUS_CODES: { FORBIDDEN },
} = require('../../consts/status-codes');

class RestrictionService {
  async getAllRestrictions({ skip, limit }) {
    const items = await Restriction.find()
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await Restriction.find()
      .countDocuments()
      .exec();
    return {
      items,
      count,
    };
  }

  async addRestriction({ restriction }) {
    return await new Restriction({ ...restriction }).save();
  }

  async updateRestriction({ id, restriction }) {
    const restrictionItem = await Restriction.findById(id)
      .lean()
      .exec();

    if (!restrictionItem) {
      throw new RuleError(NOT_FOUND, FORBIDDEN);
    }

    return await Restriction.findByIdAndUpdate(
      id,
      { ...restriction },
      {
        new: true,
      }
    ).exec();
  }

  async deleteRestriction({ id }) {
    const foundRestriction = await Restriction.findByIdAndDelete(id)
      .lean()
      .exec();

    if (!foundRestriction) {
      throw new RuleError(NOT_FOUND, FORBIDDEN);
    }

    return foundRestriction;
  }
}

module.exports = new RestrictionService();

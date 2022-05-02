const RuleError = require('../../errors/rule.error');
const mongoose = require('mongoose');
const {
  roles: { USER },
} = require('../../consts');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const {
  PROMOCODE_NOT_FOUND,
} = require('../../error-messages/promocode-messages');
const { PromocodeModel } = require('../../modules/promo-code/promo-code.model');
const { format } = require('date-fns');
const FilterHelper = require('../../helpers/filter-helper');
class PromoCodeService extends FilterHelper {
  async getAllPromoCodes(skip, limit, sortBy, sortOrder, search, user, status) {
    let filter;

    if (user.role === USER) {
      const userId = mongoose.Types.ObjectId(user._id);
      filter = { ownedBy: userId };
    } else {
      filter = this.dateOrName(search);
    }
    const sortStatus = {
      $match: {
        $or: [],
      },
    };
    sortOrder = sortOrder === 'desc' ? -1 : 1;
    const sort = { [sortBy]: sortOrder };
    const myTime = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    const startTime = format(
      new Date(2016, 0, 1),
      "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
    );
    if (status.includes('active')) {
      sortStatus['$match']['$or'].push({
        $and: [
          {
            dateFrom: {
              $lt: new Date(myTime),
            },
          },
          {
            dateTo: {
              $gt: new Date(myTime),
            },
          },
        ],
      });
    }
    if (status.includes('expired')) {
      sortStatus['$match']['$or'].push({
        $and: [
          {
            dateTo: {
              $lt: new Date(myTime),
            },
          },
        ],
      });
    }
    if (status.includes('planned')) {
      sortStatus['$match']['$or'].push({
        $and: [
          {
            dateFrom: {
              $gt: new Date(myTime),
            },
          },
        ],
      });
    }
    if (!status.length) {
      sortStatus['$match']['$or'].push({
        $and: [
          {
            dateFrom: {
              $gt: new Date(startTime),
            },
          },
        ],
      });
    }

    const promocodes = await PromocodeModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'admin',
        },
      },
      {
        $match: filter,
      },
      {
        $facet: {
          count: [{ $count: 'count' }],
          data: [
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
            sortStatus,
          ],
        },
      },
    ]).exec();

    const items = promocodes[0].data;
    const count = promocodes[0].count.length ? promocodes[0].count[0].count : 0;

    return {
      items,
      count,
    };
  }

  async getPromoCodeById(id) {
    const promoCode = await PromocodeModel.findById(id).exec();

    if (!promoCode) {
      throw new RuleError(PROMOCODE_NOT_FOUND, NOT_FOUND);
    }

    return promoCode;
  }

  async getPromoCodeByCode(code) {
    const currentDate = new Date();
    const promoCode = await PromocodeModel.findOne({
      code,
      dateFrom: { $lte: currentDate },
      dateTo: { $gt: currentDate },
    }).exec();

    if (!promoCode) {
      throw new RuleError(PROMOCODE_NOT_FOUND, NOT_FOUND);
    }

    return promoCode;
  }

  async addPromoCode(promoCode) {
    return new PromocodeModel(promoCode).save();
  }

  async deletePromoCode(id) {
    const promoCode = await PromocodeModel.findByIdAndDelete(id).exec();

    if (promoCode) {
      return promoCode;
    }
  }

  async updatePromoCode(id, promoCodeData) {
    await this.getPromoCodeById(id);

    return PromocodeModel.findByIdAndUpdate(id, promoCodeData, {
      new: true,
    }).exec();
  }
}

module.exports = new PromoCodeService();

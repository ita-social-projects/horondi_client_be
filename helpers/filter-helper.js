const mongoose = require('mongoose');

const { removeDaysFromData } = require('../modules/helper-functions');
const {
  USER_BLOCK_PERIOD: { UNLOCKED, INFINITE, TWO_MONTH, ONE_MONTH },
} = require('../consts/user-block-period');

class FilterHelper {
  filterByDateOrName(filter = {}, search = '') {
    const searchTrimmed = (search ?? '').trim();

    if (!searchTrimmed) {
      return;
    }

    const searchPattern = {
      $regex: searchTrimmed,
      $options: 'gi',
    };

    const searchFilter = {
      $or: [
        {
          'admin.firstName': searchPattern,
        },
        {
          'admin.lastName': searchPattern,
        },
        {
          name: searchPattern,
        },
        {
          code: searchPattern,
        },
      ],
    };

    if (!filter['$and']) {
      filter['$and'] = [];
    }

    filter['$and'].push(searchFilter);
  }

  filterByStatus(status, myTime, filter) {
    if (status.length) {
      const statusFilter = [];

      if (status.includes('active')) {
        statusFilter.push({
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
        statusFilter.push({
          dateTo: {
            $lt: new Date(myTime),
          },
        });
      }
      if (status.includes('planned')) {
        statusFilter.push({
          dateFrom: {
            $gt: new Date(myTime),
          },
        });
      }

      if (!statusFilter.length) {
        return;
      }

      if (!filter['$and']) {
        filter['$and'] = [];
      }

      filter['$and'].push({ $or: statusFilter });
    }
  }

  filterItems(args = {}) {
    const filter = {};
    const { roles, days, banned, _id, search } = args;

    if (roles?.length) {
      filter.role = { $in: roles };
    }

    if (banned?.length) {
      const [isBanned, all] = banned;

      if (!all) {
        filter['banned.blockPeriod'] =
          isBanned === 'false'
            ? { $in: [UNLOCKED] }
            : { $in: [INFINITE, TWO_MONTH, ONE_MONTH] };
      }
    }

    if (days) {
      filter.registrationDate = {
        $gte: removeDaysFromData(days, Date.now()),
        $lte: removeDaysFromData(0, Date.now()),
      };
    }

    if (_id?.length) {
      filter._id = { $in: _id.map(id => mongoose.Types.ObjectId(id)) };
    }

    if (search && search.trim()) {
      filter.$or = this.searchItems(search.trim());
    }

    return filter;
  }

  searchItems(searchString) {
    return [
      { firstName: { $regex: new RegExp(searchString, 'i') } },
      { lastName: { $regex: new RegExp(searchString, 'i') } },
      { email: { $regex: new RegExp(searchString, 'i') } },
      { phoneNumber: { $regex: new RegExp(searchString, 'i') } },
    ];
  }

  aggregateItems(filters = {}, pagination = {}, sort = {}) {
    const aggregationItems = [];

    if (Object.keys(sort).length) {
      aggregationItems.push({
        $sort: sort,
      });
    }

    aggregationItems.push({ $match: filters });

    if (pagination.skip !== undefined && pagination.limit) {
      aggregationItems.push({
        $skip: pagination.skip,
      });
      aggregationItems.push({
        $limit: pagination.limit,
      });
    }

    return aggregationItems;
  }
}

module.exports = FilterHelper;

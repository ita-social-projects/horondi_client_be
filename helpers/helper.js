const mongoose = require('mongoose');
class FilterHelper {
  filterItems(args = {}) {
    const filter = {};
    const { roles, days, banned, _id, search } = args;

    if (roles && roles.length) {
      filter.role = { $in: roles };
    }

    if (banned && banned.length) {
      filter.banned = { $in: banned };
    }

    if (days) {
      filter.registrationDate = {
        $gte: removeDaysFromData(days, Date.now()),
        $lte: removeDaysFromData(0, Date.now()),
      };
    }

    if (_id && _id.length) {
      filter._id = { $in: _id.map(id => mongoose.Types.ObjectId(id)) };
    }

    if (search && search.trim()) {
      filter.$or = this.searchItems(search.trim());
    }

    return filter;
  }

  searchItems(searchString) {
    return [{ 'name.value': { $regex: new RegExp(searchString, 'i') } }];
  }

  aggregateItems(filters = {}, pagination = {}, sort = {}) {
    let aggregationItems = [];

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

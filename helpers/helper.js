const mongoose = require('mongoose');
class FilterHelper {
  filterItems(args = {}) {
    const filter = {};
    const { roles, days, banned, category, search } = args;

    if (roles && roles.length) {
      filter.role = { $in: roles };
    }

    if (category && category.length) {
      filter._id = { $in: category.map(id => mongoose.Types.ObjectId(id)) };
    }

    if (banned && banned.length) {
      filter.banned = { $in: banned };
    }

    if (search && search.trim()) {
      filter.$or = this.searchItems(search.trim());
    }

    if (days) {
      filter.registrationDate = {
        $gte: removeDaysFromData(days, Date.now()),
        $lte: removeDaysFromData(0, Date.now()),
      };
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

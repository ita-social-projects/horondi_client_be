class FilterHelper {
  filterItems(args = {}) {
    const filter = {};
    const { roles, days, banned, search } = args;

    if (roles && roles.length) {
      filter.role = { $in: roles };
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
    return [
      { name: { $regex: new RegExp(searchString, 'i') } },
      { phoneNumber: { $regex: new RegExp(searchString) } },
      { email: { $regex: new RegExp(searchString, 'i') } },
    ];
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

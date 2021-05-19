const commonFiltersHandler = (filter, filterOptions) => {
  if (filter?.name) {
    const name = filter.name.trim();

    filterOptions.$or = [
      { 'name.value': { $regex: `${name}`, $options: 'i' } },
      { text: { $regex: `${name}`, $options: 'i' } },
    ];
  }

  if (filter?.model.length) {
    filterOptions.model = { $in: filter.model };
  }

  if (filter?.available.length) {
    filterOptions.available = { $in: filter.available };
  }
};

module.exports = {
  commonFiltersHandler,
};

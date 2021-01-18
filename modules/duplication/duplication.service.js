class DuplicationService {
  constructor(itemModel) {
    this.model = itemModel;
  }

  async countDuplicationLanguageSet(data, field, id) {
    const conditionObj = {};

    conditionObj[field] = {
      $elemMatch: {
        $or: data[field].map(({ value }) => ({ value })),
      },
    };
    return id
      ? await this.model.countDocuments({
          _id: { $ne: id },
          ...conditionObj,
        })
      : await this.model.countDocuments({
          ...conditionObj,
        });
  }
}

module.exports = DuplicationService;

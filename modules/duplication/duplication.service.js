class DuplicationService {
  constructor(itemModel) {
    this.model = itemModel;
  }

  async checkItemExist(data, type, field, id) {
    if (data[field]) {
      if (type === 'LanguageSet') {
        return id
          ? await this.model.countDocuments({
              _id: { $ne: id },
              name: {
                $elemMatch: {
                  $or: data[field].map(({ value }) => ({ value })),
                },
              },
            })
          : await this.model.countDocuments({
              name: {
                $elemMatch: {
                  $or: data[field].map(({ value }) => ({ value })),
                },
              },
            });
      }
    }
    throw new Error('Please provide data with field');
  }
}

module.exports = DuplicationService;

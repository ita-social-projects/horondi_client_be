const modelService = require('./model/model.service');
const Product = require('./product/product.model');

class ModulesService {
  constructor(ItemModule) {
    this.ItemModule = ItemModule;
  }

  async deleteItem(id, ERROR_MESSAGE) {
    const res = await this.ItemModule.findByIdAndDelete(id);
    return res || new Error(ERROR_MESSAGE);
  }

  addItem(data, ERROR_MESSAGE) {
    return this.checkItemExist(data).then(isExists => {
      if (isExists) {
        throw new Error(ERROR_MESSAGE);
      }
      return new this.ItemModule(data).save();
    });
  }

  async getAllItems() {
    return this.ItemModule.find();
  }

  updateItem(id, data, errors) {
    return this.ItemModule.findById(id)
      .then(item => {
        if (!item) {
          throw new Error(errors[0]);
        }
        return this.checkItemExist(data, id);
      })
      .then(isExists => {
        if (isExists) {
          throw new Error(errors[1]);
        }
        return modelService.getModelById(data.model);
      })
      .then(model => {
        data.model = model.name;
        return Product.findByIdAndUpdate(id, data, { new: true });
      });
  }

  async checkItemExist(data, id) {
    const itemsCount = await this.ItemModule.countDocuments({
      _id: { $ne: id },
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    });
    return itemsCount > 0;
  }
}

module.exports = new ModulesService();

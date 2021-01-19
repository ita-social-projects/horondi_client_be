const {calculatePrice} = require('../currency/currency.utils');

class ConstructorService {
  async getAllConstructorElements({ skip, limit }, model) {
    const items = await model.find().populate(
      'material',
    )
      .skip(skip)
      .limit(limit);

    const count = await model.find().countDocuments();
    return {
      items,
      count,
    };
  }

  async getConstructorElementById(id, model, error) {
    const foundElement = await model.findById(id).populate([{
      path: 'material',
      model: 'Material'
    }, {
      path: 'color',
      model: 'Color'
    }]);
    if (foundElement) {
      return foundElement;
    }
    throw new Error(error);
  }

  async addConstructorElement(data, model, error) {
    if (await this.checkConstructorElementExist(data, model)) {
      throw new Error(error);
    }
    data.basePrice = await calculatePrice(data.basePrice);
    const basic = await new model(data).save()
    return await  model.findById(basic._id).populate([{
      path: 'material',
      model: 'Material'
    }, {
      path: 'color',
      model: 'Color'
    }]);
  }


  async updateConstructorElement({ id, constructorElement }, model, error) {
    const constructorFountElement = await model.findById(id)
    if (!constructorFountElement) {
      throw new Error(error);
    }
    constructorElement.basePrice = await calculatePrice(constructorElement.basePrice);
    return await model.findByIdAndUpdate(
      id, constructorElement,
      { new: true},
    ).populate([{
      path: 'material',
      model: 'Material'
    }, {
      path: 'color',
      model: 'Color'
    }]);
  }

  async deleteConstructorElement(id, model, error) {
    const constructorElement = await model.findByIdAndDelete(id);
    if (!constructorElement) {
      throw new Error(error);
    }
    return constructorElement;
  }

  async checkConstructorElementExist(data, model) {
    let constructorBasicCount = await model.countDocuments({
      name: {
        $elemMatch: {
          $or: data.name.map(({ value }) => ({ value })),
        },
      },
    });
    return constructorBasicCount > 0;
  }
}

module.exports = new ConstructorService();

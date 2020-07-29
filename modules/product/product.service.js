const Products = require('./product.model');
const Size = require('../../models/Size');

class ProductsService {
  async getProductById(id) {
    return await Products.findById(id);
  }

  async getSizeById(id) {
    return Size.findById(id);
  }

  filterItems(args = {}) {
    const filter = {};
    const {
      pattern, colors, price, category,
    } = args;

    if (category && category.length) {
      filter.category = { $in: category };
    }
    if (colors && colors.length) {
      filter.colors = {
        $elemMatch: {
          simpleName: {
            $elemMatch: {
              value: { $in: colors },
            },
          },
        },
      };
    }
    if (pattern && pattern.length) {
      filter.pattern = {
        $elemMatch: {
          value: { $in: pattern },
        },
      };
    }
    if (price && price.length) {
      filter.basePrice = {
        $gte: price[0],
        $lte: price[1],
      };
    }
    return filter;
  }

  getProducts({
    filter, skip, limit, sort, search,
  }) {
    const isNotBlank = str => !(!str || str.trim().length === 0);
    const filters = this.filterItems(filter);

    if (isNotBlank(search)) {
      filters.$or = [
        {
          name: { $elemMatch: { value: { $regex: new RegExp(search, 'i') } } },
        },
        {
          description: {
            $elemMatch: { value: { $regex: new RegExp(search, 'i') } },
          },
        },
      ];
    }

    return Products.find(filters)
      .skip(skip)
      .limit(limit)
      .sort(sort);
  }

  updateProduct(id, products) {
    return Products.findByIdAndUpdate(id, products, { new: true });
  }

  addProduct(data) {
    const product = new Products(data);
    return product.save();
  }

  deleteProduct(id) {
    return Products.findByIdAndDelete(id);
  }
}
module.exports = new ProductsService();

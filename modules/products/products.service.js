const Products = require('./products.model');
const Size = require('../../models/Size');

class ProductsService {
  getProductsById(id) {
    return Products.findById(id);
  }

  getSizeById(id) {
    return Size.findById(id);
  }

  filterItems(args = {}) {
    const filter = {};
    const { pattern = [], colors = [], price = [0, 999999] } = args;

    if (colors.length) {
      filter.colors = {
        $elemMatch: {
          simpleName: { $in: colors },
        },
      };
    }
    if (pattern.length) {
      filter.pattern = {
        $elemMatch: {
          value: { $in: pattern },
        },
      };
    }
    if (price.length) {
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

  updateProductById(id, products) {
    return Products.findByIdAndUpdate(id, products);
  }

  addProducts(data) {
    const product = new Products(data);
    return product.save();
  }

  deleteProducts(id) {
    return Products.findByIdAndDelete(id);
  }
}
module.exports = new ProductsService();

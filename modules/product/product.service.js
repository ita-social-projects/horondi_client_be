const Products = require('./product.model');
const Size = require('../../models/Size');
const {
  PRODUCTS_NOT_FOUND,
} = require('../../error-messages/products.messages');

class ProductsService {
  getProductsById(id) {
    return Products.findById(id);
  }

  getSizeById(id) {
    return Size.findById(id);
  }

  filterItems(args = {}) {
    const filter = {};
    const {
      pattern, colors, price, category, isHotItem,
    } = args;

    if (isHotItem) {
      filter.isHotItem = isHotItem;
    }
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

  async getProducts({
    filter, skip, limit, sort, search,
  }) {
    const filters = this.filterItems(filter);
    if (!(!search || search.trim().length === 0)) {
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
    const items = await Products.find(filters)
      .skip(skip)
      .limit(limit)
      .sort(sort);

    if (!items) {
      throw new Error(PRODUCTS_NOT_FOUND);
    }

    const count = await Products.find(filters).countDocuments();
    return {
      items,
      count,
    };
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

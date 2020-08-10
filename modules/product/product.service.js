const Products = require('./product.model');
const Size = require('../../models/Size');
const {
  PRODUCT_ALREADY_EXIST,
  PRODUCTS_NOT_FOUND,
  PRODUCT_NOT_FOUND,
} = require('../../error-messages/products.messages');

class ProductsService {
  getProductById(id) {
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

  async updateProduct(id, products) {
    const product = await Products.findById(id);
    if (!product) {
      throw new Error(PRODUCT_NOT_FOUND);
    }
    return Products.findByIdAndUpdate(id, products, { new: true });
  }

  async addProduct(data) {
    if (await this.checkProductExist(data)) {
      throw new Error(PRODUCT_ALREADY_EXIST);
    }
    return new Products(data).save();
  }

  deleteProduct(id) {
    return Products.findByIdAndDelete(id);
  }

  async checkProductExist(data) {
    const productCount = await Products.countDocuments({
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    });
    return productCount > 0;
  }
}
module.exports = new ProductsService();

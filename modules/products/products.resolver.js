const productsService = require('./products.service');

const searchConfig = searchTerm => {
  console.log(typeof new RegExp(searchTerm));
  return [
    { title: { $regex: `${new RegExp(searchTerm)}` } },
    { description: { $regex: new RegExp(searchTerm) } },
  ];
};

const productsQuery = {
  getAllProducts: () => productsService.getAllProducts(),
  getProductsById: (parent, args) => productsService.getProductsById(args.id),
  async getProductsByOptions(parent, args, context, info) {
    const isNotBlank = str => !(!str || str.trim().length === 0);
    const filter = filterItems(args.filter);
    if (isNotBlank(args.search)) {
      filter.$or = searchConfig(args.search);
      // projection.score = { $meta: 'textScore' };
    }
    const product = await productsService.getProductsByOptions(
      filter,
      args.skip,
      args.limit,
      args.sort,
      args.search,
    );
    return product;
  },
};
const filterItems = (args = {}) => {
  const filter = {};
  const {
    colorCodes, pattern, simpleName, available,
  } = args;
  if (colorCodes) {
    filter.colors = {
      $elemMatch: {
        code: { $in: colorCodes },
      },
    };
  }
  if (simpleName) {
    filter.colors = {
      $elemMatch: {
        simpleName: { $in: simpleName },
      },
    };
  }
  if (available) {
    filter.colors = {
      $elemMatch: {
        available,
      },
    };
  }
  if (pattern) {
    filter.pattern = {
      $elemMatch: { value: { $in: pattern } },
    };
  }
  return filter;
};

const productsMutation = {
  addProducts: (parent, args) => productsService.addProducts(args.products),
  deleteProducts: (parent, args) => productsService.deleteProducts(args.id),
  updateProductById: (parent, args) => productsService.updateProductById(args.id, args.products),
};

module.exports = { productsQuery, filterItems, productsMutation };

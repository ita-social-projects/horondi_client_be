const Products = require('./products.model');
const Size = require('../../models/Size');

class ProductsService {
  getAllProducts() {
    return Products.find();
  }

  getProductsById(id) {
    return Products.findById(id);
  }

  getSizeById(id) {
    return Size.findById(id);
  }

  getProductsByOptions(filter, skip, limit, sort, search) {
    return Products.find(filter)
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

const Products = require('./products.model');
const Size = require('../../models/Size');
const materialModel = require('../material/material.model');

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

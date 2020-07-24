const Products = require('./products.model');

class ProductsService {
  getAllProducts() {
    return Products.find();
  }

  getProductsById(id) {
    return Products.findById(id);
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

const Product = require('./product.model');
const sizesService = require('../size/size.service');
const Material = require('../material/material.model');
const User = require('../user/user.model');
const modelService = require('../model/model.service');
const uploadService = require('../upload/upload.service');
const {
  PRODUCT_ALREADY_EXIST,
  PRODUCT_NOT_FOUND,
} = require('../../error-messages/products.messages');
const {
  CATEGORY_NOT_FOUND,
} = require('../../error-messages/category.messages');
const { Error } = require('mongoose');
const { uploadProductImages } = require('./product.utils');
const { calculatePrice } = require('../currency/currency.utils');

class ProductsService {
  async getProductById(id) {
    return Product.findById(id);
  }

  async getModelsByCategory(id) {
    const product = Product.find({ category: id });
    if (product.length === 0) {
      throw new Error(CATEGORY_NOT_FOUND);
    }
    return product;
  }

  filterItems(args = {}) {
    const filter = {};
    const {
      pattern,
      colors,
      price,
      category,
      isHotItem,
      models,
      currency,
    } = args;

    if (isHotItem) {
      filter.isHotItem = isHotItem;
    }
    if (category && category.length) {
      filter.category = { $in: category };
    }
    if (models && models.length) {
      filter.model = { $in: model };
    }
    if (colors && colors.length) {
      filter.colors = { $in: colors };
    }
    if (pattern && pattern.length) {
      filter.pattern = { $in: pattern };
    }
    if (price && price.length) {
      const currencySign = currency === 0 ? 'UAH' : currency === 1 ? 'USD' : '';
      filter.basePrice = {
        $elemMatch: {
          currency: currencySign,
          value: {
            $gte: price[0],
            $lte: price[1],
          },
        },
      };
    }
    return filter;
  }

  async getProducts({ filter, skip, limit, sort, search }) {
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
    const items = Product.find(filters)
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const count = Product.find(filters).countDocuments();
    return {
      items,
      count,
    };
  }

  async updateProduct(id, productData, filesToUpload, primary) {
    const product = Product.findById(id).lean();
    if (!product) {
      throw new Error(PRODUCT_NOT_FOUND);
    }
    if (await this.checkProductExist(productData)) {
      throw new Error(PRODUCT_ALREADY_EXIST);
    }
    if (primary) {
      await uploadService.deleteFiles(
        Object.values(product.images.primary).filter(
          item => typeof item === 'string'
        )
      );
      const uploadResult = await uploadService.uploadFiles(primary);
      const imagesResults = await uploadResult[0];
      productData.images.primary = imagesResults.fileNames;
    }
    if (filesToUpload.length) {
      const uploadResult = await uploadService.uploadFiles(filesToUpload);
      const imagesResults = await Promise.allSettled(uploadResult);
      const additional = imagesResults.map(res => res.value.fileNames);
      productData.images.additional = [
        ...product.images.additional,
        ...additional,
      ];
    }
    const { basePrice } = productData;
    productData.basePrice = await calculatePrice(basePrice);
    return Product.findByIdAndUpdate(id, productData, { new: true });
  }

  async addProduct(productData, filesToUpload) {
    if (await this.checkProductExist(productData)) {
      throw new Error(PRODUCT_ALREADY_EXIST);
    }
    const { primary, additional } = await uploadProductImages(filesToUpload);

    const { basePrice } = productData;
    productData.basePrice = await calculatePrice(basePrice);

    const model = await modelService.getModelById(productData.model);
    productData.model = model;

    productData.images = {
      primary,
      additional,
    };

    const newProduct = await new Product(productData).save();

    if (newProduct) return newProduct;
  }

  async deleteProduct(id) {
    const product = Product.findById(id).lean();
    if (!product) {
      throw new Error(PRODUCT_NOT_FOUND);
    }
    const { images } = product;
    const { primary, additional } = images;
    const additionalImagesToDelete = Object.assign(...additional);
    const deletedImages = await uploadService.deleteFiles([
      ...Object.values(primary),
      ...Object.values(additionalImagesToDelete),
    ]);

    if (await Promise.allSettled(deletedImages)) {
      return Product.findByIdAndDelete(id);
    }
  }

  async checkProductExist(data) {
    let productCount = Product.countDocuments({
      name: {
        $elemMatch: {
          $or: data.name.map(({ value }) => ({ value })),
        },
      },
    });
    return productCount > 0;
  }

  async deleteImages(id, imagesToDelete) {
    const product = Product.findById(id).lean();
    const deleteResults = await uploadService.deleteFiles(imagesToDelete);
    if (await Promise.allSettled(deleteResults)) {
      const newImages = product.images.additional.filter(
        item =>
          !Object.values(item).filter(image => imagesToDelete.includes(image))
            .length
      );
      const updatedProduct = Product.findByIdAndUpdate(
        id,
        {
          images: {
            primary: product.images.primary,
            additional: newImages,
          },
        },
        { new: true }
      );
      return updatedProduct.images;
    }
  }

  async getPopularProducts() {
    const products = Product.find()
      .sort({ purchasedCount: -1 })
      .limit(10)
      .lean();

    return products.reduce(
      (prev, curr) => ({
        labels: [...prev.labels, String(curr.name[0].value)],
        counts: [...prev.counts, curr.purchasedCount],
        total: prev.total + curr.purchasedCount,
      }),
      { labels: [], counts: [], total: 0 }
    );
  }

  async getProductsForWishlist(userId) {
    const { wishlist } = User.findById(userId);
    return Product.find({ _id: { $in: wishlist } });
  }

  async getProductsForCart(userId) {
    const { cart } = User.findById(userId);
    return Product.find({ _id: { $in: cart } });
  }
}

module.exports = new ProductsService();

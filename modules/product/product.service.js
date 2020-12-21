const Product = require('./product.model');
const sizesService = require('../size/size.service');
const Material = require('../material/material.model');
const User = require('../user/user.model');
const modelService = require('../model/model.service');
const { uploadFiles, deleteFiles } = require('../upload/upload.service');
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
  getProductById(id) {
    return Product.findById(id);
  }

  async getModelsByCategory(id) {
    const product = await Product.find({ category: id });

    if (product.length === 0) {
      throw new Error(CATEGORY_NOT_FOUND);
    }

    return product;
  }

  async getProductOptions() {
    const sizes = await sizesService.getAllSizes();
    const bottomMaterials = await Material.find();

    return { sizes, bottomMaterials };
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
      filter.model = {
        $elemMatch: {
          value: { $in: models },
        },
      };
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
    const items = await Product.find(filters)
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const count = await Product.find(filters).countDocuments();
    return {
      items,
      count,
    };
  }

  async updateProduct(id, productData, filesToUpload, primary) {
    const product = await Product.findById(id).lean();
    if (!product) {
      throw new Error(PRODUCT_NOT_FOUND);
    }
    if (primary) {
      await deleteFiles(
        Object.values(product.images.primary).filter(
          item => typeof item === 'string'
        )
      );
      const uploadResult = await uploadFiles(primary);
      const imagesResults = await uploadResult[0];
      productData.images.primary = imagesResults.fileNames;
    }
    if (filesToUpload) {
      const uploadResult = await uploadFiles(filesToUpload);
      const imagesResults = await Promise.allSettled(uploadResult);
      const additional = imagesResults.map(res => res.value.fileNames);
      productData.images.additional = [
        ...product.images.additional,
        ...additional,
      ];
    }
    const { basePrice } = productData;
    productData.basePrice = await calculatePrice(basePrice);
    if (!Array.isArray(productData.model)) {
      const model = await modelService.getModelById(productData.model);
      productData.model = model.name;
    }
    return await Product.findByIdAndUpdate(id, productData, { new: true });
  }

  async addProduct(productData, filesToUpload) {
    const { primary, additional } = await uploadProductImages(filesToUpload);

    const { basePrice } = productData;
    productData.basePrice = await calculatePrice(basePrice);

    const model = await modelService.getModelById(productData.model);
    productData.model = model.name;
    productData.images = {
      primary,
      additional,
    };

    const newProduct = await new Product(productData).save();
    if (newProduct) return newProduct;
  }

  async deleteProduct(id) {
    const product = await Product.findById(id).lean();
    if (!product) {
      throw new Error(PRODUCT_NOT_FOUND);
    }
    const { images } = product;
    const { primary, additional } = images;
    const additionalImagesToDelete = Object.assign(...additional);
    const deletedImages = await deleteFiles([
      ...Object.values(primary),
      ...Object.values(additionalImagesToDelete),
    ]);

    if (await Promise.allSettled(deletedImages)) {
      return Product.findByIdAndDelete(id);
    }
  }

  async checkProductExist(data, id) {
    const modelCount = await Product.countDocuments({
      _id: { $ne: id },
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    });
    return modelCount > 0;
  }

  async deleteImages(id, imagesToDelete) {
    const product = await Product.findById(id).lean();
    const deleteResults = await deleteFiles(imagesToDelete);
    if (await Promise.allSettled(deleteResults)) {
      const newImages = product.images.additional.filter(
        item =>
          !Object.values(item).filter(image => imagesToDelete.includes(image))
            .length
      );
      const updatedProduct = await Product.findByIdAndUpdate(
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
    const products = await Product.find()
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
    const { wishlist } = await User.findById(userId);
    return await Product.find({ _id: { $in: wishlist } });
  }

  async getProductsForCart(userId) {
    const { cart } = await User.findById(userId);
    return await Product.find({ _id: { $in: cart } });
  }
}

module.exports = new ProductsService();

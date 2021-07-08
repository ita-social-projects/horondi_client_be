const _ = require('lodash');

const Product = require('./product.model');
const User = require('../user/user.model');
const modelService = require('../model/model.service');
const uploadService = require('../upload/upload.service');
const {
  PRODUCT_ALREADY_EXIST,
  PRODUCT_NOT_FOUND,
  PRODUCT_HAS_NOT_CHANGED,
} = require('../../error-messages/products.messages');
const {
  CATEGORY_NOT_FOUND,
} = require('../../error-messages/category.messages');
const { uploadProductImages } = require('./product.utils');
const { calculatePrice } = require('../currency/currency.utils');
const {
  CURRENCY: { UAH, USD },
} = require('../../consts/currency');
const {
  PRODUCT_FEATURES: {
    PRODUCT_CATEGORY,
    PRODUCT_MODEL,
    PRODUCT_PATTERN,
    PRODUCT_CLOSURE,
    PRODUCT_MAIN_MATERIAL,
    PRODUCT_MAIN_COLOR,
    PRODUCT_INNER_MATERIAL,
    PRODUCT_INNER_COLOR,
    PRODUCT_BOTTOM_MATERIAL,
    PRODUCT_BOTTOM_COLOR,
  },
} = require('../../consts/product-features');
const {
  DEFAULT_IMAGES: {
    LARGE_SAD_BACKPACK,
    MEDIUM_SAD_BACKPACK,
    SMALL_SAD_BACKPACK,
    THUMBNAIL_SAD_BACKPACK,
  },
} = require('../../consts/default-images');
const { getCurrencySign } = require('../../utils/product-service');
const RuleError = require('../../errors/rule.error');
const {
  STATUS_CODES: { FORBIDDEN },
} = require('../../consts/status-codes');
const {
  HISTORY_ACTIONS: { ADD_PRODUCT, DELETE_PRODUCT, EDIT_PRODUCT },
} = require('../../consts/history-actions');
const {
  generateHistoryObject,
  getChanges,
  generateHistoryChangesData,
} = require('../../utils/hisrory');
const { addHistoryRecord } = require('../history/history.service');
const {
  LANGUAGE_INDEX: { UA },
} = require('../../consts/languages');
const {
  HISTORY_OBJ_KEYS: {
    SIZES,
    PURCHASED_COUNT,
    AVAILABLE_COUNT,
    CATEGORY,
    MODEL,
    NAME,
    DESCRIPTION,
    MAIN_MATERIAL,
    INNER_MATERIAL,
    BOTTOM_MATERIAL,
    STRAP_LENGTH_IN_CM,
    PATTERN,
    CLOSURE,
    AVAILABLE,
    IS_HOT_ITEM,
  },
} = require('../../consts/history-obj-keys');

class ProductsService {
  async getProductById(id) {
    return Product.findById(id).exec();
  }

  async getProductsFilters() {
    const categories = await Product.distinct(PRODUCT_CATEGORY)
      .lean()
      .exec();
    const models = await Product.distinct(PRODUCT_MODEL)
      .lean()
      .exec();
    const patterns = await Product.distinct(PRODUCT_PATTERN)
      .lean()
      .exec();
    const closures = await Product.distinct(PRODUCT_CLOSURE)
      .lean()
      .exec();
    const mainMaterial = await Product.distinct(PRODUCT_MAIN_MATERIAL)
      .lean()
      .exec();
    const mainMaterialColor = await Product.distinct(PRODUCT_MAIN_COLOR)
      .lean()
      .exec();
    const innerMaterial = await Product.distinct(PRODUCT_INNER_MATERIAL)
      .lean()
      .exec();
    const innerMaterialColor = await Product.distinct(PRODUCT_INNER_COLOR)
      .lean()
      .exec();
    const bottomMaterial = await Product.distinct(PRODUCT_BOTTOM_MATERIAL)
      .lean()
      .exec();
    const bottomMaterialColor = await Product.distinct(PRODUCT_BOTTOM_COLOR)
      .lean()
      .exec();
    const products = await this.getProducts({});
    const sortedByPrices = [...products.items].sort(
      (a, b) => a.basePrice[1].value - b.basePrice[1].value
    );
    const minPrice = sortedByPrices[0].basePrice;
    const maxPrice = sortedByPrices[sortedByPrices.length - 1].basePrice;

    return {
      minPrice,
      maxPrice,
      categories,
      models,
      patterns,
      closures,
      mainMaterial,
      mainMaterialColor,
      innerMaterial,
      innerMaterialColor,
      bottomMaterial,
      bottomMaterialColor,
    };
  }

  async getModelsByCategory(id) {
    const product = await Product.find({ category: id }).exec();
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
      filter.model = { $in: models };
    }
    if (colors && colors.length) {
      filter.colors = { $in: colors };
    }
    if (pattern && pattern.length) {
      filter.pattern = { $in: pattern };
    }
    if (price && price.length) {
      filter.basePrice = {
        $elemMatch: {
          currency: getCurrencySign(currency, UAH, USD),
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
          name: {
            $elemMatch: { value: { $regex: new RegExp(search.trim(), 'i') } },
          },
        },
        {
          description: {
            $elemMatch: { value: { $regex: new RegExp(search.trim(), 'i') } },
          },
        },
      ];
    }
    const items = await Product.find(filters)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .exec();

    const count = await Product.find(filters).countDocuments();
    return {
      items,
      count,
    };
  }

  async updateProduct(
    id,
    productData,
    filesToUpload,
    primary,
    { _id: adminId }
  ) {
    productData.images = {
      primary: {
        large: LARGE_SAD_BACKPACK,
        medium: MEDIUM_SAD_BACKPACK,
        small: SMALL_SAD_BACKPACK,
        thumbnail: THUMBNAIL_SAD_BACKPACK,
      },
    };
    filesToUpload.length
      ? (productData.images.additional = [])
      : (productData.images.additional = [
          {
            large: LARGE_SAD_BACKPACK,
            medium: MEDIUM_SAD_BACKPACK,
            small: SMALL_SAD_BACKPACK,
            thumbnail: THUMBNAIL_SAD_BACKPACK,
          },
        ]);

    const product = await Product.findById(id)
      .lean()
      .exec();
    if (!product) {
      throw new RuleError(PRODUCT_NOT_FOUND, FORBIDDEN);
    }
    if (_.isMatch(productData, product)) {
      throw new RuleError(PRODUCT_HAS_NOT_CHANGED, FORBIDDEN);
    }
    if (primary) {
      if (primary?.large) {
        productData.images.primary = primary;
      } else {
        await uploadService.deleteFiles(
          Object.values(product.images.primary).filter(
            item => typeof item === 'string'
          )
        );
        const uploadResult = await uploadService.uploadFiles(primary);
        const imagesResults = await uploadResult[0];
        productData.images.primary = imagesResults?.fileNames;
      }
    }
    if (filesToUpload.length) {
      const previousImagesLinks = [];
      const newFiles = [];
      filesToUpload.forEach(e => {
        if (e?.large) {
          previousImagesLinks.push(e);
        } else {
          newFiles.push(e);
        }
      });
      const newUploadResult = await uploadService.uploadFiles(newFiles);
      const imagesResults = await Promise.allSettled(newUploadResult);
      const additional = imagesResults.map(res => res?.value?.fileNames);
      productData.images.additional = [...additional, ...previousImagesLinks];
    }
    const { basePrice } = productData;
    productData.basePrice = await calculatePrice(basePrice);
    if (productData) {
      const { beforeChanges, afterChanges } = getChanges(product, productData);

      const historyRecord = generateHistoryObject(
        EDIT_PRODUCT,
        product.model,
        product.name[UA].value,
        product._id,
        beforeChanges,
        afterChanges,
        adminId
      );
      await addHistoryRecord(historyRecord);
    }

    return Product.findByIdAndUpdate(id, productData, {
      new: true,
    }).exec();
  }

  async addProduct(productData, filesToUpload, { _id: adminId }) {
    if (await this.checkProductExist(productData)) {
      throw new Error(PRODUCT_ALREADY_EXIST);
    }
    const { primary, additional } = await uploadProductImages(filesToUpload);

    const { basePrice } = productData;
    productData.basePrice = await calculatePrice(basePrice);

    productData.model = await modelService.getModelById(productData.model);

    productData.images = {
      primary,
      additional,
    };

    const newProduct = await new Product(productData).save();
    if (productData) {
      const historyRecord = generateHistoryObject(
        ADD_PRODUCT,
        newProduct.model?._id,
        newProduct.name[UA].value,
        newProduct._id,
        [],
        generateHistoryChangesData(newProduct, [
          SIZES,
          PURCHASED_COUNT,
          AVAILABLE_COUNT,
          CATEGORY,
          MODEL,
          NAME,
          DESCRIPTION,
          MAIN_MATERIAL,
          INNER_MATERIAL,
          BOTTOM_MATERIAL,
          STRAP_LENGTH_IN_CM,
          PATTERN,
          CLOSURE,
          AVAILABLE,
          IS_HOT_ITEM,
        ]),
        adminId
      );

      await addHistoryRecord(historyRecord);

      return newProduct;
    }
  }

  async deleteProduct(id, { _id: adminId }) {
    const product = await Product.findById(id)
      .lean()
      .exec();
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
      const historyRecord = generateHistoryObject(
        DELETE_PRODUCT,
        product.model,
        product.name[UA].value,
        product._id,
        generateHistoryChangesData(product, [
          SIZES,
          PURCHASED_COUNT,
          AVAILABLE_COUNT,
          CATEGORY,
          MODEL,
          NAME,
          DESCRIPTION,
          MAIN_MATERIAL,
          INNER_MATERIAL,
          BOTTOM_MATERIAL,
          STRAP_LENGTH_IN_CM,
          PATTERN,
          CLOSURE,
          AVAILABLE,
          IS_HOT_ITEM,
        ]),
        [],
        adminId
      );

      await addHistoryRecord(historyRecord);

      return Product.findByIdAndDelete(id);
    }
  }

  async checkProductExist(data) {
    const productCount = await Product.countDocuments({
      name: {
        $elemMatch: {
          $or: data.name.map(({ value }) => ({ value })),
        },
      },
    }).exec();
    return productCount > 0;
  }

  async deleteImages(id, imagesToDelete) {
    const product = await Product.findById(id)
      .lean()
      .exec();
    const deleteResults = await uploadService.deleteFiles(imagesToDelete);
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
      ).exec();
      return updatedProduct.images;
    }
  }

  async getPopularProducts() {
    const products = await Product.find()
      .sort({ purchasedCount: -1 })
      .limit(10)
      .lean()
      .exec();

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
    const { wishlist } = await User.findById(userId).exec();
    return Product.find({ _id: { $in: wishlist } }).exec();
  }

  async getProductsForCart(userId) {
    const { cart } = await User.findById(userId).exec();
    return Product.find({ _id: { $in: cart } }).exec();
  }
}

module.exports = new ProductsService();

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
const createTranslations = require('../../utils/createTranslations');
const {
  addTranslations,
  updateTranslations,
  deleteTranslations,
} = require('../translations/translations.service');
const {
  CATEGORY_NOT_FOUND,
} = require('../../error-messages/category.messages');
const { uploadProductImages } = require('./product.utils');
const { calculateBasePrice } = require('../currency/currency.utils');
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
  STATUS_CODES: { FORBIDDEN, NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const {
  HISTORY_ACTIONS: { ADD_EVENT, DELETE_EVENT, EDIT_EVENT },
  HISTORY_NAMES: { PRODUCT_EVENT },
} = require('../../consts/history-events');
const {
  generateHistoryObject,
  getChanges,
  generateHistoryChangesData,
} = require('../../utils/history');
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
const {
  finalPriceCalculation,
  finalPriceRecalculation,
} = require('../../utils/final-price-calculation');

class ProductsService {
  async getProductById(id) {
    const product = await Product.findById(id).exec();
    if (!product) {
      throw new RuleError(PRODUCT_NOT_FOUND, NOT_FOUND);
    }
    return product;
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
      (a, b) =>
        a.sizes[a.sizes.length - 1].price[0].value -
        b.sizes[b.sizes.length - 1].price[0].value
    );

    const minPrice = sortedByPrices[0].sizes[0].price;
    const maxPrice = sortedByPrices[sortedByPrices.length - 1].sizes[0].price;

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
      throw new RuleError(CATEGORY_NOT_FOUND, NOT_FOUND);
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
      filter.sizes = {
        $elemMatch: {
          price: {
            $elemMatch: {
              currency: getCurrencySign(currency, UAH, USD),
              value: {
                $gte: price[0],
                $lte: price[1],
              },
            },
          },
        },
      };
    }
    return filter;
  }

  async getProducts({ filter, skip, limit, sort = { rate: -1 }, search }) {
    const filters = this.filterItems(filter);
    const sortValue = Object.keys(sort).includes('basePrice')
      ? {
          'sizes.price.value': sort.basePrice,
        }
      : sort;
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
      .sort(sortValue)
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await Product.find(filters)
      .countDocuments()
      .exec();

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
    const matchPrimaryInUpload = filesToUpload.filter(
      item => item.large === productData.images[0].primary.large
    );
    productData.images = {
      primary: {
        large: LARGE_SAD_BACKPACK,
        medium: MEDIUM_SAD_BACKPACK,
        small: SMALL_SAD_BACKPACK,
        thumbnail: THUMBNAIL_SAD_BACKPACK,
      },
    };

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
        if (!matchPrimaryInUpload.length)
          await uploadService.deleteFiles(
            Object.values(product.images.primary).filter(
              item => typeof item === 'string'
            )
          );
        const uploadResult = await uploadService.uploadFiles([primary]);
        const imagesResults = await uploadResult[0];
        productData.images.primary = imagesResults?.fileNames;
      }
    }
    if (filesToUpload.length) {
      productData.images.additional = [];
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
    } else {
      productData.images.additional = [
        {
          large: LARGE_SAD_BACKPACK,
          medium: MEDIUM_SAD_BACKPACK,
          small: SMALL_SAD_BACKPACK,
          thumbnail: THUMBNAIL_SAD_BACKPACK,
        },
      ];
    }
    const { basePrice } = productData;
    productData.basePrice = await calculateBasePrice(basePrice);
    productData.sizes = await finalPriceCalculation(productData);

    const { beforeChanges, afterChanges } = getChanges(product, productData);
    const historyEvent = {
      action: EDIT_EVENT,
      historyName: PRODUCT_EVENT,
    };
    const historyRecord = generateHistoryObject(
      historyEvent,
      product.model,
      product.name[UA].value,
      product._id,
      beforeChanges,
      afterChanges,
      adminId
    );
    await addHistoryRecord(historyRecord);
    await updateTranslations(
      product.translationsKey,
      createTranslations(productData)
    );

    return Product.findByIdAndUpdate(id, productData, {
      new: true,
    }).exec();
  }

  async addProduct(productData, filesToUpload, { _id: adminId }) {
    if (await this.checkProductExist(productData)) {
      throw new RuleError(PRODUCT_ALREADY_EXIST, BAD_REQUEST);
    }
    const { primary, additional } = await uploadProductImages(filesToUpload);

    const { basePrice } = productData;
    productData.basePrice = await calculateBasePrice(basePrice);

    productData.model = await modelService.getModelById(productData.model);

    productData.images = {
      primary,
      additional,
    };

    productData.sizes = await finalPriceCalculation(productData);
    productData.translationsKey = await addTranslations(
      createTranslations(productData)
    );

    const newProduct = await new Product(productData).save();

    if (productData) {
      const historyEvent = {
        action: ADD_EVENT,
        historyName: PRODUCT_EVENT,
      };
      const historyRecord = generateHistoryObject(
        historyEvent,
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
      throw new RuleError(PRODUCT_NOT_FOUND, NOT_FOUND);
    }

    const { images } = product;
    const { primary, additional } = images;
    const additionalImagesToDelete =
      typeof additional[0] === 'object'
        ? additional.map(img => [...Object.values(img)]).flat()
        : [];

    const deletedImages = await uploadService.deleteFiles([
      ...Object.values(primary),
      ...additionalImagesToDelete,
    ]);

    if (await Promise.allSettled(deletedImages)) {
      const historyEvent = {
        action: DELETE_EVENT,
        historyName: PRODUCT_EVENT,
      };
      const historyRecord = generateHistoryObject(
        historyEvent,
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

      await deleteTranslations(product.translationsKey);

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

  async updatePrices(previousPriceValue, nextPriceValue, path, id) {
    if (
      previousPriceValue.additionalPrice[1]?.value !==
        nextPriceValue.additionalPrice[1]?.value ||
      previousPriceValue.additionalPrice[0].value !==
        nextPriceValue.additionalPrice.value
    ) {
      const products = await Product.find({
        [`${path}`]: {
          $eq: id,
        },
      })
        .distinct('_id')
        .exec();

      for (const productId of products) {
        await Product.findByIdAndUpdate(productId, {
          sizes: await finalPriceRecalculation(productId),
        }).exec();
      }
    }
  }
}

module.exports = new ProductsService();

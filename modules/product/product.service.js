const _ = require('lodash');

const Product = require('./product.model');
const User = require('../user/user.model');
const Order = require('../order/order.model');
const modelService = require('../model/model.service');
const uploadService = require('../upload/upload.service');
const {
  PRODUCT_ALREADY_EXIST,
  PRODUCT_NOT_FOUND,
  PRODUCT_HAS_NOT_CHANGED,
} = require('../../error-messages/products.messages');
const { MODEL_NOT_FOUND } = require('../../error-messages/model.messages');
const { SIZE_NOT_FOUND } = require('../../error-messages/size.messages');
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
  finalPriceCalculationForConstructor,
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

  async getProductModelById(productId) {
    const product = await this.getProductById(productId);
    const model = await modelService.getModelById(product.model);
    if (!model) {
      throw new RuleError(MODEL_NOT_FOUND, NOT_FOUND);
    }

    return model;
  }

  async getProductsFilters() {
    const filter = {
      isFromConstructor: { $ne: true },
      isDeleted: { $ne: true },
    };
    const categories = await Product.distinct(PRODUCT_CATEGORY, filter)
      .lean()
      .exec();
    const models = await Product.distinct(PRODUCT_MODEL, filter).lean().exec();
    const patterns = await Product.distinct(PRODUCT_PATTERN).lean().exec();
    const closures = await Product.distinct(PRODUCT_CLOSURE).lean().exec();
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
        a.sizes[a.sizes.length - 1]?.price - b.sizes[b.sizes.length - 1]?.price
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
      isFromConstructor,
      isDeleted,
    } = args;

    filter.isFromConstructor = isFromConstructor;
    filter.isDeleted = isDeleted;

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
            $gte: price[0],
            $lte: price[1],
          },
        },
      };
    }

    return filter;
  }

  async getProducts({ filter, skip, limit, sort = { rate: -1 }, search }) {
    const filters = this.filterItems({
      ...filter,
      isFromConstructor: {
        $ne: true,
      },
      isDeleted: { $ne: true },
    });

    const sortValue = Object.keys(sort).includes('basePrice')
      ? {
          'sizes.price': sort.basePrice,
        }
      : sort;
    if (!(!search || search.trim().length === 0)) {
      filters.$or = [
        {
          name: {
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

    const count = await Product.find(filters).countDocuments().exec();

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
    const matchPrimaryInUpload =
      filesToUpload &&
      filesToUpload.filter(
        item => item.large === productData.images.primary.large
      );

    const product = await Product.findById(id).lean().exec();
    if (!product) {
      throw new RuleError(PRODUCT_NOT_FOUND, FORBIDDEN);
    }
    if (_.isMatch(productData, product)) {
      throw new RuleError(PRODUCT_HAS_NOT_CHANGED, FORBIDDEN);
    }

    if (primary) {
      productData.images.primary = await this.getPrimaryImages(
        primary,
        matchPrimaryInUpload,
        product
      );
    }

    if (filesToUpload.length) {
      const [previousImagesLinks, newFiles] = filesToUpload.reduce(
        ([prevLinks, newImages], imageFile) =>
          imageFile?.large
            ? [[...prevLinks, imageFile], newImages]
            : [prevLinks, [...newImages, imageFile]],
        [[], []]
      );
      const newUploadResult = await uploadService.uploadFiles(newFiles);
      const imagesResults = await Promise.allSettled(newUploadResult);
      const additional = imagesResults.map(res => res?.value?.fileNames);
      productData.images.additional = [...additional, ...previousImagesLinks];
    } else {
      productData.images.additional = [];
    }
    productData.model = await modelService.getModelById(productData.model);
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

  async getPrimaryImages(primary, matchPrimaryInUpload, product) {
    if (primary.large) {
      return primary;
    }
    if (!matchPrimaryInUpload.length) {
      await uploadService.deleteFiles(
        Object.values(product.images.primary).filter(
          item => typeof item === 'string'
        )
      );
    }
    const uploadResult = await uploadService.uploadFiles([primary]);
    const imagesResults = await uploadResult[0];

    return imagesResults?.fileNames;
  }

  async addProduct(productData, filesToUpload, { _id: adminId }) {
    if (await this.checkProductExist(productData)) {
      throw new RuleError(PRODUCT_ALREADY_EXIST, BAD_REQUEST);
    }
    const { primary, additional } = await uploadProductImages(filesToUpload);

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

  async addProductFromConstructor(productData) {
    const existingProduct = await this.findProductFromConstructor(productData);

    if (existingProduct) {
      return existingProduct;
    }

    productData.isFromConstructor = true;

    productData.model = await modelService.getModelById(productData.model);

    productData.sizes = await finalPriceCalculationForConstructor(productData);

    productData.available = false;

    const translations = await addTranslations(createTranslations(productData));
    productData.translationsKey = translations._id;

    return new Product(productData).save();
  }

  async deleteProducts(ids, { _id: adminId }) {
    const response = [];
    for (const itemId of ids) {
      const product = await Product.findById(itemId).lean().exec();

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

        await addHistoryRecord(historyRecord);

        const orders = await Order.find({ 'items.product': itemId }).exec();

        !orders.length && (await deleteTranslations(product.translationsKey));

        const update = {
          $set: {
            isDeleted: true,
            deletedAt: Date.now(),
          },
        };

        const productRes = orders.length
          ? await Product.findByIdAndUpdate(itemId, update, {
              new: true,
            }).exec()
          : await Product.findByIdAndDelete(itemId).exec();
        response.push(productRes);
      }
    }

    return {
      items: response,
    };
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

  async findProductFromConstructor(data) {
    return Product.findOne({
      model: {
        $eq: data.model,
      },
      'mainMaterial.material': {
        $eq: data.mainMaterial.material,
      },
      'mainMaterial.color': {
        $eq: data.mainMaterial.color,
      },
      'bottomMaterial.material': {
        $eq: data.bottomMaterial.material,
      },
      'bottomMaterial.color': {
        $eq: data.bottomMaterial.color,
      },
      pattern: {
        $eq: data.pattern,
      },
    }).exec();
  }

  async deleteImages(id, imagesToDelete) {
    const product = await Product.findById(id).lean().exec();
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

  async getProductSizeById(productId, sizeId) {
    const product = await this.getProductById(productId);
    const model = await modelService.getModelById(product.model);
    const productSizes = product.sizes.map(size => size.size.toString());
    const sizesToSearchIn = modelService.getModelSizes(model, productSizes);

    const foundSize = sizesToSearchIn.find(size => size._id.equals(sizeId));
    if (!foundSize) {
      throw new RuleError(SIZE_NOT_FOUND, NOT_FOUND);
    }

    return foundSize;
  }

  async updatePrices(path, id) {
    const products = await Product.find({
      [path]: id,
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

module.exports = new ProductsService();

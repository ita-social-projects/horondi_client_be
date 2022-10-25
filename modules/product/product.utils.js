const { ObjectId } = require('mongoose').Types;
const RuleError = require('../../errors/rule.error');
const {
  STATUS_CODES: { BAD_REQUEST },
} = require('../../consts/status-codes');
const { PRODUCT_NOT_FOUND } = require('../../error-messages/products.messages');
const Product = require('../product/product.model');

const uploadService = require('../upload/upload.service');

const uploadProductImages = async filesToUpload => {
  const uploadResult = await uploadService.uploadFiles(filesToUpload);
  const imagesResults = await Promise.allSettled(uploadResult);
  const primary = imagesResults[0].value.fileNames;
  const additional = imagesResults.slice(1).map(res => res.value.fileNames);

  return {
    primary,
    additional,
  };
};

const checkProductForSoftDeletion = async ids => {
  const response = await Promise.all(
    ids.ids.map(async itemId => {
      const product = await Product.findById(itemId);
      if (!ObjectId.isValid(itemId) || !product) {
        throw new RuleError(PRODUCT_NOT_FOUND, BAD_REQUEST);
      }
      const products = await Product.find({ _id: itemId }).exec();
      if (!products.length) {
        return null;
      }

      const { images } = products[0];
      const { primary, additional } = images;
      const additionalImagesToDelete =
        typeof additional[0] === 'object'
          ? additional.map(img => [...Object.values(img)]).flat()
          : [];

      await uploadService.deleteFiles([
        ...Object.values(primary),
        ...additionalImagesToDelete,
      ]);

      product.isDeleted = true;
      product.deletedAt = Date.now();
      product.save();

      return product;
    })
  );

  return {
    items: response,
  };
};

module.exports = { uploadProductImages, checkProductForSoftDeletion };

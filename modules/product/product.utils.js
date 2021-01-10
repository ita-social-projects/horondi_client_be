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
const populateProduct = product =>
  product.populate([
    {
      path: 'category',
      model: 'Category',
    },
    {
      path: 'model',
      model: 'Model',
    },
    {
      path: 'colors',
      model: 'Color',
    },
    {
      path: 'closure',
      model: 'Closure',
    },
    {
      path: 'pattern',
      model: 'Pattern',
    },
    {
      path: 'innerMaterial',
      populate: {
        path: 'color',
        model: 'Color',
      },
    },
    {
      path: 'mainMaterial',
      populate: {
        path: 'color',
        model: 'Color',
      },
    },
    {
      path: 'options',
      populate: [
        {
          path: 'size',
          model: 'Size',
        },
        {
          path: 'bottomMaterial',
          model: 'Material',
        },
        {
          path: 'bottomColor',
          model: 'Color',
        },
      ],
    },
  ]);

module.exports = {
  uploadProductImages,
  populateProduct,
};

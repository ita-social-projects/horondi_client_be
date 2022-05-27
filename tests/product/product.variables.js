const badProductId = '6009dcd5f9855555907ebf5e';
const badCategoryId = '6009dcd5567s5555907ebf5e';
const newProductInputData = (
  categoryId,
  modelId,
  mainMaterialId,
  innerMaterialId,
  colorId,
  patternId,
  closureId,
  sizeId
) => ({
  category: categoryId,
  model: modelId,
  name: [
    { lang: 'uk', value: 'тестовий продукт' },
    { lang: 'en', value: 'Some Product' },
  ],
  description: [
    { lang: 'uk', value: 'Приклад опису' },
    { lang: 'en', value: 'Description' },
  ],
  mainMaterial: {
    material: mainMaterialId,
    color: colorId,
  },
  innerMaterial: {
    material: innerMaterialId,
    color: colorId,
  },
  bottomMaterial: {
    material: mainMaterialId,
    color: colorId,
  },
  strapLengthInCm: 30,
  pattern: patternId,
  closure: closureId,
  basePrice: 200,
  sizes: [sizeId],
  available: true,
  availableCount: 20,
});
const newProductInputDataForUpdate = (
  categoryId,
  modelId,
  mainMaterialId,
  innerMaterialId,
  colorId,
  patternId,
  closureId,
  sizeId
) => ({
  category: categoryId,
  model: modelId,
  name: [
    { lang: 'uk', value: 'Нова назва' },
    { lang: 'en', value: 'new name' },
  ],
  description: [
    { lang: 'uk', value: 'новий опис' },
    { lang: 'en', value: 'new description' },
  ],
  mainMaterial: {
    material: mainMaterialId,
    color: colorId,
  },
  innerMaterial: {
    material: innerMaterialId,
    color: colorId,
  },
  bottomMaterial: {
    material: mainMaterialId,
    color: colorId,
  },
  strapLengthInCm: 99,
  pattern: patternId,
  closure: closureId,
  basePrice: 50,
  sizes: [sizeId],
  availableCount: 15,
  images: {
    primary: {
      large: 'largeXL_0_test-file',
      medium: 'mediumXL_0_test-file',
      small: 'smallXL_0_test-file',
      thumbnail: 'thumbnailXL_0_test-file',
    },
    additional: [
      {
        large: 'largeXL_0_test-file',
        medium: 'mediumXL_0_test-file',
        small: 'smallXL_0_test-file',
        thumbnail: 'thumbnailXL_0_test-file',
      },
    ],
  },
});
const newProductInputDataForCompare = product => ({
  category: { _id: product.category },
  closure: { _id: product.closure },
  model: { _id: product.model },
  name: [
    {
      lang: product.name[0].lang,
      value: product.name[0].value,
    },
    {
      lang: product.name[1].lang,
      value: product.name[1].value,
    },
  ],
  description: [
    {
      lang: product.description[0].lang,
      value: product.description[0].value,
    },
    {
      lang: product.description[1].lang,
      value: product.description[1].value,
    },
  ],
  availableCount: product.availableCount,
  pattern: { _id: product.pattern },
  strapLengthInCm: product.strapLengthInCm,
  sizes: [
    { size: { _id: product.sizes[0] } },
    {
      price: 100,
    },
  ],
  innerMaterial: {
    material: {
      _id: product.innerMaterial.material,
    },
    color: {
      _id: product.innerMaterial.color,
    },
  },
  mainMaterial: {
    material: {
      _id: product.mainMaterial.material,
    },
    color: {
      _id: product.mainMaterial.color,
    },
  },
  bottomMaterial: {
    material: {
      _id: product.bottomMaterial.material,
    },
    color: {
      _id: product.bottomMaterial.color,
    },
  },
});

const productUploadedImages = {
  primary: {
    large: 'large_1_test-file',
    medium: 'medium_1_test-file',
    small: 'small_1_test-file',
    thumbnail: 'thumbnail_1_test-file',
  },
  additional: {
    large: 'largeXL_1_test-file',
    medium: 'mediumXL_1_test-file',
    small: 'smallXL_1_test-file',
    thumbnail: 'thumbnailXL_1_test-file',
  },
};

const filterArgs = {
  pattern: '6009dcd5f9855555907ebf5e',
  colors: 'red',
  price: '200',
  category: '6009dcd5f9855555907ebf5e',
  isHotItem: true,
  models: [],
};

const correctFilter = {
  isHotItem: true,
  category: { $in: '6009dcd5f9855555907ebf5e' },
  colors: { $in: 'red' },
  pattern: { $in: '6009dcd5f9855555907ebf5e' },
  sizes: {
    $elemMatch: {
      price: {
        $gte: '2',
        $lte: '0',
      },
    },
  },
};

module.exports = {
  badProductId,
  newProductInputData,
  newProductInputDataForCompare,
  newProductInputDataForUpdate,
  productUploadedImages,
  badCategoryId,
  filterArgs,
  correctFilter,
};

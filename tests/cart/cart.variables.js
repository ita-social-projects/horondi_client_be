const newProductInCart = (productId, sizeId) => ({
  items: {
    product: productId,
    options: {
      size: sizeId,
    },
  },
});
const price = [
  {
    currency: 'UAH',
    value: 50,
  },
  {
    currency: 'USD',
    value: 2,
  },
];
const testQuantity = 3;
const sizeName = 'S';
const userWrongId = '60d593c866a99333c0343a5b';
const productWrongId = '60d593c866a9fh7tjb343a5b';
const sizeWrongId = '60d593c866a99333c0343a5b';
const newSizeId = '615c0ac410a58e1a144cca41';
const expectedPrice = 25310;
const newProductInputData2 = (
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
    { lang: 'uk', value: 'тестовий продукт2' },
    { lang: 'en', value: 'Some Product2' },
  ],
  description: [
    { lang: 'uk', value: 'Приклад опису2' },
    { lang: 'en', value: 'Description2' },
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

const productForChangeSizeHandler = {
  allSizes: [
    {
      size: { _id: '604394cba7532c33dcb326d6' },
      price: [
        { value: 2050, currency: 'UAH' },
        { value: 76, currency: 'USD' },
      ],
    },
  ],
  dimensions: { volumeInLiters: 22, weightInKg: 1 },
  _id: '1633258519639',
  options: { size: { _id: '60439516a7532c33dcb326d7' } },
  price: [
    { value: 3050, currency: 'UAH' },
    { value: 80, currency: 'USD' },
  ],
  quantity: 7,
  sidePocket: false,
  product: { _id: '60588c204b419a0ec128e4bc' },
};
const allSizes = productForChangeSizeHandler.allSizes.map(
  ({ size, price }) => ({ size: size._id, price })
);

module.exports = {
  newProductInCart,
  testQuantity,
  sizeName,
  productWrongId,
  sizeWrongId,
  newProductInputData2,
  userWrongId,
  price,
  expectedPrice,
  productForChangeSizeHandler,
  allSizes,
  newSizeId,
};

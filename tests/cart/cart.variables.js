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
};

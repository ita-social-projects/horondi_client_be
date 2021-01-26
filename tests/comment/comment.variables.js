const validEmail = 'superadmin@gmail.com';
const invalidEmail = 'resttestqwerty123@gmail.com';
const productWrongId = '5faa3d306071ad276cc3d63f';
const commentWrongId = '5faa3d306071ad276cc3d63c';
const wrongData = '123siSTm#';
const rate = 4;
const updatedRate = 1;
const newComment = {
  text: 'Test text',
  user: { email: 'superadmin@gmail.com' },
  show: false,
};
const updatedComment = {
  text: 'updated text',
  user: { email: 'ermn7dyptp@yahoo.com' },
  show: true,
};
const color = {
  name: [
    { lang: 'uk', value: 'Тестовий колір test' },
    { lang: 'en', value: 'Test color test' },
  ],
  colorHex: 'colorHex test',
  simpleName: [
    { lang: 'uk', value: 'Проста назва кольору test' },
    { lang: 'en', value: 'Simple color name test' },
  ],
};
const newCategory = {
  code: 'Code for test',
  name: [
    { lang: 'uk', value: 'Категорія тест' },
    { lang: 'en', value: 'Category test' },
  ],
  images: {
    large: 'large_10b1e9gkhm7xa9m_backpacks.jpg',
    medium: 'medium_10b1e9gkhm7xa9m_backpacks.jpg',
    small: 'small_10b1e9gkhm7xa9m_backpacks.jpg',
    thumbnail: 'thumbnail_10b1e9gkhm7xa9m_backpacks.jpg',
  },
  available: true,
};
const newConstructorBasic = (materialId, colorId) => ({
  name: [
    { lang: 'uk', value: 'Тестовий конструктор базовий' },
    { lang: 'en', value: 'Test constructor basic test' },
  ],
  material: materialId,
  color: colorId,
  basePrice: 200,
  available: true,
});
const newModel = (categoryId, constructorId) => ({
  category: categoryId,
  name: [
    {
      lang: 'ua',
      value: 'Тестова модель',
    },
    {
      lang: 'en',
      value: 'Тестова модель',
    },
  ],
  description: [
    {
      lang: 'ua',
      value: 'Тестовий опис моделі',
    },
    {
      lang: 'en',
      value: 'Test description',
    },
  ],
  priority: 1,
  constructorBasic: [constructorId],
});
const newClosure = materialId => ({
  name: [
    { lang: 'uk', value: ' тест' },
    { lang: 'en', value: ' test' },
  ],
  material: materialId,
  available: true,
});
const newPattern = {
  name: [
    { lang: 'uk', value: 'Паттерн тест' },
    { lang: 'en', value: 'Pattern test' },
  ],
  description: [
    { lang: 'uk', value: 'Опис тест' },
    { lang: 'en', value: 'Description test' },
  ],
  material: ' material',
};
const newProduct = (
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
    { lang: 'uk', value: 'Продукт тест' },
    { lang: 'en', value: 'Product test' },
  ],
  description: [
    { lang: 'uk', value: 'Опис тест' },
    { lang: 'en', value: 'Description test' },
  ],
  mainMaterial: {
    material: mainMaterialId,
    color: colorId,
  },
  innerMaterial: {
    material: innerMaterialId,
    color: colorId,
  },
  strapLengthInCm: 50,
  pattern: patternId,
  closure: closureId,
  basePrice: 200,
  options: [
    {
      size: sizeId,
      bottomMaterial: mainMaterialId,
      description: [
        { lang: 'ua', value: 'Тканина Кордура' },
        { lang: 'en', value: 'Cordura fabric' },
      ],
      bottomColor: colorId,
      availableCount: 777,
      additions: [
        {
          available: true,
          name: [
            { lang: 'uk', value: 'Кишеня' },
            { lang: 'en', value: 'Pocket' },
          ],
          description: [
            { lang: 'uk', value: 'Бокова кишенька за бажанням' },
            { lang: 'en', value: 'Side pocket by request' },
          ],
          additionalPrice: [
            { currency: 'UAH', value: 145000 },
            { currency: 'USD', value: 5229 },
          ],
        },
      ],
    },
  ],
});
module.exports = {
  validEmail,
  invalidEmail,
  newComment,
  wrongData,
  updatedComment,
  commentWrongId,
  productWrongId,
  rate,
  updatedRate,
  newModel,
  newCategory,
  newConstructorBasic,
  newModel,
  newClosure,
  newPattern,
  newProduct,
  color,
};

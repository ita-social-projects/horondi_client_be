const wrongId = '5fb412d8663cf10bec9faa1a';
const newOrderInputData = (productId, modelId, sizeId, constructorId) => ({
  status: 'CREATED',
  user: {
    firstName: 'Arsen',
    lastName: 'Wenger',
    patronymicName: 'Test',
    email: 'test@gmail.com',
    phoneNumber: '380950000000',
  },
  userComment: 'The bag is pretty good',
  delivery: {
    byCourier: true,
    courierOffice: 10,
    invoiceNumber: '6280260',
    sentBy: 'SELFPICKUP',
    cost: [
      {
        currency: 'UAH',
        value: 7000,
      },
      {
        currency: 'USD',
        value: 240,
      },
    ],
  },
  items: [
    {
      product: productId,
      model: modelId,
      quantity: 2,
      isFromConstructor: false,
      constructorBasics: constructorId,
      options: {
        size: sizeId,
      },
      fixedPrice: [
        {
          currency: 'UAH',
          value: 7000,
        },
        {
          currency: 'USD',
          value: 240,
        },
      ],
    },
  ],
  paymentStatus: 'CREATED',
});
const newSizeInputData = {
  name: 'XL',
  heightInCm: 40,
  widthInCm: 50,
  depthInCm: 30,
  volumeInLiters: 15,
  weightInKg: 3.4,
  available: true,
  additionalPrice: 230,
};
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
  sizes: [sizeId],
  availableCount: 20,
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
const newModelInputData = (categoryId, constructorId) => ({
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
const newCategoryInputData = {
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
const newMaterialInputData = colorId => ({
  name: [
    { lang: 'uk', value: 'Матеріал тест' },
    { lang: 'en', value: 'Material test' },
  ],
  colors: [colorId],
  description: [
    { lang: 'uk', value: 'Опис update' },
    { lang: 'en', value: 'Description update' },
  ],
  available: true,
  purpose: 'INNER',
  additionalPrice: 100,
});
const newColorInputData = {
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

const newOrderUpdated = (productId, modelId, sizeId, constructorId) => ({
  status: 'SENT',
  user: {
    firstName: 'Updated',
    lastName: 'Updated',
    patronymicName: 'Updated',
    email: 'test.updated@gmail.com',
    phoneNumber: '380953544271',
  },
  userComment: 'Updated',
  delivery: {
    byCourier: true,
    courierOffice: 10,
    invoiceNumber: '6280260',
    sentBy: 'SELFPICKUP',
    cost: [
      {
        currency: 'UAH',
        value: 7000,
      },
      {
        currency: 'USD',
        value: 240,
      },
    ],
  },
  items: [
    {
      product: productId,
      model: modelId,
      quantity: 2,
      isFromConstructor: false,
      constructorBasics: constructorId,
      options: {
        size: sizeId,
      },
      fixedPrice: [
        {
          currency: 'UAH',
          value: 7000,
        },
        {
          currency: 'USD',
          value: 240,
        },
      ],
    },
  ],
  paymentStatus: 'APPROVED',
});

module.exports = {
  newOrderInputData,
  newCategoryInputData,
  newProductInputData,
  newSizeInputData,
  newModelInputData,
  newMaterialInputData,
  newColorInputData,
  newConstructorBasic,
  newPattern,
  newClosure,
  wrongId,
  newOrderUpdated,
};

const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');

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

const deleteAll = async (materialId, productId, categoryId, modelId) => {
  const operations = await setupApp();
  await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteMaterial(id: $id) {
          ... on Material {
            _id
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: { id: materialId },
  });
  await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteProduct(id: $id) {
          ... on Product {
            _id
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: { id: productId },
  });
  await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteCategory(id: $id) {
          ... on Category {
            _id
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: { id: categoryId },
  });
  await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteModel(id: $id) {
          ... on Model {
            _id
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: { id: modelId },
  });
};

const createModel = async (material, category, modelToCreate) => {
  const operations = await setupApp();
  const createMaterial = await operations.mutate({
    mutation: gql`
      mutation($material: MaterialInput!) {
        addMaterial(material: $material, images: []) {
          ... on Material {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: { material },
  });
  const materialId = createMaterial.data.addMaterial._id;

  const createCategory = await operations.mutate({
    mutation: gql`
      mutation($category: CategoryInput!, $upload: Upload) {
        addCategory(category: $category, upload: $upload) {
          ... on Category {
            _id
            name {
              value
            }
          }
        }
      }
    `,
    variables: {
      category,
      upload: '../___test__/model/dog.img',
    },
  });
  const categoryId = createCategory.data.addCategory._id;
  const subcategoryId = createCategory.data.addCategory._id;

  const createModelData = await operations.mutate({
    mutation: gql`
      mutation($model: ModelInput!) {
        addModel(model: $model) {
          ... on Model {
            _id
            name {
              value
            }
          }
        }
      }
    `,
    variables: { model: { ...modelToCreate, category: categoryId } },
  });

  const modelId = createModelData.data.addModel._id;

  return {
    categoryId,
    subcategoryId,
    modelId,
    materialId,
  };
};

const newCategory = {
  available: true,
  name: [
    {
      value: 'Тестовенька категорія123',
      lang: 'uk',
    },
    {
      value: 'Testy Category',
      lang: 'en',
    },
  ],
  code: 'new catyyy',
  images: {
    large: 'large_none',
    medium: 'medium_none',
    small: 'small_none',
    thumbnail: 'thumbnail_none',
  },
};

const newModel = {
  name: [
    { value: 'Тестова модель', lang: 'uk' },
    { value: 'Test model', lang: 'en' },
  ],
  description: [
    { value: 'Тест1', lang: 'uk' },
    { value: 'Test1', lang: 'en' },
  ],
  images: {
    large: 'large_new',
    medium: 'medium_new',
    small: 'small_new',
    thumbnail: 'thumbnail_new',
  },
};

const newMaterial = {
  name: [
    { lang: 'uk', value: 'Тестовий матеріальчик2' },
    { lang: 'en', value: 'Test Materialyy2' },
  ],
  description: [
    { lang: 'uk', value: 'Опис Тестового матеріальчика' },
    { lang: 'en', value: 'Description for Test Materialyy' },
  ],
  purpose: 'bottomMaterial',
  available: true,
  additionalPrice: 79,
  colors: {
    code: 777,
    name: [
      { lang: 'uk', value: 'Тестовий колір' },
      { lang: 'en', value: 'Test color' },
    ],
    available: true,
    simpleName: [
      { lang: 'uk', value: 'Проста назва матеріальчика' },
      { lang: 'en', value: 'Simple Name for Test Materialyy' },
    ],
  },
};

const getNewProduct = (categoryId, subcategoryId, modelId, materialId) => ({
  name: [
    { lang: 'en', value: 'Very Coool Baggy123' },
    { lang: 'ua', value: 'ДУЖЕ СУПЕРСЬКИЙ Рюкзачечок123' },
  ],
  description: [
    { lang: 'en', value: 'Baggy is so cool' },
    { lang: 'ua', value: 'Рюкзачечок - супер кльовий))' },
  ],
  subcategory: subcategoryId,
  model: modelId,
  category: categoryId,
  mainMaterial: [
    {
      lang: 'uk',
      value: 'Canvas-400G прошита додатковим шаром спеціального матеріалу',
    },
    {
      lang: 'en',
      value:
        'Canvas-400G padded with a layer of durable and water-resistant material',
    },
  ],
  innerMaterial: [
    { lang: 'uk', value: 'Oxford 135' },
    { lang: 'en', value: 'Oxford 135' },
  ],
  pattern: [
    { lang: 'uk', value: 'Вишивка' },
    { lang: 'en', value: 'Embroidery' },
  ],
  patternImages: {
    large: 'large-embroidery.jpg',
    medium: 'medium-embroidery.jpg',
    small: 'small-embroidery.jpg',
    thumbnail: 'thumbnail-embroidery.jpg',
  },
  strapLengthInCm: 100,
  closure: [
    { lang: 'uk', value: 'Фастекс (пластикова защіпка)' },
    { lang: 'en', value: 'Plastic closure' },
  ],
  closureColor: 'black',
  basePrice: 1,
  available: true,
  isHotItem: false,
  images: {
    primary: {
      large: 'large-primary_15.jpg',
      medium: 'medium-primary_15.jpg',
      small: 'small-primary_15.jpg',
      thumbnail: 'thumbnail-primary_15.jpg',
    },
    additional: [
      {
        large: 'large-additional_15_1.jpg',
        medium: 'medium-additional_15_1.jpg',
        small: 'small-additional_15_1.jpg',
        thumbnail: 'thumbnail-additional_15_1.jpg',
      },
      {
        large: 'large-additional_15_2.jpg',
        medium: 'medium-additional_15_2.jpg',
        small: 'small-additional_15_2.jpg',
        thumbnail: 'thumbnail-additional_15_2.jpg',
      },
      {
        large: 'large-additional_15_3.jpg',
        medium: 'medium-additional_15_3.jpg',
        small: 'small-additional_15_3.jpg',
        thumbnail: 'thumbnail-additional_15_3.jpg',
      },
    ],
  },
  colors: [
    {
      code: 206,
      name: [
        { lang: 'uk', value: 'Золотий' },
        { lang: 'en', value: 'Golden' },
      ],
      images: {
        large: 'large-golden.jpg',
        medium: 'medium-golden.jpg',
        small: 'small-golden.jpg',
        thumbnail: 'thumbnail-golden.jpg',
      },
      available: true,
      simpleName: [
        { lang: 'uk', value: 'жовтий' },
        { lang: 'en', value: 'yellow' },
      ],
    },
  ],
  options: [
    {
      size: '50288e8716e80d9569f64e2e',
      bottomMaterial: materialId,
      description: [
        { lang: 'ua', value: 'Тканина Кордура' },
        { lang: 'en', value: 'Cordura fabric' },
      ],
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
  createModel,
  newCategory,
  newModel,
  newMaterial,
  getNewProduct,
  deleteAll,
};

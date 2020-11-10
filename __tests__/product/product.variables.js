const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');

const badProductId = '1a1111da11da1111111a111a';

const model = [
  {
    value: 'Тестова моделька',
  },
  {
    value: 'Test modelyy',
  },
];

const deleteAll = async (materialId, productId, categoryId, modelId) => {
  const operations = await setupApp();
  const deleteMaterial = await operations.mutate({
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
  const deleteProduct = await operations.mutate({
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
  const deleteCategory = await operations.mutate({
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
  const deleteModel = await operations.mutate({
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
  return { deleteProduct, deleteMaterial, deleteCategory, deleteModel };
};

const getProductData = product => ({
  available: product.available,
  category: {
    _id: product.category,
  },
  closureColor: product.closureColor,
  description: [
    { value: product.description[0].value },
    { value: product.description[1].value },
  ],
  innerMaterial: [
    { value: product.innerMaterial[0].value },
    { value: product.innerMaterial[1].value },
  ],
  isHotItem: product.isHotItem,
  mainMaterial: [
    { value: product.mainMaterial[0].value },
    { value: product.mainMaterial[1].value },
  ],
  name: [{ value: product.name[0].value }, { value: product.name[1].value }],
  pattern: [
    { value: product.pattern[0].value },
    { value: product.pattern[1].value },
  ],
  strapLengthInCm: product.strapLengthInCm,
  subcategory: {
    _id: product.subcategory,
  },
  purchasedCount: 0,
  rate: 0,
  rateCount: 0,
});

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

const getNewProduct = (categoryId, subcategoryId, modelId, materialId) => ({
  name: [
    { lang: 'en', value: 'Very Coool Baggy' },
    { lang: 'ua', value: 'ДУЖЕ СУПЕРСЬКИЙ Рюкзачечок' },
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

const getProductForUpdate = (
  categoryId,
  subcategoryId,
  modelId,
  materialId
) => ({
  model: modelId,
  name: [
    { lang: 'en', value: 'Bad Baggy' },
    { lang: 'ua', value: 'Жахливий Рюкзачечок' },
  ],
  subcategory: subcategoryId,
  description: [
    { lang: 'en', value: 'Baggy is so bad' },
    { lang: 'ua', value: 'Рюкзачечок - не добрий))' },
  ],
  category: categoryId,
  mainMaterial: [
    {
      lang: 'uk',
      value: 'Canvas-400QQ прошита без спеціального матеріалу',
    },
    {
      lang: 'en',
      value: 'Canvas-400QQ padded without a layer water-resistant material',
    },
  ],
  innerMaterial: [
    { lang: 'uk', value: 'Oxford 115' },
    { lang: 'en', value: 'Oxford 115' },
  ],
  pattern: [
    { lang: 'uk', value: 'Вишивочка' },
    { lang: 'en', value: 'Embroidery' },
  ],
  patternImages: {
    large: 'large-embroidery.jpg',
    medium: 'medium-embroidery.jpg',
    thumbnail: 'thumbnail-embroidery.jpg',
  },
  strapLengthInCm: 90,
  closure: [
    { lang: 'uk', value: 'Фастекс (пластикова защіпка)' },
    { lang: 'en', value: 'Plastic closure' },
  ],
  closureColor: 'white',
  basePrice: 22,
  available: false,
  isHotItem: true,
  images: {
    primary: {
      large: 'large-primary_15_1.jpg',
      medium: 'medium-primary_15_1.jpg',
      thumbnail: 'thumbnail-primary_15_1.jpg',
    },
    additional: [
      {
        large: 'large-additional_15_2.jpg',
        medium: 'medium-additional_15_2.jpg',
        small: 'small-additional_15_2.jpg',
        thumbnail: 'thumbnail-additional_15_2.jpg',
      },
      {
        large: 'large-additional_15.jpg',
        medium: 'medium-additional_15.jpg',
        thumbnail: 'thumbnail-additional_15.jpg',
      },
      {
        large: 'large-additional_15_2.jpg',
        medium: 'medium-additional_15_2.jpg',
        thumbnail: 'thumbnail-additional_15_2.jpg',
      },
    ],
  },
  colors: [
    {
      code: 206,
      name: [
        { lang: 'uk', value: 'Златий' },
        { lang: 'en', value: 'Goldy' },
      ],
      images: {
        large: 'large-golden.jpg',
        medium: 'medium-golden.jpg',
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
      size: '50288e8716e80d7569f64e2e',
      bottomMaterial: materialId,
      description: [
        { lang: 'ua', value: 'Кордура' },
        { lang: 'en', value: 'Cordura' },
      ],
      availableCount: 50,
      additions: [
        {
          available: false,
          name: [
            { lang: 'uk', value: 'Кишеня' },
            { lang: 'en', value: 'Pocket' },
          ],
          description: [
            { lang: 'uk', value: 'Бокова кишенька' },
            { lang: 'en', value: 'Side pocket' },
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

const getSameNameForUpdate = (
  categoryId,
  subcategoryId,
  modelId,
  materialId
) => ({
  category: categoryId,
  subcategory: subcategoryId,
  model: modelId,
  description: [
    { lang: 'en', value: 'Baggy is so cool' },
    { lang: 'ua', value: 'Рюкзачечок - супер кльовий))' },
  ],
  name: [
    { lang: 'en', value: 'Baggy!!!' },
    { lang: 'ua', value: 'Рюкзачечок!!!!' },
  ],
  mainMaterial: [
    {
      lang: 'uk',
      value: 'Canvas-400B прошита додатковим шаром спеціального матеріалу',
    },
    {
      lang: 'en',
      value:
        'Canvas-400B padded with a layer of durable and water-resistant material',
    },
  ],
  innerMaterial: [
    { lang: 'uk', value: 'Oxford 135' },
    { lang: 'en', value: 'Oxford 135' },
  ],
  patternImages: {
    large: 'large-embroidery.jpg',
    medium: 'medium-embroidery.jpg',
    small: 'small-embroidery.jpg',
    thumbnail: 'thumbnail-embroidery.jpg',
  },
  pattern: [
    { lang: 'uk', value: 'Вишивка' },
    { lang: 'en', value: 'Embroidery' },
  ],
  strapLengthInCm: 1000,
  closure: [
    { lang: 'uk', value: 'Фастекс (пластик)' },
    { lang: 'en', value: 'Plastic closure' },
  ],
  closureColor: 'black',
  basePrice: 2,
  available: true,
  isHotItem: false,
  images: {
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
    primary: {
      large: 'large-primary_15.jpg',
      medium: 'medium-primary_15.jpg',
      small: 'small-primary_15.jpg',
      thumbnail: 'thumbnail-primary_15.jpg',
    },
  },
  colors: [
    {
      code: 206,
      name: [
        { lang: 'uk', value: 'Золото' },
        { lang: 'en', value: 'Gold' },
      ],
      available: true,
      simpleName: [
        { lang: 'uk', value: 'жовтий' },
        { lang: 'en', value: 'yelow' },
      ],
      images: {
        large: 'large-golden.jpg',
        medium: 'medium-golden.jpg',
        small: 'small-golden.jpg',
        thumbnail: 'thumbnail-golden.jpg',
      },
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
      availableCount: 7,
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

const newCategory = {
  available: true,
  name: [
    {
      value: 'Тестовенька категорія',
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
    { value: 'Тестова моделька', lang: 'uk' },
    { value: 'Test modelyy', lang: 'en' },
  ],
  description: [
    { value: 'Тест', lang: 'uk' },
    { value: 'Test', lang: 'en' },
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
    { lang: 'uk', value: 'Тестовий матеріальчик' },
    { lang: 'en', value: 'Test Materialyy' },
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

module.exports = {
  badProductId,
  newCategory,
  newModel,
  newMaterial,
  getNewProduct,
  getProductForUpdate,
  getSameNameForUpdate,
  createModel,
  getProductData,
  deleteAll,
  model,
};

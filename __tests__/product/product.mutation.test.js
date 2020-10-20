/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
const {
  newModel,
  newCategory,
  newMaterial,
  badProductId,
  getNewProduct,
  getProductForUpdate,
  getSameNameForUpdate,
} = require('./product.variables');

jest.mock('../../modules/upload/upload.service');

let product;
let updatedProduct;
let productId;
let categoryId;
let subcategoryId;
let modelId;
let sameNameProductId;
let materialId;
let operations;

describe('Product mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const createMaterial = await operations.mutate({
      mutation: gql`
        mutation($material: MaterialInput!) {
          addMaterial(material: $material) {
            ... on Material {
              _id
              name {
                value
              }
            }
          }
        }
      `,
      variables: { material: newMaterial },
    });
    materialId = createMaterial.data.addMaterial._id;

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
        category: newCategory,
        upload: '../___test__/model/dog.img',
      },
    });
    categoryId = createCategory.data.addCategory._id;
    subcategoryId = createCategory.data.addCategory._id;

    const createModel = await operations.mutate({
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
      variables: { model: { ...newModel, category: categoryId } },
    });
    modelId = createModel.data.addModel._id;
    product = getNewProduct(categoryId, subcategoryId, modelId, materialId);
    updatedProduct = getProductForUpdate(
      categoryId,
      subcategoryId,
      modelId,
      materialId
    );
  });

  test('#1 Should add new product', async () => {
    const createProduct = await operations.mutate({
      mutation: gql`
        mutation($product: ProductInput!) {
          addProduct(product: $product) {
            ... on Product {
              _id
              category {
                _id
              }
              subcategory {
                _id
              }
              name {
                value
              }
              description {
                value
              }
              mainMaterial {
                value
              }
              innerMaterial {
                value
              }
              strapLengthInCm
              pattern {
                value
              }
              closureColor
              basePrice {
                value
              }
              available
              isHotItem
              purchasedCount
              rate
              rateCount
            }
          }
        }
      `,
      variables: {
        product,
      },
    });
    productId = createProduct.data.addProduct._id;
    const createdProduct = createProduct.data.addProduct;
    expect(createdProduct).toBeDefined();
    expect(createdProduct).toHaveProperty('name', [
      { value: product.name[0].value },
      { value: product.name[1].value },
    ]);
    expect(createdProduct).toHaveProperty('description', [
      { value: product.description[0].value },
      { value: product.description[1].value },
    ]);
    expect(createdProduct).toHaveProperty('category', {
      _id: product.category,
    });
    expect(createdProduct).toHaveProperty('subcategory', {
      _id: product.subcategory,
    });
    expect(createdProduct).toHaveProperty('mainMaterial', [
      { value: product.mainMaterial[0].value },
      { value: product.mainMaterial[1].value },
    ]);
    expect(createdProduct).toHaveProperty('innerMaterial', [
      { value: product.innerMaterial[0].value },
      { value: product.innerMaterial[1].value },
    ]);
    expect(createdProduct).toHaveProperty(
      'strapLengthInCm',
      product.strapLengthInCm
    );
    expect(createdProduct).toHaveProperty('pattern', [
      { value: product.pattern[0].value },
      { value: product.pattern[1].value },
    ]);
    expect(createdProduct).toHaveProperty('closureColor', product.closureColor);
    expect(createdProduct).toHaveProperty('basePrice', [
      { value: product.basePrice[0].value },
      { value: product.basePrice[1].value },
    ]);
    expect(createdProduct).toHaveProperty('available', product.available);
    expect(createdProduct).toHaveProperty('isHotItem', product.isHotItem);
    expect(createdProduct).toHaveProperty('purchasedCount', 0);
    expect(createdProduct).toHaveProperty('rate', 0);
    expect(createdProduct).toHaveProperty('rateCount', 0);
    const getProduct = await operations.query({
      query: gql`
        query($id: ID!) {
          getProductById(id: $id) {
            ... on Product {
              _id
              category {
                _id
              }
              subcategory {
                _id
              }
              name {
                value
              }
              description {
                value
              }
              mainMaterial {
                value
              }
              innerMaterial {
                value
              }
              strapLengthInCm
              pattern {
                value
              }
              closureColor
              basePrice {
                value
              }
              available
              isHotItem
              purchasedCount
              rate
              rateCount
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
    const receivedProduct = getProduct.data.getProductById;
    const currentProduct = product;
    expect(receivedProduct).toBeDefined();
    expect(receivedProduct).toHaveProperty('name', [
      { value: currentProduct.name[0].value },
      { value: currentProduct.name[1].value },
    ]);
    expect(receivedProduct).toHaveProperty('description', [
      { value: currentProduct.description[0].value },
      { value: currentProduct.description[1].value },
    ]);
    expect(receivedProduct).toHaveProperty('category', {
      _id: currentProduct.category,
    });
    expect(receivedProduct).toHaveProperty('subcategory', {
      _id: currentProduct.subcategory,
    });
    expect(receivedProduct).toHaveProperty('mainMaterial', [
      { value: currentProduct.mainMaterial[0].value },
      { value: currentProduct.mainMaterial[1].value },
    ]);
    expect(receivedProduct).toHaveProperty('innerMaterial', [
      { value: currentProduct.innerMaterial[0].value },
      { value: currentProduct.innerMaterial[1].value },
    ]);
    expect(receivedProduct).toHaveProperty(
      'strapLengthInCm',
      currentProduct.strapLengthInCm
    );
    expect(receivedProduct).toHaveProperty('pattern', [
      { value: currentProduct.pattern[0].value },
      { value: currentProduct.pattern[1].value },
    ]);
    expect(receivedProduct).toHaveProperty(
      'closureColor',
      currentProduct.closureColor
    );
    expect(receivedProduct).toHaveProperty('basePrice', [
      { value: currentProduct.basePrice[0].value },
      { value: currentProduct.basePrice[1].value },
    ]);
    expect(receivedProduct).toHaveProperty(
      'available',
      currentProduct.available
    );
    expect(receivedProduct).toHaveProperty(
      'isHotItem',
      currentProduct.isHotItem
    );
    expect(receivedProduct).toHaveProperty('purchasedCount', 0);
    expect(receivedProduct).toHaveProperty('rate', 0);
    expect(receivedProduct).toHaveProperty('rateCount', 0);
  });

  test('#2 AddProduct should return Error product already exist', async () => {
    const createProduct = await operations.mutate({
      mutation: gql`
        mutation($product: ProductInput!) {
          addProduct(product: $product) {
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
      variables: {
        product: getNewProduct(categoryId, subcategoryId, modelId, materialId),
      },
    });
    const result = createProduct.data.addProduct;
    expect(result).toBeDefined();
    expect(result).toHaveProperty('statusCode', 400);
    expect(result).toHaveProperty('message', 'PRODUCT_ALREADY_EXIST');
  });

  test('#3 Should update new product', async () => {
    const updateProduct = await operations.mutate({
      mutation: gql`
        mutation($product: ProductInput!, $id: ID!) {
          updateProduct(id: $id, product: $product) {
            ... on Product {
              _id
              category {
                _id
              }
              subcategory {
                _id
              }
              name {
                value
              }
              description {
                value
              }
              mainMaterial {
                value
              }
              innerMaterial {
                value
              }
              strapLengthInCm
              pattern {
                value
              }
              closureColor
              basePrice {
                value
              }
              available
              isHotItem
              purchasedCount
              rate
              rateCount
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: {
        product: updatedProduct,
        id: productId,
      },
    });

    const productAfterUpdate = updateProduct.data.updateProduct;
    expect(productAfterUpdate).toBeDefined();
    expect(productAfterUpdate).toHaveProperty('name', [
      { value: updatedProduct.name[0].value },
      { value: updatedProduct.name[1].value },
    ]);
    expect(productAfterUpdate).toHaveProperty('description', [
      { value: updatedProduct.description[0].value },
      { value: updatedProduct.description[1].value },
    ]);
    expect(productAfterUpdate).toHaveProperty('category', {
      _id: updatedProduct.category,
    });
    expect(productAfterUpdate).toHaveProperty('subcategory', {
      _id: updatedProduct.subcategory,
    });
    expect(productAfterUpdate).toHaveProperty('mainMaterial', [
      { value: updatedProduct.mainMaterial[0].value },
      { value: updatedProduct.mainMaterial[1].value },
    ]);
    expect(productAfterUpdate).toHaveProperty('innerMaterial', [
      { value: updatedProduct.innerMaterial[0].value },
      { value: updatedProduct.innerMaterial[1].value },
    ]);
    expect(productAfterUpdate).toHaveProperty(
      'strapLengthInCm',
      updatedProduct.strapLengthInCm
    );
    expect(productAfterUpdate).toHaveProperty('pattern', [
      { value: updatedProduct.pattern[0].value },
      { value: updatedProduct.pattern[1].value },
    ]);
    expect(productAfterUpdate).toHaveProperty(
      'closureColor',
      updatedProduct.closureColor
    );
    expect(productAfterUpdate).toHaveProperty('basePrice', [
      { value: updatedProduct.basePrice[0].value },
      { value: updatedProduct.basePrice[1].value },
    ]);
    expect(productAfterUpdate).toHaveProperty(
      'available',
      updatedProduct.available
    );
    expect(productAfterUpdate).toHaveProperty(
      'isHotItem',
      updatedProduct.isHotItem
    );
    expect(productAfterUpdate).toHaveProperty('purchasedCount', 0);
    expect(productAfterUpdate).toHaveProperty('rate', 0);
    expect(productAfterUpdate).toHaveProperty('rateCount', 0);
  });

  test('#4 UpdateProduct should return Error product not found', async () => {
    const updateProduct = await operations.mutate({
      mutation: gql`
        mutation($product: ProductInput!, $id: ID!) {
          updateProduct(id: $id, product: $product) {
            ... on Product {
              _id
              name {
                lang
                value
              }
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: {
        product: getProductForUpdate(
          categoryId,
          subcategoryId,
          modelId,
          materialId
        ),
        id: badProductId,
      },
    });
    const productAfterUpdate = updateProduct.data.updateProduct;
    expect(productAfterUpdate).toBeDefined();
    expect(productAfterUpdate).toHaveProperty('statusCode', 404);
    expect(productAfterUpdate).toHaveProperty('message', 'PRODUCT_NOT_FOUND');
  });

  test('#5 UpdateProduct should return Error product already exist', async () => {
    const createProduct = await operations.mutate({
      mutation: gql`
        mutation($product: ProductInput!) {
          addProduct(product: $product) {
            ... on Product {
              _id
            }
          }
        }
      `,
      variables: {
        product: getSameNameForUpdate(
          categoryId,
          subcategoryId,
          modelId,
          materialId
        ),
      },
    });
    sameNameProductId = createProduct.data.addProduct._id;

    const updateProduct = await operations.mutate({
      mutation: gql`
        mutation($product: ProductInput!, $id: ID!) {
          updateProduct(id: $id, product: $product) {
            ... on Product {
              _id
              name {
                lang
                value
              }
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: {
        product: getSameNameForUpdate(
          categoryId,
          subcategoryId,
          modelId,
          materialId
        ),
        id: productId,
      },
    });
    const productAfterUpdate = updateProduct.data.updateProduct;
    expect(productAfterUpdate).toBeDefined();
    expect(productAfterUpdate).toHaveProperty('statusCode', 400);
    expect(productAfterUpdate).toHaveProperty(
      'message',
      'PRODUCT_ALREADY_EXIST'
    );
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
      variables: { id: sameNameProductId },
    });
  });

  test('#6 deleteProduct should return add fields and delete product', async () => {
    const deletedProduct = await operations.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteProduct(id: $id) {
            ... on Product {
              _id
              category {
                _id
              }
              subcategory {
                _id
              }
              name {
                value
              }
              description {
                value
              }
              mainMaterial {
                value
              }
              innerMaterial {
                value
              }
              strapLengthInCm
              pattern {
                value
              }
              closureColor
              basePrice {
                value
              }
              available
              isHotItem
              purchasedCount
              rate
              rateCount
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
    const result = deletedProduct.data.deleteProduct;
    expect(result).toBeDefined();
    expect(result).toHaveProperty('name', [
      { value: updatedProduct.name[0].value },
      { value: updatedProduct.name[1].value },
    ]);
    expect(result).toHaveProperty('description', [
      { value: updatedProduct.description[0].value },
      { value: updatedProduct.description[1].value },
    ]);
    expect(result).toHaveProperty('category', { _id: updatedProduct.category });
    expect(result).toHaveProperty('subcategory', {
      _id: updatedProduct.subcategory,
    });
    expect(result).toHaveProperty('mainMaterial', [
      { value: updatedProduct.mainMaterial[0].value },
      { value: updatedProduct.mainMaterial[1].value },
    ]);
    expect(result).toHaveProperty('innerMaterial', [
      { value: updatedProduct.innerMaterial[0].value },
      { value: updatedProduct.innerMaterial[1].value },
    ]);
    expect(result).toHaveProperty(
      'strapLengthInCm',
      updatedProduct.strapLengthInCm
    );
    expect(result).toHaveProperty('pattern', [
      { value: updatedProduct.pattern[0].value },
      { value: updatedProduct.pattern[1].value },
    ]);
    expect(result).toHaveProperty('closureColor', updatedProduct.closureColor);
    expect(result).toHaveProperty('basePrice', [
      { value: updatedProduct.basePrice[0].value },
      { value: updatedProduct.basePrice[1].value },
    ]);
    expect(result).toHaveProperty('available', updatedProduct.available);
    expect(result).toHaveProperty('isHotItem', updatedProduct.isHotItem);
    expect(result).toHaveProperty('purchasedCount', 0);
    expect(result).toHaveProperty('rate', 0);
    expect(result).toHaveProperty('rateCount', 0);
  });

  test('#7 deleteProduct should return error product not found', async () => {
    const deletedProduct = await operations.mutate({
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
    const result = deletedProduct.data.deleteProduct;
    expect(result).toBeDefined();
    expect(result).toHaveProperty('statusCode', 404);
    expect(result).toHaveProperty('message', 'PRODUCT_NOT_FOUND');
  });

  afterAll(async () => {
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
  });
});

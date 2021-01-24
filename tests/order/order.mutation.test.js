/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const {
  newConstructorBasic,
  newPattern,
  newClosure,
  newOrderInputData,
  newSizeInputData,
  newProductInputData,
  newModelInputData,
  newCategoryInputData,
  newMaterialInputData,
  newColorInputData,
} = require('./order.variables');
const {
  createColor,
  createMaterial,
  createCategory,
  createModel,
  createProduct,
  createSize,
  createOrder,
  deleteColor,
  deleteMaterial,
  deleteCategory,
  deleteModel,
  deleteProduct,
  deleteSize,
  deleteOrder,
  getAllOrders,
  createClosure,
  createPattern,
  createConstructorBasic,
  deletePattern,
  deleteConstructorBasic,
  deleteClosure,
  getOrderById,
} = require('./order.helpers');
const { setupApp } = require('../helper-functions');

// jest.mock('../../modules/upload/upload.service');
// jest.mock('../../modules/currency/currency.model.js');
// jest.mock('../../modules/delivery/delivery.service.js');
jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/delivery/delivery.service.js');
jest.mock('../../modules/product/product.utils.js');

let colorId;
let sizeId;
let productId;
let orderId;
let modelId;
let operations;
let materialId;
let categoryId;
let patternId;
let constructorBasicId;
let closureId;

describe('Order mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
    sizeId = await createSize(newSizeInputData, operations);
    colorId = await createColor(newColorInputData, operations);
    categoryId = await createCategory(newCategoryInputData, operations);
    materialId = await createMaterial(
      newMaterialInputData(colorId),
      operations
    );
    patternId = await createPattern(newPattern, operations);
    closureId = await createClosure(newClosure(materialId), operations);
    constructorBasicId = await createConstructorBasic(
      newConstructorBasic(materialId, colorId),
      operations
    );
    modelId = await createModel(
      newModelInputData(categoryId, constructorBasicId),
      operations
    );

    productId = await createProduct(
      newProductInputData(
        categoryId,
        modelId,
        materialId,
        materialId,
        colorId,
        patternId,
        closureId
      ),
      operations
    );
  });
  const {
    status,
    delivery,
    paymentStatus,
    userComment,
    items,
    user,
  } = newOrderInputData(productId, modelId, sizeId, constructorBasicId);

  it('Should create order', async () => {
    const order = await createOrder(
      newOrderInputData(productId, modelId, sizeId, constructorBasicId),
      operations
    );
    orderId = order._id;
    expect(order).toBeDefined();
    expect(items).toBeInstanceOf(Array);
    expect(order).toHaveProperty('status', status);
    expect(order).toHaveProperty('user', user);
    expect(order).toHaveProperty('userComment', userComment);
    expect(order).toHaveProperty('paymentStatus', paymentStatus);
    expect(order).toHaveProperty('delivery', delivery);
    expect(order).toHaveProperty('totalItemsPrice');
    expect(order).toHaveProperty('totalPriceToPay');
  });

  // test('Should update order', async () => {
  //   const order = await operations.mutate({
  //     mutation: gql`
  //       mutation($order: OrderInput!) {
  //         updateOrder(order: $order) {
  //           ... on Order {
  //             _id
  //             user {
  //               email
  //               lastName
  //               firstName
  //               phoneNumber
  //               patronymicName
  //             }
  //             dateOfCreation
  //             delivery {
  //               sentBy
  //               byCourier
  //               invoiceNumber
  //               courierOffice
  //             }
  //             isPaid
  //             status
  //             address {
  //               appartment
  //               buildingNumber
  //               region
  //               street
  //               city
  //               country
  //               zipcode
  //             }
  //             userComment
  //             lastUpdatedDate
  //             cancellationReason
  //             adminComment
  //             items {
  //               bottomColor {
  //                 lang
  //                 value
  //               }
  //               closure {
  //                 lang
  //                 value
  //               }
  //               model {
  //                 lang
  //                 value
  //               }
  //               closureColor
  //               size {
  //                 widthInCm
  //                 weightInKg
  //                 heightInCm
  //                 volumeInLiters
  //                 depthInCm
  //               }
  //               additions {
  //                 lang
  //                 value
  //               }
  //               actualPrice {
  //                 currency
  //                 value
  //               }
  //               name {
  //                 lang
  //                 value
  //               }
  //               pattern {
  //                 lang
  //                 value
  //               }
  //               category {
  //                 lang
  //                 value
  //               }
  //               quantity
  //               colors {
  //                 lang
  //                 value
  //               }
  //               subcategory {
  //                 lang
  //                 value
  //               }
  //               bottomMaterial {
  //                 lang
  //                 value
  //               }
  //             }
  //             totalItemsPrice {
  //               currency
  //               value
  //             }
  //             totalPriceToPay {
  //               currency
  //               value
  //             }
  //             paymentMethod
  //           }
  //           ... on Error {
  //             statusCode
  //             message
  //           }
  //         }
  //       }
  //     `,
  //     variables: { order: { _id: orderId, ...newOrderUpdated } },
  //   });
  //   const updatedOrder = order.data.updateOrder;
  //
  //   expect(updatedOrder).toBeDefined();
  //   expect(updatedOrder).toBeDefined();
  //   expect(updatedOrder).toHaveProperty('status', newOrderUpdated.status);
  //   expect(updatedOrder).toHaveProperty('user', newOrderUpdated.user);
  //   expect(updatedOrder).toHaveProperty('address', newOrderUpdated.address);
  //   expect(updatedOrder).toHaveProperty('delivery', {
  //     byCourier: newOrder.delivery.byCourier,
  //     invoiceNumber: newOrder.delivery.invoiceNumber,
  //     courierOffice: newOrder.delivery.courierOffice,
  //     sentBy: newOrder.delivery.sentBy,
  //   });
  //   expect(updatedOrder).toHaveProperty('items', newOrderUpdated.items);
  //   expect(updatedOrder).toHaveProperty(
  //     'paymentMethod',
  //     newOrderUpdated.paymentMethod,
  //   );
  //   expect(updatedOrder).toHaveProperty('totalItemsPrice');
  //   expect(updatedOrder).toHaveProperty('totalPriceToPay');
  // });

  // test('Should throw error ORDER_NOT_FOUND after try to update', async () => {
  //   const res = await operations
  //     .mutate({
  //       mutation: gql`
  //         mutation($order: OrderInput!) {
  //           updateOrder(order: $order) {
  //             ... on Order {
  //               _id
  //               user {
  //                 email
  //                 lastName
  //                 firstName
  //                 phoneNumber
  //                 patronymicName
  //               }
  //               dateOfCreation
  //               delivery {
  //                 sentOn
  //                 sentBy
  //                 byCourier
  //                 invoiceNumber
  //                 courierOffice
  //               }
  //               isPaid
  //               status
  //               address {
  //                 appartment
  //                 buildingNumber
  //                 region
  //                 street
  //                 city
  //                 country
  //                 zipcode
  //               }
  //               userComment
  //               lastUpdatedDate
  //               cancellationReason
  //               adminComment
  //               items {
  //                 bottomColor {
  //                   lang
  //                   value
  //                 }
  //                 closure {
  //                   lang
  //                   value
  //                 }
  //                 model {
  //                   lang
  //                   value
  //                 }
  //                 closureColor
  //                 size {
  //                   widthInCm
  //                   weightInKg
  //                   heightInCm
  //                   volumeInLiters
  //                   depthInCm
  //                 }
  //                 additions {
  //                   lang
  //                   value
  //                 }
  //                 actualPrice {
  //                   currency
  //                   value
  //                 }
  //                 name {
  //                   lang
  //                   value
  //                 }
  //                 pattern {
  //                   lang
  //                   value
  //                 }
  //                 category {
  //                   lang
  //                   value
  //                 }
  //                 quantity
  //                 colors {
  //                   lang
  //                   value
  //                 }
  //                 subcategory {
  //                   lang
  //                   value
  //                 }
  //                 bottomMaterial {
  //                   lang
  //                   value
  //                 }
  //               }
  //               totalItemsPrice {
  //                 currency
  //                 value
  //               }
  //               totalPriceToPay {
  //                 currency
  //                 value
  //               }
  //               paymentMethod
  //             }
  //             ... on Error {
  //               statusCode
  //               message
  //             }
  //           }
  //         }
  //       `,
  //       variables: {
  //         order: { _id: '5f46a8ac90e86913ed0a95d8', ...newOrderUpdated },
  //       },
  //     })
  //     .catch(err => err);
  //
  //   const error = res;
  //   expect(error.data.updateOrder.message).toBe('ORDER_NOT_FOUND');
  // });

  // test('Should throw error ORDER_NOT_FOUND after try to delete', async () => {
  //   const res = await operations
  //     .mutate({
  //       mutation: gql`
  //         mutation($id: ID!) {
  //           deleteOrder(id: $id) {
  //             ... on Order {
  //               _id
  //             }
  //             ... on Error {
  //               statusCode
  //               message
  //             }
  //           }
  //         }
  //       `,
  //       variables: { id: '5f46a8ac90e86913ed0a95d8' },
  //     })
  //     .catch(err => err);
  //
  //   const error = res;
  //   expect(error.errors[0].message).toEqual('ORDER_NOT_FOUND');
  // });

  // test('Should delete order', async () => {
  //   const deleteOrder = await operations.mutate({
  //     mutation: gql`
  //       mutation($id: ID!) {
  //         deleteOrder(id: $id) {
  //           ... on Order {
  //             _id
  //             user {
  //               email
  //               lastName
  //               firstName
  //               phoneNumber
  //               patronymicName
  //             }
  //             dateOfCreation
  //             delivery {
  //               sentOn
  //               sentBy
  //               byCourier
  //               invoiceNumber
  //               courierOffice
  //             }
  //             isPaid
  //             status
  //             address {
  //               appartment
  //               buildingNumber
  //               region
  //               street
  //               city
  //               country
  //               zipcode
  //             }
  //             userComment
  //             lastUpdatedDate
  //             cancellationReason
  //             adminComment
  //             items {
  //               bottomColor {
  //                 lang
  //                 value
  //               }
  //               closure {
  //                 lang
  //                 value
  //               }
  //               model {
  //                 lang
  //                 value
  //               }
  //               closureColor
  //               size {
  //                 widthInCm
  //                 weightInKg
  //                 heightInCm
  //                 volumeInLiters
  //                 depthInCm
  //               }
  //               additions {
  //                 lang
  //                 value
  //               }
  //               actualPrice {
  //                 currency
  //                 value
  //               }
  //               name {
  //                 lang
  //                 value
  //               }
  //               pattern {
  //                 lang
  //                 value
  //               }
  //               category {
  //                 lang
  //                 value
  //               }
  //               quantity
  //               colors {
  //                 lang
  //                 value
  //               }
  //               subcategory {
  //                 lang
  //                 value
  //               }
  //               bottomMaterial {
  //                 lang
  //                 value
  //               }
  //             }
  //             totalItemsPrice {
  //               currency
  //               value
  //             }
  //             totalPriceToPay {
  //               currency
  //               value
  //             }
  //             paymentMethod
  //           }
  //           ... on Error {
  //             statusCode
  //             message
  //           }
  //         }
  //       }
  //     `,
  //     variables: { id: orderId },
  //   });
  //
  //   const orderDelete = deleteOrder.data.deleteOrder;
  //
  //   expect(orderDelete).toBeDefined();
  //   expect(orderDelete).toHaveProperty('status', newOrderUpdated.status);
  //   expect(orderDelete).toHaveProperty('user', newOrderUpdated.user);
  //   expect(orderDelete).toHaveProperty('address', newOrderUpdated.address);
  //   expect(orderDelete).toHaveProperty('delivery', {
  //     byCourier: newOrderUpdated.delivery.byCourier,
  //     invoiceNumber: newOrderUpdated.delivery.invoiceNumber,
  //     courierOffice: newOrderUpdated.delivery.courierOffice,
  //     sentBy: newOrderUpdated.delivery.sentBy,
  //     sentOn: null,
  //   });
  //   expect(orderDelete).toHaveProperty('items', newOrderUpdated.items);
  //   expect(orderDelete).toHaveProperty(
  //     'paymentMethod',
  //     newOrderUpdated.paymentMethod,
  //   );
  //   expect(orderDelete).toHaveProperty('totalItemsPrice');
  //   expect(orderDelete).toHaveProperty('totalPriceToPay');
  // });
  afterAll(async () => {
    await deleteOrder(orderId, operations);
    await deleteProduct(productId, operations);
    await deleteModel(modelId, operations);
    await deleteConstructorBasic(constructorBasicId, operations);
    await deleteCategory(categoryId, categoryId, operations);
    await deleteMaterial(materialId, operations);
    await deleteColor(colorId, operations);
    await deleteSize(sizeId, operations);
    await deleteClosure(closureId, operations);
    await deletePattern(patternId, operations);
    await deleteCategory(categoryId, categoryId, operations);
  });
});

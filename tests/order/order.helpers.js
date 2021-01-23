const { gql } = require('@apollo/client');

const createColor = async (color, operations) => {
  const createdColor = await operations.mutate({
    mutation: gql`
      mutation($color: ColorInput!) {
        addColor(data: $color) {
          ... on Color {
            _id
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: { color },
  });

  return createdColor.data.addColor._id;
};
const createMaterial = async (material, operations) => {
  const createdMaterial = await operations.mutate({
    mutation: gql`
      mutation($material: MaterialInput!) {
        addMaterial(material: $material) {
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

  return createdMaterial.data.addMaterial._id;
};
const createCategory = async (category, operations) => {
  const createdCategory = await operations.mutate({
    mutation: gql`
      mutation($category: CategoryInput!, $upload: Upload) {
        addCategory(category: $category, upload: $upload) {
          ... on Category {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      category,
      upload: [],
    },
  });

  return createdCategory.data.addCategory._id;
};
const createModel = async (model, operations) => {
  const createdModel = await operations.mutate({
    mutation: gql`
      mutation($model: ModelInput!, $upload: Upload) {
        addModel(model: $model, upload: $upload) {
          ... on Model {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      model,
      upload: ['__tests__/model/img.png'],
    },
  });

  return createdModel.data.addModel._id;
};
const createProduct = async (product, operations) => {
  const createdProduct = await operations.mutate({
    mutation: gql`
      mutation($product: ProductInput!, $upload: Upload!) {
        addProduct(product: $product, upload: $upload) {
          ... on Product {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      product,
      upload: ['__tests__/model/img.png'],
    },
  });

  return createdProduct.data.addProduct._id;
};
const createSize = async (size, operations) => {
  const createdSize = await operations.mutate({
    mutation: gql`
      mutation($size: SizeInput!) {
        addSize(data: $size) {
          ... on Size {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      size,
    },
  });

  return createdSize.data.addSize._id;
};
const createOrder = async (order, operations) => {
  const createdOrder = await operations.mutate({
    mutation: gql`
      mutation($order: OrderInput!) {
        addOrder(order: $order) {
          ... on Order {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      order,
    },
  });

  return createdOrder.data.addOrder._id;
};
const createConstructorBasic = async (constructorElement, operations) => {
  const createdConstructorBasic = await operations.mutate({
    mutation: gql`
      mutation($constructorElement: ConstructorBasicInput!) {
        addConstructorBasic(constructorElement: $constructorElement) {
          ... on ConstructorBasic {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      constructorElement,
    },
  });

  return createdConstructorBasic.data.addConstructorBasic._id;
};
const createConstructorBottom = async (constructorElement, operations) => {
  const createdConstructorBottom = await operations.mutate({
    mutation: gql`
      mutation($constructorElement: ConstructorBottomInput!) {
        addConstructorBottom(constructorElement: $constructorElement) {
          ... on ConstructorBottom {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      constructorElement,
    },
  });

  return createdConstructorBottom.data.addConstructorBottom._id;
};

const deleteOrder = async (id, operations) => {
  await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteOrder(id: $id) {
          ... on Order {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      id,
    },
  });
};
const deleteSize = async (id, operations) => {
  await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteSize(id: $id) {
          ... on Size {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      id,
    },
  });
};
const deleteProduct = async (id, operations) => {
  await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteProduct(id: $id) {
          ... on Product {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      id,
    },
  });
};
const deleteModel = async (id, operations) => {
  await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteModel(id: $id) {
          ... on Model {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      id,
    },
  });
};
const deleteCategory = async (id, switchId, operations) => {
  await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $switchId: ID!) {
        deleteCategory(id: $id, switchId: $switchId) {
          ... on Category {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      id,
      switchId,
    },
  });
};
const deleteMaterial = async (id, operations) => {
  await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteMaterial(id: $id) {
          ... on Material {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      id,
    },
  });
};
const deleteColor = async (id, operations) => {
  await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteColor(id: $id) {
          ... on Color {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      id,
    },
  });
};

const getAllOrders = async operations => {
  const res = await operations.query({
    query: gql`
      query {
        getAllOrders {
          items {
            status
            user {
              firstName
              lastName
              patronymicName
              email
            }
            userComment
            items {
              product {
                _id
              }
              model {
                _id
              }
              quantity
              options {
                size {
                  _id
                }
              }
              fixedPrice {
                currency
                value
              }
            }
            delivery {
              invoiceNumber
              byCourier
              courierOffice
              cost {
                currency
                value
              }
            }

            paymentStatus
          }
          count
        }
      }
    `,
  });
  return res.data.getAllOrders.items;
};

module.exports = {
  createColor,
  createMaterial,
  createCategory,
  createModel,
  createProduct,
  createSize,
  createOrder,
  deleteOrder,
  deleteSize,
  deleteProduct,
  deleteModel,
  deleteCategory,
  deleteMaterial,
  deleteColor,
  getAllOrders,
};

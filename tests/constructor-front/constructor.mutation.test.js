const { gql } = require('@apollo/client');
const {
  FRONT_POCKET_NOT_FOUND,
} = require('../../error-messages/constructor-front-pocket-messages');
const addConstructorData = require('./constructor.variables');
const { setupApp } = require('../helper-functions');
const { it } = require('date-fns/locale');
jest.mock('../../modules/upload/upload.service');

let operations;
let constructorId = '';

describe('Front pocket mutation test:', () => {
  beforeAll(async done => {
    operations = await setupApp();
    done();
  });

  beforeAll(async done => {
    operations = await setupApp();
    const itemsId = await createModel(newMaterial, newCategory, newModel);
    categoryId = itemsId.categoryId;
    modelId = itemsId.modelId;
    materialId = itemsId.materialId;

    product = getNewProduct(categoryId, modelId, materialId);
    const createProduct = await operations.mutate({
      mutation: gql`
        mutation($product: ProductInput!) {
          addProduct(upload: [], product: $product) {
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
      },
    });
    productId = createProduct.data.addProduct._id;
    const res = await operations
      .query({
        variables: { id: productId },
        query: gql`
          query($id: ID!) {
            getProductById(id: $id) {
              ... on Product {
                rate
                userRates {
                  rate
                }
                rateCount
              }
              ... on Error {
                message
              }
            }
          }
        `,
      })
      .catch(e => e);
    const receivedProduct = res.data.getProductById;
    productRate = receivedProduct.rate;
    productRateCount = receivedProduct.rateCount;
    productUserRates = receivedProduct.userRates;
    done();
  });
  it('should connect to database', async done => {
    const res = await operations.mutate({
      mutation: gql`
        mutation($constructorElement: ConstructorFrontPocketInput!) {
          addConstructorFrontPocket(constructorElement: $constructorElement) {
            ... on ConstructorFrontPocket {
              _id
              available
              default
              basePrice {
                value
              }
              name {
                value
              }
              image
              material {
                name {
                  value
                }
              }
              color {
                colorHex
                _id
              }
            }
            ... on Error {
              message
              statusCode
            }
          }
        }
      `,
      variables: { addConstructorData },
    });

    constructorName = res.data.addConstructorFrontPocket.name;

    expect(constructorName).toBeDefined();
    // expect(addConstructorFrontPocket).toHaveProperty(
    //     'basePrice',
    //     {value: addConstructorData.basePrice[0]},
    //     {value: addConstructorData.basePrice[1]}
    // );
    // expect(addConstructorFrontPocket.basePrice).toBeInstanceOf(Array);
    // expect(addConstructorFrontPocket).toHaveProperty(
    //     'name',
    //     {value: addConstructorData.name[0]},
    //     {value: addConstructorData.name[1]}
    // );
    // expect(addConstructorFrontPocket.name).toBeInstanceOf(Array);
    // expect(addConstructorFrontPocket).toHaveProperty(
    //     'material',
    //     {name: addConstructorData.material.name}
    // );
    // expect(addConstructorFrontPocket.material).toBeInstanceOf(Object);
  });
});

// const createColorData = await options.mutate({
//     mutation:gql`
//     mutation($data: ColorInput!) {
//        addColor(data: $data) {
//          ... on Color {
//            name [ {
//              lang
//              value
//            } ]
//            colorHex
//            simpleName [{
//              lang
//              value
//            }]
//          }
//        }
//      }
//     `,
//     variables: { data }
//  });

//  const createMaterialData = await options.mutate({
//     mutation:gql`
//     mutation($material: MaterialInput!) {
//        addMaterial(material: $material) {
//          ... on Material {
//            name[ {
//              lang
//              value
//            }]
//            colors
//          }
//        }
//      }
//     `,
//     variables: { data }
//  });

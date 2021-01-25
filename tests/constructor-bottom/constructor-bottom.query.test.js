const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');

const {
  color,
  newMaterial,
  createMaterial,
  createColor,
  newConstructorBottom,
  deleteAll,
  createConstructorBottomQuery,
} = require('./constructor-bottom.variables');

let operations;
let colorId;
let materialInput;
let materialId;
let addConstructor;
let newConstructorForQuery;

describe('Constructor query', () => {
  beforeAll(async () => {
    operations = await setupApp();
    colorId = await createColor(color);
    materialInput = newMaterial(colorId);
    materialId = await createMaterial(materialInput);
    addConstructor = newConstructorBottom(colorId, materialId);
    newConstructorForQuery = await createConstructorBottomQuery(addConstructor);
  });
  afterAll(async () => {
    await deleteAll(colorId, materialId, newConstructorForQuery);
  });
  test('should return all constructor-bottom', async () => {
    const allConstructorBottom = await operations.query({
      query: gql`
        query($limit: Int, $skip: Int) {
          getAllConstructorBottoms(limit: $limit, skip: $skip) {
            items {
              _id
              name {
                lang
                value
              }
              material {
                _id
                name {
                  lang
                  value
                }
                purpose
                available
              }
              color {
                _id
                colorHex
              }
              image
            }
          }
        }
      `,
    });

    const allProducts =
      allConstructorBottom.data.getAllConstructorBottoms.items;
    expect(allProducts).toBeDefined();
    expect(allProducts.length).toBeGreaterThan(0);
  });
});

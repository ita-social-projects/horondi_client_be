/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');

require('dotenv').config();

let productId;

describe('Product mutations', () => {
  beforeAll(async () => {
    const createProduct = await client.mutate({
      mutation: gql`
        mutation {
          addProduct(
            product: {
              category: "ddc81f5dbac48c38d0403dd3"
              subcategory: "688ded7be0c2621f2fb17b05"
              name: [
                { lang: "en", value: "Very Coool Baggy" }
                { lang: "ua", value: "ДУЖЕ СУПЕРСЬКИЙ Рюкзачечок" }
              ]
              description: [
                { lang: "en", value: "Baggy is so cool" }
                { lang: "ua", value: "Рюкзачечок - супер кльовий))" }
              ]
              mainMaterial: [
                {
                  lang: "uk"
                  value: "Canvas-400G прошита додатковим шаром спеціального матеріалу"
                }
                {
                  lang: "en"
                  value: "Canvas-400G padded with a layer of durable and water-resistant material"
                }
              ]
              innerMaterial: [
                { lang: "uk", value: "Oxford 135" }
                { lang: "en", value: "Oxford 135" }
              ]
              pattern: [
                { lang: "uk", value: "Вишивка" }
                { lang: "en", value: "Embroidery" }
              ]
              patternImages: {
                large: "large-embroidery.jpg"
                medium: "medium-embroidery.jpg"
                small: "small-embroidery.jpg"
                thumbnail: "thumbnail-embroidery.jpg"
              }
              strapLengthInCm: 100
              closure: [
                { lang: "uk", value: "Фастекс (пластикова защіпка)" }
                { lang: "en", value: "Plastic closure" }
              ]
              closureColor: "black"
              basePrice: 1550
              available: true
              isHotItem: false
              images: {
                primary: {
                  large: "large-primary_15.jpg"
                  medium: "medium-primary_15.jpg"
                  small: "small-primary_15.jpg"
                  thumbnail: "thumbnail-primary_15.jpg"
                }
                additional: [
                  {
                    large: "large-additional_15_1.jpg"
                    medium: "medium-additional_15_1.jpg"
                    small: "small-additional_15_1.jpg"
                    thumbnail: "thumbnail-additional_15_1.jpg"
                  }
                  {
                    large: "large-additional_15_2.jpg"
                    medium: "medium-additional_15_2.jpg"
                    small: "small-additional_15_2.jpg"
                    thumbnail: "thumbnail-additional_15_2.jpg"
                  }
                  {
                    large: "large-additional_15_3.jpg"
                    medium: "medium-additional_15_3.jpg"
                    small: "small-additional_15_3.jpg"
                    thumbnail: "thumbnail-additional_15_3.jpg"
                  }
                ]
              }
              colors: [
                {
                  code: 206
                  name: [
                    { lang: "uk", value: "Золотий" }
                    { lang: "en", value: "Golden" }
                  ]
                  images: {
                    large: "large-golden.jpg"
                    medium: "medium-golden.jpg"
                    small: "small-golden.jpg"
                    thumbnail: "thumbnail-golden.jpg"
                  }
                  available: true
                  simpleName: [
                    { lang: "uk", value: "жовтий" }
                    { lang: "en", value: "yellow" }
                  ]
                }
              ]
              options: [
                {
                  size: "50288e8716e80d9569f64e2e"
                  bottomMaterial: "dadba32060da96e40847166d"
                  description: [
                    { lang: "ua", value: "Тканина Кордура" }
                    { lang: "en", value: "Cordura fabric" }
                  ]
                  availableCount: 777
                  additions: [
                    {
                      available: true
                      name: [
                        { lang: "uk", value: "Кишеня" }
                        { lang: "en", value: "Pocket" }
                      ]
                      description: [
                        { lang: "uk", value: "Бокова кишенька за бажанням" }
                        { lang: "en", value: "Side pocket by request" }
                      ]
                      additionalPrice: 10000000
                    }
                  ]
                }
              ]
            }
          ) {
            ... on Product {
              _id
            }
          }
        }
      `,
    });
    productId = createProduct.data.addProduct._id;
  });

  afterAll(async () => {
    await client.mutate({
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
  });
});

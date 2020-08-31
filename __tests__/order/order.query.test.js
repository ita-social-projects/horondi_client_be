/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
const { newOrder } = require('./order.variables');

let orderId;

describe('Order queries', () => {
  beforeAll(async () => {
    const createOrder = await client.mutate({
      mutation: gql`
        mutation($order: OrderInput!) {
          addOrder(order: $order) {
            ... on Order {
              _id
            }
          }
        }
      `,
      variables: { order: newOrder },
    });
    orderId = createOrder.data.addOrder._id;
  });
  
  test('Should receive all orders', async () => {
    const res = await client.query({
      query: gql`
        query {
          getAllOrders {
            _id
            status
            totalPrice {
              currency
              value
            }
            user {
              address {
                appartment
                city
                region
                street
                country
                buildingNumber
                zipcode
              }
              email
              lastName
              firstName
              phoneNumber
            }
            items {
              bottomColor {
                lang
                value
              }
              closure {
                lang
                value
              }
              model {
                lang
                value
              }
              closureColor 
              size{
                widthInCm
                weightInKg
                heightInCm
                volumeInLiters
                depthInCm
              }
              additions {
                lang
                value
              }
              actualPrice {
                currency
                value
              }
              name {
                lang
                value
              }
              pattern {
                lang
                value
              }
              category {
                lang
                value
              }
              quantity
              colors {
                lang
                value
              }
              subcategory {
                lang
                value
              }
              bottomMaterial {
                lang
                value
              }
            }
            delivery {
              sentBy
              invoiceNumber
            }
            paymentMethod
          }
        }`
    })

    const orders = res.data.getAllOrders;

    expect(orders).toBeDefined();
    expect(orders.length).toBeGreaterThan(0);
    expect(orders).toBeInstanceOf(Array);
    expect(orders.find(order => order._id === orderId)).toMatchObject({
      status:"pending",
      user:{
        __typename: "OrderUser",
        firstName:"Test",
        lastName:"Test",
        email: "test@gmail.com",
        phoneNumber:"380953544271",
        address: {
          __typename: "Address",
          country:"Україна",
          region:"Кіровоградська область",
          city:"Новомиргород",
          zipcode:98908,
          street:"Бульвар Марії Приймаченко",
          buildingNumber:"25",
          appartment:"97"
        }
      },
      delivery:{
        __typename: "Delivery",
        sentBy:"Nova Poshta",
        invoiceNumber:"6280260"
      },
      items:[
        {
          __typename: "OrderItems",
          category:[
            {
              __typename: "Language",
              lang:"uk",
              value:"Сумки"
            },
            {
              __typename: "Language",
              lang:"en",
              value:"Bags"
            }
          ],
          subcategory:[
            {
              __typename: "Language",
              lang:"uk",
              value:"Сумки"
            },
            {
              __typename: "Language",
              lang:"en",
              value:"Bags"
            }
          ],
          model:
          [
            {
              __typename: "Language",
              lang:"uk",
              value:"Сумка з гобеленом"
            },
            {
              __typename: "Language",
              lang:"en",
              value:"Bag with a Pattern"
            }
          ],
          name:[
            {
              __typename: "Language",
              lang:"uk",
              value:"Сумка з гобеленом синя"
            },
            {
              __typename: "Language",
              lang:"en",
              value:"Bag with a Pattern Blue"
            }
          ],
          colors:[
            [
              {
                __typename: "Language",
                lang:"uk",
                value:"Сталево-блакитний"
              },
              {
                __typename: "Language",
                lang:"en",
                value:"Steel-blue"
              }
            ]
          ],
          pattern:[
            {
              __typename: "Language",
              lang:"uk",
              value:"Олені"
            },
            {
              __typename: "Language",
              lang:"en",
              value:"Deers"
            }
          ],
          closure:[],
          closureColor:"",
          size:{
            __typename: "Size",
            heightInCm:38,
            widthInCm:36,
            depthInCm:10,
            volumeInLiters:0,
            weightInKg:0
          },
          bottomMaterial:[
            {
              __typename: "Language",
              lang:"uk",
              value:"Тканина Кордура"
            },
            {
              __typename: "Language",
              lang:"en",
              value:"Cordura fabric"
            }
          ],
          bottomColor:[
            {
              __typename: "Language",
              lang:"uk",
              value:"чорний"
            },
            {
              __typename: "Language",
              lang:"en",
              value:"black"
            }
          ],
          additions:[],
          actualPrice:[
            {
              __typename: "CurrencySet",
              currency:"UAH",
              value:90000
            },
            {
              __typename: "CurrencySet",
              currency:"USD",
              value:3246
            }
          ],
          quantity:1
        }],
        paymentMethod:"card",
        totalPrice:[
          {
            __typename: "CurrencySet",
            currency:"UAH",
            value:90000
          },
          {
            __typename: "CurrencySet",
            currency:"USD",
            value:3246
          }
        ]
      });
  });

  test('should recive order by id', async () => {
    const res = await client.query({
      query: gql`
        query($id: ID!) {
          getOrderById(id: $id) {
            ...on Order {
              status
              totalPrice {
                currency
                value
              }
              user {
                address {
                  appartment
                  city
                  region
                  street
                  country
                  buildingNumber
                  zipcode
                }
                email
                lastName
                firstName
                phoneNumber
              }
              items {
                bottomColor {
                  lang
                  value
                }
                closure {
                  lang
                  value
                }
                model {
                  lang
                  value
                }
                closureColor 
                size{
                  widthInCm
                  weightInKg
                  heightInCm
                  volumeInLiters
                  depthInCm
                }
                additions {
                  lang
                  value
                }
                actualPrice {
                  currency
                  value
                }
                name {
                  lang
                  value
                }
                pattern {
                  lang
                  value
                }
                category {
                  lang
                  value
                }
                quantity
                colors {
                  lang
                  value
                }
                subcategory {
                  lang
                  value
                }
                bottomMaterial {
                  lang
                  value
                }
              }
              delivery {
                sentBy
                invoiceNumber
              }
              paymentMethod
            }
            ...on Error {
              statusCode
              message
            }
          }
        }`,
      variables: {
        id: orderId,
      },
    });

    const order = res.data.getOrderById

    expect(order).toMatchSnapshot()
    expect(order).toMatchObject({
      status:"pending",
      user:{
        __typename: "OrderUser",
        firstName:"Test",
        lastName:"Test",
        email: "test@gmail.com",
        phoneNumber:"380953544271",
        address: {
          __typename: "Address",
          country:"Україна",
          region:"Кіровоградська область",
          city:"Новомиргород",
          zipcode:98908,
          street:"Бульвар Марії Приймаченко",
          buildingNumber:"25",
          appartment:"97"
        }
      },
      delivery:{
        __typename: "Delivery",
        sentBy:"Nova Poshta",
        invoiceNumber:"6280260"
      },
      items:[
        {
          __typename: "OrderItems",
          category:[
            {
              __typename: "Language",
              lang:"uk",
              value:"Сумки"
            },
            {
              __typename: "Language",
              lang:"en",
              value:"Bags"
            }
          ],
          subcategory:[
            {
              __typename: "Language",
              lang:"uk",
              value:"Сумки"
            },
            {
              __typename: "Language",
              lang:"en",
              value:"Bags"
            }
          ],
          model:
          [
            {
              __typename: "Language",
              lang:"uk",
              value:"Сумка з гобеленом"
            },
            {
              __typename: "Language",
              lang:"en",
              value:"Bag with a Pattern"
            }
          ],
          name:[
            {
              __typename: "Language",
              lang:"uk",
              value:"Сумка з гобеленом синя"
            },
            {
              __typename: "Language",
              lang:"en",
              value:"Bag with a Pattern Blue"
            }
          ],
          colors:[
            [
              {
                __typename: "Language",
                lang:"uk",
                value:"Сталево-блакитний"
              },
              {
                __typename: "Language",
                lang:"en",
                value:"Steel-blue"
              }
            ]
          ],
          pattern:[
            {
              __typename: "Language",
              lang:"uk",
              value:"Олені"
            },
            {
              __typename: "Language",
              lang:"en",
              value:"Deers"
            }
          ],
          closure:[],
          closureColor:"",
          size:{
            __typename: "Size",
            heightInCm:38,
            widthInCm:36,
            depthInCm:10,
            volumeInLiters:0,
            weightInKg:0
          },
          bottomMaterial:[
            {
              __typename: "Language",
              lang:"uk",
              value:"Тканина Кордура"
            },
            {
              __typename: "Language",
              lang:"en",
              value:"Cordura fabric"
            }
          ],
          bottomColor:[
            {
              __typename: "Language",
              lang:"uk",
              value:"чорний"
            },
            {
              __typename: "Language",
              lang:"en",
              value:"black"
            }
          ],
          additions:[],
          actualPrice:[
            {
              __typename: "CurrencySet",
              currency:"UAH",
              value:90000
            },
            {
              __typename: "CurrencySet",
              currency:"USD",
              value:3246
            }
          ],
          quantity:1
        }],
        paymentMethod:"card",
        totalPrice:[
          {
            __typename: "CurrencySet",
            currency:"UAH",
            value:90000
          },
          {
            __typename: "CurrencySet",
            currency:"USD",
            value:3246
          }
        ]
      });
  });

  test('Should throw error ORDER_NOT_FOUND', async () => {
    const res = await client.query({
      query: gql`
        query($id: ID!) {
          getOrderById(id: $id) {
            ...on Order {
              status
              totalPrice {
                currency
                value
              }
              user {
                address {
                  appartment
                  city
                  region
                  street
                  country
                  buildingNumber
                  zipcode
                }
                email
                lastName
                firstName
                phoneNumber
              }
              items {
                bottomColor {
                  lang
                  value
                }
                closure {
                  lang
                  value
                }
                model {
                  lang
                  value
                }
                closureColor 
                size{
                  widthInCm
                  weightInKg
                  heightInCm
                  volumeInLiters
                  depthInCm
                }
                additions {
                  lang
                  value
                }
                actualPrice {
                  currency
                  value
                }
                name {
                  lang
                  value
                }
                pattern {
                  lang
                  value
                }
                category {
                  lang
                  value
                }
                quantity
                colors {
                  lang
                  value
                }
                subcategory {
                  lang
                  value
                }
                bottomMaterial {
                  lang
                  value
                }
              }
              delivery {
                sentBy
                invoiceNumber
              }
              paymentMethod
            }
            ...on Error {
              statusCode
              message
            }
          }
        }`,
      variables: {
        id: "5f46a8ac90e86913ed0a95d8",
      },
    }).catch(err => err)

    const error = res;

    expect(error.graphQLErrors[0].message).toBe("ORDER_NOT_FOUND");
  });

  afterAll(async () => {
    await client.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteOrder(id: $id) {
            ... on Order {
              _id
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: { id: orderId },
    });
  });
});

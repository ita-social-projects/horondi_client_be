const { gql } = require('@apollo/client');

const createOrder = async (order, operations) => {
  const createdOrder = await operations.mutate({
    mutation: gql`
      mutation($order: OrderInput!) {
        addOrder(order: $order) {
          ... on Order {
            _id
            totalItemsPrice {
              currency
              value
            }
            totalPriceToPay {
              currency
            }
            status
            paymentStatus
            recipient {
              firstName
              lastName
              email
              phoneNumber
            }
            user_id {
              _id
            }
            userComment
            delivery {
              byCourier
              sentBy
              invoiceNumber
              courierOffice

              cost {
                currency
                value
              }
            }
            items {
              product {
                _id
                category {
                  _id
                  name {
                    lang
                    value
                  }
                }
                model {
                  category {
                    name {
                      lang
                      value
                    }
                    available
                  }
                  description {
                    lang
                    value
                  }
                }
              }

              quantity
              fixedPrice {
                currency
                value
              }
            }
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

  return createdOrder.data.addOrder;
};
const deleteOrder = async (id, operations) =>
  operations.mutate({
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
const getAllOrders = async operations => {
  const res = await operations.mutate({
    mutation: gql`
      query {
        getAllOrders(limit: 10, skip: 0, filter: {}, sort: {}) {
          items {
            _id
            recipient {
              firstName
              lastName
              email
              phoneNumber
            }
            status
            paymentStatus
            orderNumber
            dateOfCreation
            totalItemsPrice {
              currency
              value
            }
            totalPriceToPay {
              currency
              value
            }
          }
          count
        }
      }
    `,
  });
  return res.data.getAllOrders.items;
};

const getOrdersByUser = async (filter, sort, userId, operations) => {
  const res = await operations.mutate({
    query: gql`
      query(
        $limit: Int
        $skip: Int
        $filter: OrderFilterInput
        $sort: JSONObject
        $userId: ID!
      ) {
        getOrdersByUser(
          limit: $limit
          skip: $skip
          filter: $filter
          sort: $sort
          userId: $userId
        ) {
          items {
            _id
            recipient {
              firstName
              lastName
              email
              phoneNumber
            }
            status
            paymentStatus
            orderNumber
            dateOfCreation
            totalItemsPrice {
              currency
              value
            }
          }
          count
        }
      }
    `,
    variables: {
      limit: 5,
      skip: 0,
      filter,
      sort,
      userId,
    },
  });
  return res.data.getOrdersByUser.items;
};

const getOrderById = async (id, operations) =>
  operations.query({
    query: gql`
      query($id: ID!) {
        getOrderById(id: $id) {
          ... on Order {
            status
            paymentStatus
            userComment
            delivery {
              byCourier
              sentBy
              invoiceNumber
              courierOffice
              cost {
                currency
                value
              }
            }
            items {
              product {
                _id
                category {
                  _id
                  name {
                    lang
                    value
                  }
                }
                model {
                  category {
                    name {
                      lang
                      value
                    }
                    available
                  }
                  description {
                    lang
                    value
                  }
                }
              }

              quantity
              fixedPrice {
                currency
                value
              }
            }
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
const updateOrderById = async (order, id, operations) => {
  const updatedData = await operations.mutate({
    mutation: gql`
      mutation($order: OrderInput!, $id: ID!) {
        updateOrder(order: $order, id: $id) {
          ... on Order {
            _id
            totalItemsPrice {
              currency
              value
            }
            totalPriceToPay {
              currency
            }
            status
            paymentStatus
            recipient {
              firstName
              lastName
              email
              phoneNumber
            }
            userComment
            delivery {
              byCourier
              sentBy
              invoiceNumber
              courierOffice
              cost {
                currency
                value
              }
            }
            items {
              product {
                _id
                category {
                  _id
                  name {
                    lang
                    value
                  }
                }
                model {
                  category {
                    name {
                      lang
                      value
                    }
                    available
                  }
                  description {
                    lang
                    value
                  }
                }
              }

              quantity
              fixedPrice {
                currency
                value
              }
            }
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: { order, id },
  });
  return updatedData.data.updateOrder;
};

module.exports = {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrdersByUser,
  getOrderById,
  updateOrderById,
};

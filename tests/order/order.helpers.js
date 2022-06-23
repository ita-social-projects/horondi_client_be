const { gql } = require('@apollo/client');

const createOrder = async (order, operations) => {
  const createdOrder = await operations.mutate({
    mutation: gql`
      mutation ($order: OrderInput!) {
        addOrder(order: $order) {
          ... on Order {
            _id
            orderNumber
            totalItemsPrice
            totalPriceToPay
            status
            paymentStatus
            recipient {
              firstName
              lastName
              email
              phoneNumber
            }
            user_id
            userComment
            delivery {
              byCourier
              sentBy
              invoiceNumber
              courierOffice
              cost
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
              fixedPrice
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
      mutation ($id: ID!) {
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

const getPaidOrdersStatistic = async operations => {
  const res = await operations.mutate({
    query: gql`
      query ($date: Int!) {
        getPaidOrdersStatistic(date: $date) {
          labels
          counts
          total
        }
      }
    `,
    variables: {
      date: 0,
    },
  });

  return res.data.getPaidOrdersStatistic;
};

const getUserOrders = async operations => {
  const res = await operations.mutate({
    query: gql`
      query ($pagination: Pagination) {
        getUserOrders(pagination: $pagination) {
          userOrders {
            _id
            recipient {
              firstName
              lastName
              email
              phoneNumber
            }
            status
            user_id
            paymentStatus
            orderNumber
            dateOfCreation
          }
          ordersCount
        }
      }
    `,
    variables: {
      pagination: {
        skip: 0,
        limit: 1,
      },
    },
  });

  return res.data.getUserOrders;
};

const getOrdersStatistic = async operations => {
  const res = await operations.mutate({
    query: gql`
      query ($date: Int!) {
        getOrdersStatistic(date: $date) {
          names
          counts
          relations
        }
      }
    `,
    variables: {
      date: 0,
    },
  });

  return res.data.getOrdersStatistic;
};

const getAllOrders = async (filter, sort, operations) => {
  const res = await operations.mutate({
    query: gql`
      query (
        $limit: Int
        $skip: Int
        $filter: OrderFilterInput
        $sort: JSONObject
      ) {
        getAllOrders(limit: $limit, skip: $skip, filter: $filter, sort: $sort) {
          items {
            _id
            recipient {
              firstName
              lastName
              email
              phoneNumber
            }
            status
            user_id
            paymentStatus
            orderNumber
            dateOfCreation
            totalItemsPrice
            totalPriceToPay
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
    },
  });

  return res.data.getAllOrders.items;
};

const getOrdersByUser = async (filter, sort, userId, operations) => {
  const res = await operations.mutate({
    query: gql`
      query (
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
            user_id
            paymentStatus
            orderNumber
            dateOfCreation
            totalItemsPrice
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
      query ($id: ID!) {
        getOrderById(id: $id) {
          ... on Order {
            status
            paymentStatus
            userComment
            user_id
            delivery {
              byCourier
              sentBy
              invoiceNumber
              courierOffice
              cost
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
              fixedPrice
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
      mutation ($order: OrderInput!, $id: ID!) {
        updateOrder(order: $order, id: $id) {
          ... on Order {
            _id
            totalItemsPrice
            totalPriceToPay
            status
            user_id
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
              cost
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
              fixedPrice
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
  getPaidOrdersStatistic,
  getOrdersStatistic,
  getOrdersByUser,
  getOrderById,
  updateOrderById,
  getUserOrders,
};

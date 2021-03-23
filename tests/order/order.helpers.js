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
            user {
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
const deleteOrder = async (id, operations) => {
  return await operations.mutate({
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
              email
              phoneNumber
            }
            userComment
            items {
              model {
                _id
                category {
                  name {
                    value
                    lang
                  }
                }
              }
              quantity
              options {
                size {
                  name
                  heightInCm
                  widthInCm
                  depthInCm
                  weightInKg
                }
              }
              fixedPrice {
                currency
                value
              }
            }
            delivery {
              invoiceNumber
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
const getOrderById = async (id, operations) => {
  return await operations.query({
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
};
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
            user {
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
  getOrderById,
  updateOrderById,
};

const { gql } = require('@apollo/client');

const getNovaPoshtaCities = async (city, operations) => {
  const result = await operations.query({
    query: gql`
      query($city: String) {
        getNovaPoshtaCities(city: $city) {
          ... on NovaPoshtaCity {
            cityID
          }
        }
      }
    `,
    variables: {
      city,
    },
  });

  return result.data.getNovaPoshtaCities;
};
const getNovaPoshtaStreets = async (cityRef, street, operations) => {
  const result = await operations.query({
    query: gql`
      query($cityRef: String, $street: String) {
        getNovaPoshtaStreets(cityRef: $cityRef, street: $street) {
          ... on NovaPoshtaStreet {
            description
          }
        }
      }
    `,
    variables: {
      cityRef,
      street,
    },
  });

  return result.data.getNovaPoshtaStreets;
};
const getNovaPoshtaWarehouses = async (city, operations) => {
  const result = await operations.query({
    query: gql`
      query($city: String) {
        getNovaPoshtaWarehouses(city: $city) {
          ... on NovaPoshtaWarehouse {
            number
          }
        }
      }
    `,
    variables: {
      city,
    },
  });

  return result.data.getNovaPoshtaWarehouses;
};
const getNovaPoshtaPrices = async (NovaPoshtaPrice, operations) => {
  const result = await operations.query({
    query: gql`
      query($data: NovaPoshtaPriceInput) {
        getNovaPoshtaPrices(data: $data) {
          ... on NovaPoshtaPrice {
            cost
          }
        }
      }
    `,
    variables: {
      data: NovaPoshtaPrice,
    },
  });

  return result.data.getNovaPoshtaPrices;
};

module.exports = {
  getNovaPoshtaCities,
  getNovaPoshtaStreets,
  getNovaPoshtaWarehouses,
  getNovaPoshtaPrices,
};

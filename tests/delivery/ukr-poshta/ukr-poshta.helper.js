const { gql } = require('@apollo/client');

const getUkrPoshtaRegions = async operations => {
  const result = await operations.query({
    query: gql`
      query {
        getUkrPoshtaRegions {
          ... on UkrPoshtaRegion {
            REGION_ID
          }
        }
      }
    `,
  });
  return result.data.getUkrPoshtaRegions;
};
const getUkrPoshtaDistrictsByRegionId = async (id, operations) => {
  const result = await operations.query({
    query: gql`
      query($id: ID!) {
        getUkrPoshtaDistrictsByRegionId(id: $id) {
          ... on UkrPoshtaDistricts {
            DISTRICT_ID
          }
        }
      }
    `,
    variables: {
      id,
    },
  });
  return result.data.getUkrPoshtaDistrictsByRegionId;
};
const getUkrPoshtaCitiesByDistrictId = async (id, operations) => {
  const result = await operations.query({
    query: gql`
      query($id: ID!) {
        getUkrPoshtaCitiesByDistrictId(id: $id) {
          ... on UkrPoshtaCities {
            CITY_ID
          }
        }
      }
    `,
    variables: {
      id,
    },
  });
  return result.data.getUkrPoshtaCitiesByDistrictId;
};
const getUkrPoshtaPostofficesCityId = async (id, operations) => {
  const result = await operations.query({
    query: gql`
      query($id: ID!) {
        getUkrPoshtaPostofficesCityId(id: $id) {
          ... on UkrPoshtaPostoffices {
            POSTOFFICE_ID
          }
        }
      }
    `,
    variables: {
      id,
    },
  });
  return result.data.getUkrPoshtaPostofficesCityId;
};
const getUkrPoshtaStreetsByCityId = async (id, operations) => {
  const result = await operations.query({
    query: gql`
      query($id: ID!) {
        getUkrPoshtaStreetsByCityId(id: $id) {
          ... on UkrPoshtaStreets {
            STREET_ID
          }
        }
      }
    `,
    variables: {
      id,
    },
  });
  return result.data.getUkrPoshtaStreetsByCityId;
};

module.exports = {
  getUkrPoshtaCitiesByDistrictId,
  getUkrPoshtaDistrictsByRegionId,
  getUkrPoshtaPostofficesCityId,
  getUkrPoshtaRegions,
  getUkrPoshtaStreetsByCityId,
};

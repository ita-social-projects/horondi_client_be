const roles = {
  USER: 'user',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
};

const availableForRegistrationRoles = [roles.ADMIN];

const horondiAddress = {
  street: 'Литвиненка',
  city: 'Львів',
  buidingNumber: '8',
  flat: '1',
};

const defaultPaginationParams = {
  skip: 0,
  limit: 10,
};

const horondyCityRef = 'db5c88f5-391c-11dd-90d9-001a92567626';

const dayInMiliseconds = 86400000;
const monthInMilliseconds = 2592000000;

const userDateFormat = { month: 'short', day: 'numeric' };
const OTHERS = 'Інші';
const YEAR = 365;
const QUARTER = 90;
const MONTH = 30;
const WEEK = 7;
const THREE_DAYS = 3;
const TWO_WEEKS = 14;

const imageQualities = {
  large: 1920,
  medium: 1080,
  small: 768,
  thumbnail: 128,
};

const getUkrPoshtaRegionsUrl = 'get_regions_by_region_ua';
const getUkrPoshtaDistrictsByRegionIdUrl = `get_districts_by_region_id_and_district_ua?region_id=`;
const getUkrPoshtaCitiesByDistrictIdUrl = `get_city_by_region_id_and_district_id_and_city_ua?district_id=`;
const getUkrPoshtaPostofficesCityIdUrl = `get_postoffices_by_postcode_cityid_cityvpzid?city_id=`;

module.exports = {
  getUkrPoshtaRegionsUrl,
  getUkrPoshtaDistrictsByRegionIdUrl,
  getUkrPoshtaCitiesByDistrictIdUrl,
  getUkrPoshtaPostofficesCityIdUrl,
  roles,
  availableForRegistrationRoles,
  horondiAddress,
  horondyCityRef,
  monthInMilliseconds,
  dayInMiliseconds,
  userDateFormat,
  defaultPaginationParams,
  OTHERS,
  YEAR,
  QUARTER,
  MONTH,
  WEEK,
  THREE_DAYS,
  TWO_WEEKS,
  imageQualities,
};

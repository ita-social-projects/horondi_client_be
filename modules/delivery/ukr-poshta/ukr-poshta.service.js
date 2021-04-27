const axios = require('axios');
const RuleError = require('../../../errors/rule.error');

const {
  getUkrPoshtaRegionsUrl,
  getUkrPoshtaDistrictsByRegionIdUrl,
  getUkrPoshtaCitiesByDistrictIdUrl,
  getUkrPoshtaPostofficesCityIdUrl,
} = require('../../../consts');
const {
  UKR_POSHTA_API_LINK,
  UKR_POSHTA_API_KEY,
  UKR_POSHTA_STATUS_KEY,
  UKR_POSHTA_COUNTERPARTY_TOKEN,
  UKR_POSHTA_COUNTERPARTY_UUID,
  UKR_POSHTA_ADDRESS_API_LINK,
} = require('../../../dotenvValidator');
const {
  ORDER_CREATION_FAILED,
} = require('../../../error-messages/delivery.message');
const {
  URL_PARAMS: {
    CREATE_UKR_POSHTA_ORDER_PARAMS,
    CREATE_UKR_POSHTA_USER_PARAMS,
    ADDRESSES,
  },
} = require('../../../consts/delivery-services');
const {
  REQUEST_METHODS: { GET, POST },
} = require('../../../consts/request-methods');
const {
  STATUS_CODES: { BAD_REQUEST },
} = require('../../../consts/status-codes');

class UkrPoshtaService {
  async getUkrPoshtaRequest(urlParams, method, data) {
    return await axios({
      method,
      url: encodeURI(UKR_POSHTA_API_LINK + urlParams),
      data,
      headers: {
        Authorization: `Bearer ${UKR_POSHTA_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
  }
  async getUkrPoshtaAddressRequest(urlParams) {
    return await axios({
      method: GET,
      url: encodeURI(UKR_POSHTA_ADDRESS_API_LINK + urlParams),
      headers: {
        Authorization: `Bearer ${UKR_POSHTA_API_KEY}`,
      },
    });
  }
  async createUkrPoshtaAddress(address) {
    const createdAddress = await this.getUkrPoshtaRequest(
      ADDRESSES,
      'post',
      address
    );
    return createdAddress.data;
  }

  async getUkrPoshtaAddressById(id) {
    const address = await this.getUkrPoshtaRequest(`${ADDRESSES}/${id}`);
    return address.data;
  }

  async createUkrPoshtaClient(client) {
    const { address, firstName, lastName, phoneNumber, type } = client;
    const createdAddress = await this.createUkrPoshtaAddress(address);
    const createdClient = await this.getUkrPoshtaRequest(
      `${CREATE_UKR_POSHTA_USER_PARAMS}${UKR_POSHTA_COUNTERPARTY_TOKEN}`,
      POST,
      {
        firstName,
        lastName,
        phoneNumber,
        type,
        addressId: createdAddress.id,
      }
    );
    return createdClient.data;
  }

  async createUkrPoshtaOrder(client, order) {
    const createdClient = await this.createUkrPoshtaClient(client);
    const createdOrder = await this.getUkrPoshtaRequest(
      `${CREATE_UKR_POSHTA_ORDER_PARAMS}${UKR_POSHTA_COUNTERPARTY_TOKEN}`,
      POST,
      {
        ...order,
        sender: {
          uuid: UKR_POSHTA_COUNTERPARTY_UUID,
        },
        recipient: {
          uuid: createdClient.uuid,
        },
      }
    );
    if (!createdOrder) {
      throw new RuleError(ORDER_CREATION_FAILED, BAD_REQUEST);
    }
    return createdOrder.data;
  }

  async getUkrPoshtaRegions() {
    const res = await this.getUkrPoshtaAddressRequest(getUkrPoshtaRegionsUrl);
    return res.data.Entries.Entry;
  }
  async getUkrPoshtaDistrictsByRegionId(id) {
    const res = await this.getUkrPoshtaAddressRequest(
      `${getUkrPoshtaDistrictsByRegionIdUrl + id}`
    );
    return res.data.Entries.Entry;
  }
  async getUkrPoshtaCitiesByDistrictId(id) {
    const res = await this.getUkrPoshtaAddressRequest(
      `${getUkrPoshtaCitiesByDistrictIdUrl + id}`
    );
    return res.data.Entries.Entry;
  }
  async getUkrPoshtaPostofficesCityId(id) {
    const res = await this.getUkrPoshtaAddressRequest(
      `${getUkrPoshtaPostofficesCityIdUrl + id}`
    );
    return res.data.Entries.Entry;
  }
}

module.exports = new UkrPoshtaService();

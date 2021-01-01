const axios = require('axios');
const {
  UKR_POSHTA_API_LINK,
  UKR_POSHTA_API_KEY,
  UKR_POSHTA_STATUS_KEY,
  UKR_POSHTA_COUNTERPARTY_TOKEN,
  UKR_POSHTA_COUNTERPARTY_UUID,
} = require('../../../dotenvValidator');
const {
  ORDER_CREATION_FAILED,
} = require('../../../error-messages/delivery.message');

class UkrPoshtaService {
  async getUkrPoshtaRequest(urlParams, method, data) {
    return await axios({
      method,
      url: UKR_POSHTA_API_LINK + urlParams,
      data,
      headers: {
        Authorization: `Bearer ${UKR_POSHTA_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }).catch(e => console.log(e.response.data.message));
  }

  async createUkrPoshtaAddress(address) {
    console.log(address);
    const createdAddress = await this.getUkrPoshtaRequest(
      'addresses',
      'post',
      address
    );
    return createdAddress.data;
  }

  async getUkrPoshtaAddressById(id) {
    const address = await this.getUkrPoshtaRequest(`addresses/${id}`);
    return address.data;
  }

  async createUkrPoshtaClient(client) {
    const { address, firstName, lastName, phoneNumber, type } = client;
    const createdAddress = await this.createUkrPoshtaAddress(address);
    const createdClient = await this.getUkrPoshtaRequest(
      `clients?token=${UKR_POSHTA_COUNTERPARTY_TOKEN}`,
      'post',
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
      `shipments?token=${UKR_POSHTA_COUNTERPARTY_TOKEN}`,
      'post',
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
      throw Error(ORDER_CREATION_FAILED);
    }
    return createdOrder.data;
  }
}

module.exports = new UkrPoshtaService();

/* eslint-disable no-return-await */
const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');
const { KEY_VAULTS_URI } = require('../dotenvValidator');

const keyVaultsUri = KEY_VAULTS_URI;
const credential = new DefaultAzureCredential();
class ConfigService {
  async getSecret(key) {
    const client = new SecretClient(keyVaultsUri, credential);

    return process.env.NODE_ENV === 'production'
      ? await client.getSecret(key)
      : process.env[key];
  }
}
module.exports = new ConfigService();

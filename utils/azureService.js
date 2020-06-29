const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

// const keyVaultName = process.env.MONGO_URL;
const keyValtsUri = `https://horondi.vault.azure.net/secrets`;
const credential = new DefaultAzureCredential();
class AzureService {
  getSecret(key) {
    const client = new SecretClient(keyValtsUri, credential);

    return process.env.NODE_ENV === 'production'
      ? client.getSecret(key)
      : process.env[key];
  }
}
module.exports = new AzureService();

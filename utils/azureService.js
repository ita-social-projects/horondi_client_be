const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

// const keyVaultName = process.env.MONGO_URL;
const azureService = key => {
  const KVUri = `https://horondi.vault.azure.net/secrets`;
  const credential = new DefaultAzureCredential();
  const client = new SecretClient(KVUri, credential);

  return process.env.NODE_ENV === 'production'
    ? client.getSecret(key)
    : process.env[key];
};

module.exports = azureService;

const { createHash } = require('crypto');

const {
  HASH_FEATURES: { DIGEST, SHA_1 },
} = require('../consts/hash-features');

const generatePaymentSignature = (data) => createHash(SHA_1)
  .update(data)
  .digest(DIGEST);

module.exports = {
  generatePaymentSignature,
};

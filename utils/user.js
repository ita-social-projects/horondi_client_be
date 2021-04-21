const { default: ShortUniqueId } = require('short-unique-id');

function generateOtpCode() {
  const uid = new ShortUniqueId();

  return uid();
}

module.exports = { generateOtpCode };

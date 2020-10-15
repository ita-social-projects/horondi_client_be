const { mapToImages } = require('../../helpers/images');

const model = [];

const modelSize = 12;

for (let i = 0; i < modelSize; i++) {
  model.push({
    images: mapToImages(`looksImage${i + 1}.jpg`)
  })
}

module.exports = model;

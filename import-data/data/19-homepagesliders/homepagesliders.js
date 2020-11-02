const { mapToImages } = require('../../helpers/images');
const { mapToLanguages } = require('../../helpers/languages');

const model = [];

for (let i=0;i<3;i++) {
  model.push({
    title: mapToLanguages([`Slider image ${i+1}`, `Слайдер зображення ${i+1}`]),
    description: mapToLanguages([`Slider image ${i+1}`, `Слайдер зображення ${i+1}`]),
    images: mapToImages(`slider-image-${i + 1}.jpg`),
    link: `/bags`,
    order: i+1,
    show: true
  })
}

module.exports = model;

const {mapToLanguages} = require('../../helpers/languages');

const model = [];

model.push(
  {
    link: '/accessories',
    title: mapToLanguages(['Аксесуари','Accessories']),
    priority: 1
  },
);

model.push(
  {
    link: '/backpacks',
    title: mapToLanguages(['Рюкзаки','Backpacks']),
    priority: 2
  },
);

model.push(
  {
    link: '/bags',
    title: mapToLanguages(['Сумки','Bags']),
    priority: 3
  },
);

module.exports = model;

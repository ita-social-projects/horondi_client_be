const { mapToLanguages } = require('../../helpers/languages');
const { mapToColors } = require('../../helpers/colors');
//const { getObjectId, getObjectIds } = require('mongo-seeding');

const materials = [
  {
    name: mapToLanguages(['Мальмо', 'Malmo']),
    description: mapToLanguages(['Мальмо (100% поліестер) - для рюкзаків, сумок, бананок (всі моделі)',
        'Malmo (100% polyester) - for backpacks, bags, fanny-packs (all models)']),
    colors: mapToColors([
      [200, 'Світло-коричневий', 'Light-brown'],
      [201, 'Рожево-коричневий', 'Rosy-brown'],
      [202, 'Насичений коричневий', 'Saddle-brown'],
      [203, 'Темно-коричневий', 'Dark-brown'],
      [204, 'Світло-рожевий', 'Light-pink'],
      [205, 'Вишневий', 'Violet-red'],
      [206, 'Золотий', 'Golden'],
      [207, 'Темно-оливковий', 'Dark-olive'],
      [208, 'Світло-сталевий', 'Light-steel'],
      [209, 'Сталево-блакитний', 'Steel-blue'],
      [210, 'Темно-синій', 'Dark-blue'],
      [211, 'Світло-сірий', 'Light-gray'],
      [212, 'Срібний', 'Silver'],
      [213, 'Сизий', 'Slate-gray'],
      [214, 'Брудно-сірий', 'Dim-gray'],
      [215, 'Темно-сірий', 'Dark-gray']
  ]),
    available: true
  }
];

module.exports = materials;
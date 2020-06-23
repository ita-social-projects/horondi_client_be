const { mapToLanguages } = require('../../helpers/languages');
const { mapToColors } = require('../../helpers/colors');
const { getObjectId, getObjectIds } = require('mongo-seeding');

const materials = [
  {
    id: getObjectId('malmo'),
    name: mapToLanguages(['Мальмо', 'Malmo']),
    description: mapToLanguages(['Мальмо (100% поліестер) - для рюкзаків, сумок, бананок (всі моделі). Прошита додатковим шаром спеціального матеріалу, який зміцнює та захищає від води.',
        'Malmo (100% polyester) - for backpacks, bags, fanny-packs (all models). Layered with special material for durability and water-resistance.']),
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
  },
  {
    id: getObjectId('bond'),
    name: mapToLanguages(['Бонд', 'Bond']),
    description: mapToLanguages(['Бонд (100% поліестер) - для рюкзаків моделі Rolltop. Прошита додатковим шаром спеціального матеріалу, який зміцнює та захищає від води.',
        'Bond (100% polyester) - for backpacks of Rolltop model. Layered with special material for durability and water-resistance.']),
    colors: mapToColors([
      [300, 'Лляний', 'Linen'],
      [301, 'Пшеничний', 'Wheat'],
      [302, 'Світло-лососевий', 'Light-salmon'],
      [303, 'Лососевий', 'Salmon'],
      [304, 'Темно-лососевий', 'Dark-salmon'],
      [305, 'Насичений коричневий', 'Saddle-brown'],
      [306, 'Світло-сизий', 'Light-slate-gray'],
      [307, 'Димчатий', 'Whitesmoke'],
      [308, 'Бордовий', 'Maroon'],
      [309, 'Королівський синій', 'Royal-blue'],
      [310, 'Кораловий', 'Coral'],
      [311, 'Оранжевий', 'Orange'],
      [312, 'Золотий', 'Gold'],
      [313, 'Хакі', 'Khaki'],
      [314, 'Темний хакі', 'Dark-khaki'],
      [315, 'Блідо-фіолетовий', 'Pale-violet'],
      [316, 'Глибокий небесно-синій', 'Deep-sky-blue'],
      [317, 'Темно-синій', 'Midnight-blue'],
      [318, 'Темно-червоний', 'Dark-red']
  ]),
    available: true
  },
  {
    id: getObjectId('faux-leather'),
    name: mapToLanguages(['Шкірзамінник', 'Faux leather']),
    description: mapToLanguages(['Шкірзамінник',
        'Faux leather']),
    colors: mapToColors([
      [1, 'Чорний', 'Black'],
      [2, 'Коричневий', 'Brown'],
      [3, 'Сірий', 'Gray'],
      [4, 'Рожевий', 'Pink']
  ]),
    available: true
  },
  {
    id: getObjectId('cordura'),
    name: mapToLanguages(['Тканина Кордура', 'Cordura fabric']),
    description: mapToLanguages(['Тканина Кордура',
        'Cordura fabric']),
    colors: mapToColors([
      [1, 'Чорний', 'Black']
  ]),
    available: true
  },
  {
    id: getObjectId('genuine-leather'),
    name: mapToLanguages(['Натуральна шкіра', 'Genuine leather']),
    description: mapToLanguages(['Натуральна шкіра',
        'Genuine leather']),
    colors: mapToColors([
      [1, 'Чорний', 'Black'],
      [2, 'Коричневий', 'Brown']
  ]),
    available: true
  }
];

module.exports = materials;
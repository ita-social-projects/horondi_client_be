const { mapToLanguages } = require('../../helpers/languages');
const { mapToColors } = require('../../helpers/colors');
const { getObjectId, getObjectIds } = require('mongo-seeding');

const materials = [
  {
    id: getObjectId('malmo'),
    name: mapToLanguages(['Мальмо', 'Malmo']),
    description: mapToLanguages(['100% poliester прошита додатковим шаром спеціального матеріалу, який зміцнює та захищає від води + підкладка + фабричний гобелен',
      '100% poliester padded with a layer of durable and water-resistant material + inner layer + factory-made pattern']),
    colors: mapToColors([
      [200, 'Світло-коричневий', 'Light-brown', 'brown'],
      [201, 'Рожево-коричневий', 'Rosy-brown', 'brown'],
      [202, 'Насичений коричневий', 'Saddle-brown', 'brown'],
      [203, 'Темно-коричневий', 'Dark-brown', 'brown'],
      [204, 'Світло-рожевий', 'Light-pink', 'pink'],
      [205, 'Вишневий', 'Violet-red', 'red'],
      [206, 'Золотий', 'Golden', 'yellow'],
      [207, 'Темно-оливковий', 'Dark-olive', 'green'],
      [208, 'Світло-сталевий', 'Light-steel', 'grey'],
      [209, 'Сталево-блакитний', 'Steel-blue', 'blue'],
      [210, 'Темно-синій', 'Dark-blue', 'blue'],
      [211, 'Світло-сірий', 'Light-grey', 'grey'],
      [212, 'Срібний', 'Silver', 'grey'],
      [213, 'Сизий', 'Slate-grey', 'grey'],
      [214, 'Брудно-сірий', 'Dim-grey', 'grey'],
      [215, 'Темно-сірий', 'Dark-grey', 'grey']
  ]),
    available: true,
    additionalPrice: 0
  },
  {
    id: getObjectId('bond'),
    name: mapToLanguages(['Бонд', 'Bond']),
    description: mapToLanguages(['100% poliester прошита додатковим шаром спеціального матеріалу, який зміцнює та захищає від води + підкладка + фабричний гобелен',
      '100% poliester padded with a layer of durable and water-resistant material + inner layer + factory-made pattern']),
    colors: mapToColors([
      [300, 'Лляний', 'Linen', 'beige'],
      [301, 'Пшеничний', 'Wheat', 'beige'],
      [302, 'Світло-лососевий', 'Light-salmon', 'beige'],
      [303, 'Лососевий', 'Salmon', 'brown'],
      [304, 'Темно-лососевий', 'Dark-salmon', 'brown'],
      [305, 'Насичений коричневий', 'Saddle-brown', 'brown'],
      [306, 'Світло-сизий', 'Light-slate-grey', 'grey'],
      [307, 'Димчатий', 'Whitesmoke', 'grey'],
      [308, 'Бордовий', 'Maroon', 'red'],
      [309, 'Королівський синій', 'Royal-blue', 'blue'],
      [310, 'Кораловий', 'Coral', 'orange'],
      [311, 'Оранжевий', 'Orange', 'orange'],
      [312, 'Золотий', 'Gold', 'yellow'],
      [313, 'Хакі', 'Khaki', 'green'],
      [314, 'Темний хакі', 'Dark-khaki', 'green'],
      [315, 'Блідо-фіолетовий', 'Pale-violet', 'red'],
      [316, 'Глибокий небесно-синій', 'Deep-sky-blue', 'blue'],
      [317, 'Темно-синій', 'Midnight-blue', 'blue'],
      [318, 'Темно-червоний', 'Dark-red', 'red']
  ]),
    available: true,
    additionalPrice: 0
  },
  {
    id: getObjectId('faux-leather'),
    name: mapToLanguages(['Шкірзамінник', 'Faux leather']),
    description: mapToLanguages(['Шкірзамінник',
        'Faux leather']),
    colors: mapToColors([
      [1, 'Чорний', 'Black', 'black'],
      [2, 'Коричневий', 'Brown', 'brown'],
      [3, 'Сірий', 'Grey', 'grey'],
      [4, 'Рожевий', 'Pink', 'pink']
  ]),
    available: true,
    additionalPrice: 0
  },
  {
    id: getObjectId('cordura'),
    name: mapToLanguages(['Тканина Кордура', 'Cordura fabric']),
    description: mapToLanguages(['Тканина Кордура',
        'Cordura fabric']),
    colors: mapToColors([
      [1, 'Чорний', 'Black', 'black']
  ]),
    available: true,
    additionalPrice: 0
  },
  {
    id: getObjectId('genuine-leather'),
    name: mapToLanguages(['Натуральна шкіра', 'Genuine leather']),
    description: mapToLanguages(['Натуральна шкіра',
        'Genuine leather']),
    colors: mapToColors([
      [1, 'Чорний', 'Black', 'black'],
      [2, 'Коричневий', 'Brown', 'brown']
  ]),
    available: true,
    additionalPrice: 350
  }
];

module.exports = materials;
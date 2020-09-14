const { mapToLanguages } = require('../../helpers/languages');
const { mapToColors } = require('../../helpers/colors');
const { mapToCurrencies } = require('../../helpers/currencyset');
const { getObjectId } = require('mongo-seeding');

const materials = [
  {
    id: getObjectId('malmo'),
    name: mapToLanguages(['Мальмо', 'Malmo']),
    description: mapToLanguages(['100% poliester прошита додатковим шаром спеціального матеріалу, який зміцнює та захищає від води + підкладка + фабричний гобелен',
      '100% poliester padded with a layer of durable and water-resistant material + inner layer + factory-made pattern']),
    purpose: 'main',
    colors: mapToColors([
      [200, 'Світло-коричневий', 'Light-brown', 'коричневий', 'brown'],
      [201, 'Рожево-коричневий', 'Rosy-brown', 'коричневий', 'brown'],
      [202, 'Насичений коричневий', 'Saddle-brown', 'коричневий', 'brown'],
      [203, 'Темно-коричневий', 'Dark-brown', 'коричневий', 'brown'],
      [204, 'Світло-рожевий', 'Light-pink', 'рожевий', 'pink'],
      [205, 'Вишневий', 'Violet-red', 'червоний', 'red'],
      [206, 'Золотий', 'Golden', 'жовтий', 'yellow'],
      [207, 'Темно-оливковий', 'Dark-olive', 'зелений', 'green'],
      [208, 'Світло-сталевий', 'Light-steel', 'сірий', 'grey'],
      [209, 'Сталево-блакитний', 'Steel-blue', 'синій', 'blue'],
      [210, 'Темно-синій', 'Dark-blue', 'синій', 'blue'],
      [211, 'Світло-сірий', 'Light-grey', 'сірий', 'grey'],
      [212, 'Срібний', 'Silver', 'сірий', 'grey'],
      [213, 'Сизий', 'Slate-grey', 'сірий', 'grey'],
      [214, 'Брудно-сірий', 'Dim-grey', 'сірий', 'grey'],
      [215, 'Темно-сірий', 'Dark-grey', 'сірий', 'grey']
  ]),
    available: true,
    additionalPrice: mapToCurrencies(0)
  },
  {
    id: getObjectId('bond'),
    name: mapToLanguages(['Бонд', 'Bond']),
    description: mapToLanguages(['100% poliester прошита додатковим шаром спеціального матеріалу, який зміцнює та захищає від води + підкладка + фабричний гобелен',
      '100% poliester padded with a layer of durable and water-resistant material + inner layer + factory-made pattern']),
    purpose: 'main',
    colors: mapToColors([
      [300, 'Лляний', 'Linen', 'бежевий', 'beige'],
      [301, 'Пшеничний', 'Wheat', 'бежевий', 'beige'],
      [302, 'Світло-лососевий', 'Light-salmon', 'бежевий', 'beige'],
      [303, 'Лососевий', 'Salmon', 'коричневий', 'brown'],
      [304, 'Темно-лососевий', 'Dark-salmon', 'коричневий', 'brown'],
      [305, 'Насичений коричневий', 'Saddle-brown', 'коричневий', 'brown'],
      [306, 'Світло-сизий', 'Light-slate-grey', 'сірий', 'grey'],
      [307, 'Димчатий', 'Whitesmoke', 'сірий', 'grey'],
      [308, 'Бордовий', 'Maroon', 'червоний', 'red'],
      [309, 'Королівський синій', 'Royal-blue', 'синій', 'blue'],
      [310, 'Кораловий', 'Coral', 'оранжевий', 'orange'],
      [311, 'Оранжевий', 'Orange', 'оранжевий', 'orange'],
      [312, 'Золотий', 'Gold', 'жовтий', 'yellow'],
      [313, 'Хакі', 'Khaki', 'зелений', 'green'],
      [314, 'Темний хакі', 'Dark-khaki', 'зелений', 'green'],
      [315, 'Блідо-фіолетовий', 'Pale-violet', 'червоний', 'red'],
      [316, 'Глибокий небесно-синій', 'Deep-sky-blue', 'синій', 'blue'],
      [317, 'Темно-синій', 'Midnight-blue', 'синій', 'blue'],
      [318, 'Темно-червоний', 'Dark-red', 'червоний', 'red']
  ]),
    available: true,
    additionalPrice: mapToCurrencies(0)
  },
  {
    id: getObjectId('faux-leather'),
    name: mapToLanguages(['Шкірзамінник', 'Faux leather']),
    description: mapToLanguages(['Шкірзамінник',
        'Faux leather']),
    purpose: 'bottom',
    colors: mapToColors([
      [1, 'Чорний', 'Black', 'чорний', 'black'],
      [2, 'Коричневий', 'Brown', 'коричневий', 'brown'],
      [3, 'Сірий', 'Grey', 'сірий', 'grey'],
      [4, 'Рожевий', 'Pink', 'рожевий', 'pink']
  ]),
    available: true,
    additionalPrice: mapToCurrencies(0)
  },
  {
    id: getObjectId('cordura'),
    name: mapToLanguages(['Тканина Кордура', 'Cordura fabric']),
    description: mapToLanguages(['Тканина Кордура',
        'Cordura fabric']),
    purpose: 'bottom',
    colors: mapToColors([
      [1, 'Чорний', 'Black', 'чорний', 'black']
  ]),
    available: true,
    additionalPrice: mapToCurrencies(0)
  },
  {
    id: getObjectId('genuine-leather'),
    name: mapToLanguages(['Натуральна шкіра', 'Genuine leather']),
    description: mapToLanguages(['Натуральна шкіра',
        'Genuine leather']),
    purpose: 'bottom',
    colors: mapToColors([
      [1, 'Чорний', 'Black', 'чорний', 'black'],
      [2, 'Коричневий', 'Brown', 'коричневий', 'brown']
  ]),
    available: true,
    additionalPrice: mapToCurrencies(35000)
  }
];

module.exports = materials;
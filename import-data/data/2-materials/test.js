const { mapToLanguages } = require('../../helpers/languages');
const { mapToImages } = require('../../helpers/images');

const colors = [
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
]

const mapToColors = (names) => {
    colorsNumber = names.length;
    result = [];
    for (let i = 0; i < colorsNumber; i++) {
        let entry = {
            code: names[i][0],
            name: mapToLanguages([names[i][1], names[i][2]]),
            images: mapToImages(names[i][2].toLowerCase()),
            available: true
        };
        console.log(entry);
        result[i] = entry
    };
    return result
  };

const array = mapToColors(colors);
console.log(array);
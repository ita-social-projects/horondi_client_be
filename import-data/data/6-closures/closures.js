const { mapToLanguages } = require('../../helpers/languages');
const { mapToCurrencies } = require('../../helpers/currencyset');
const { mapToColors } = require('../../helpers/colors');
const { getObjectId } = require('mongo-seeding');

const closures = [
    {
        id: getObjectId('metal-closure'),
        name: mapToLanguages(['Металева защіпка', 'Metal closure']),
        colors: mapToColors([
            [1, 'Чорна', 'Black', 'black'],
            [2, 'Золотиста', 'Golden', 'yellow']
        ]),
        available: true,
        additionalPrice: mapToCurrencies(1000)
    },
    {
        id: getObjectId('plastic-closure'),
        name: mapToLanguages(['Фастекс (пластикова защіпка)', 'Plastic closure']),
        colors: mapToColors([
            [1, 'Чорна', 'Black', 'black']
        ]),
        available: true,
        additionalPrice: mapToCurrencies(0)
    },
    {
        id: getObjectId('metal-hook'),
        name: mapToLanguages(['Металевий гачок', 'Metal hook']),
        colors: mapToColors([
            [1, 'Чорний', 'Black', 'black'],
            [2, 'Золотистий', 'Golden', 'yellow']
        ]),
        available: true,
        additionalPrice: mapToCurrencies(1000)
    }
];

module.exports = closures;
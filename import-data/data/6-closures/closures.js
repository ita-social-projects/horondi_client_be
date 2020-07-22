const { mapToLanguages } = require('../../helpers/languages');
const { mapToColors } = require('../../helpers/colors');
const { getObjectId, getObjectIds } = require('mongo-seeding');

const closures = [
    {
        id: getObjectId('metal-closure'),
        name: mapToLanguages(['Металева защіпка', 'Metal closure']),
        colors: mapToColors([
            [1, 'Чорна', 'Black', 'black'],
            [2, 'Золотиста', 'Golden', 'yellow']
        ]),
        available: true,
        additionalPrice: 10
    },
    {
        id: getObjectId('plastic-closure'),
        name: mapToLanguages(['Фастекс (пластикова защіпка)', 'Plastic closure']),
        colors: mapToColors([
            [1, 'Чорна', 'Black', 'black']
        ]),
        available: true,
        additionalPrice: 0
    },
    {
        id: getObjectId('metal-hook'),
        name: mapToLanguages(['Металевий гачок', 'Metal hook']),
        colors: mapToColors([
            [1, 'Чорний', 'Black', 'black'],
            [2, 'Золотистий', 'Golden', 'yellow']
        ]),
        available: true,
        additionalPrice: 10
    }
];

module.exports = closures;
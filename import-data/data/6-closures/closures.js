const { mapToLanguages } = require('../../helpers/languages');
const { mapToColors } = require('../../helpers/colors');
//const { getObjectId, getObjectIds } = require('mongo-seeding');

const closures = [
    {
        name: mapToLanguages(['Металева защіпка', 'Metal closure']),
        colors: mapToColors([
            [1, 'Чорна', 'Black'],
            [2, 'Золотиста', 'Golden']
        ]),
        available: true,
        additionalPrice: 10
    },
    {
        name: mapToLanguages(['Фастекс (пластикова защіпка)', 'Plastic closure']),
        colors: mapToColors([
            [1, 'Чорна', 'Black']
        ]),
        available: true,
        additionalPrice: 0
    },
    {
        name: mapToLanguages(['Металевий гачок', 'Metal hook']),
        colors: mapToColors([
            [1, 'Чорний', 'Black'],
            [2, 'Золотистий', 'Golden']
        ]),
        available: true,
        additionalPrice: 10
    }
];

module.exports = closures;
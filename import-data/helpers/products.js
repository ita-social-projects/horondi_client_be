const fs = require('fs');
const path = require('path');
const { mapToLanguages } = require('./languages');
const { mapToImages } = require('./images');
const { mapToColors } = require('./colors');
const { mapToOptions } = require('./options');
const { getObjectId, getObjectIds } = require('mongo-seeding');

const rolltopDescUK = fs.readFileSync(path.join(__dirname, '..', 'src', 'rolltopDescUK.html'), 'utf8');
const rolltopDescEN = fs.readFileSync(path.join(__dirname, '..', 'src', 'rolltopDescEN.html'), 'utf8');
const newDescUK = fs.readFileSync(path.join(__dirname, '..', 'src', 'newDescUK.html'), 'utf8');
const newDescEN = fs.readFileSync(path.join(__dirname, '..', 'src', 'newDescEN.html'), 'utf8');
const harbuzDescUK = fs.readFileSync(path.join(__dirname, '..', 'src', 'harbuzDescUK.html'), 'utf8');
const harbuzDescEN = fs.readFileSync(path.join(__dirname, '..', 'src', 'harbuzDescEN.html'), 'utf8');
const bagWithPatternDescUK = fs.readFileSync(path.join(__dirname, '..', 'src', 'bagWithPatternDescUK.html'), 'utf8');
const bagWithPatternDescEN = fs.readFileSync(path.join(__dirname, '..', 'src', 'bagWithPatternDescEN.html'), 'utf8');
const bagThreeColorsDescUK = fs.readFileSync(path.join(__dirname, '..', 'src', 'bagThreeColorsDescUK.html'), 'utf8');
const bagThreeColorsDescEN = fs.readFileSync(path.join(__dirname, '..', 'src', 'bagThreeColorsDescEN.html'), 'utf8');
const bagOneColorDescUK = fs.readFileSync(path.join(__dirname, '..', 'src', 'bagOneColorDescUK.html'), 'utf8');
const bagOneColorDescEN = fs.readFileSync(path.join(__dirname, '..', 'src', 'bagOneColorDescEN.html'), 'utf8');
const bagSimpleDescUK = fs.readFileSync(path.join(__dirname, '..', 'src', 'bagSimpleDescUK.html'), 'utf8');
const bagSimpleDescEN = fs.readFileSync(path.join(__dirname, '..', 'src', 'bagSimpleDescEN.html'), 'utf8');
const fannyPackLargeDescUK = fs.readFileSync(path.join(__dirname, '..', 'src', 'fannyPackLargeDescUK.html'), 'utf8');
const fannyPackLargeDescEN = fs.readFileSync(path.join(__dirname, '..', 'src', 'fannyPackLargeDescEN.html'), 'utf8');
const fannyPackSmallDescUK = fs.readFileSync(path.join(__dirname, '..', 'src', 'fannyPackSmallDescUK.html'), 'utf8');
const fannyPackSmallDescEN = fs.readFileSync(path.join(__dirname, '..', 'src', 'fannyPackSmallDescEN.html'), 'utf8');

const bondDescription = mapToLanguages([
    '100% poliester прошита додатковим шаром спеціального матеріалу, який зміцнює та захищає від води + підкладка + фабричний гобелен',
    '100% poliester padded with a layer of durable and water-resistant material + inner layer + factory-made pattern'
]);

const rolltops = [
    ['Rolltop Red 1', [318, 'Темно-червоний', 'Dark-red', 'red'], ['Чорний', 'Black'], 'black', 'black'],
    ['Rolltop Grey 1', [213, 'Сизий', 'Slate-grey', 'grey'], ['Чорний', 'Black'], 'black', 'black'],
    ['Rolltop Green 1', [207, 'Темно-оливковий', 'Dark-olive', 'green'], ['Чорний', 'Black'], 'black', 'black'],
    ['Rolltop Pink 1', [204, 'Світло-рожевий', 'Light-pink', 'pink'], ['Вишивка', 'Embroidery'], 'embroidery', 'pink'],
    ['Rolltop Coffee 1', [304, 'Темно-лососевий', 'Dark-salmon', 'brown'], ['Вишивка', 'Embroidery'], 'embroidery', 'brown'],
    ['Rolltop Blue 1', [309, 'Королівський синій', 'Royal-blue', 'blue'], ['Стрілки', 'Arrows'], 'arrows', 'black'],
    ['Rolltop Yellow 1', [206, 'Золотий', 'Golden', 'yellow'], ['Квіти', 'Flowers'], 'flowers', 'red'],
    ['Rolltop Yellow 2', [206, 'Золотий', 'Golden', 'yellow'], ['Олені', 'Deers'], 'deers', 'purple'],
    ['Rolltop Grey 2', [208, 'Світло-сталевий', 'Light-steel', 'grey'], ['Олені', 'Deers'], 'deers', 'brown'],
    ['Rolltop Black 1', [215, 'Темно-сірий', 'Dark-grey', 'grey'], ['Чорний', 'Black'], 'black', 'black'],
    ['Rolltop Brown 1', [305, 'Насичений коричневий', 'Saddle-brown', 'brown'], ['Люди', 'People'], 'people', 'brown'],
];
const rolltopNumber = rolltops.length;

let products = [];
let counter = 0;

for(i = 0; i < rolltopNumber; i++) {
    products.push({
        id: getObjectId('product' + counter + i),
        subcategory: getObjectId('sub-backpacks'),
        name: mapToLanguages([rolltops[i][0], rolltops[i][0]]),
        description: mapToLanguages([rolltopDescUK, rolltopDescEN]),
        mainMaterial: bondDescription,
        innerMaterial: mapToLanguages(['Oxford 135', 'Oxford 135']),
        strapLengthInCm: 100,
        images: {
            primary: mapToImages('primary-rolltop' + counter + i),
            additional: [
                mapToImages('additional-rolltop-'+ counter + i + '-1'),
                mapToImages('additional-rolltop-'+ counter + i + '-2'),
                mapToImages('additional-rolltop-'+ counter + i + '-3')
            ]
        },
        colors: mapToColors([rolltops[i][1]]),
        pattern: mapToLanguages(rolltops[i][2]),
        patternImages: mapToImages(rolltops[i][3]),
        closure: mapToLanguages(['Фастекс (пластикова защіпка)', 'Plastic closure']),
        closureColor: 'black',
        basePrice: 1450,
        options: mapToOptions('backpack', rolltops[i][4])
    })
}

// const products = [{
//     id: getObjectId('product' + 2),
//     category: getObjectId('sub-backpacks'),
//     name: mapToLanguages(['Новий', 'New']),
//     description: mapToLanguages([newDescUK, newDescEN]),
//     images: {
//         primary: mapToImages('primary-new'),
//         additional: [
//             mapToImages('additional-new-1'),
//             mapToImages('additional-new-2'),
//             mapToImages('additional-new-3')
//         ]
//     },
//     basePrice: 1650,
//     items: mapToItems('backpack', [[45, 28, 14]], 'malmo', 1650, 15)
// }, {
//     id: getObjectId('product' + 3),
//     category: getObjectId('sub-backpacks'),
//     name: mapToLanguages(['Гарбуз', 'Harbuz']),
//     description: mapToLanguages([harbuzDescUK, harbuzDescEN]),
//     images: {
//         primary: mapToImages('primary-harbuz'),
//         additional: [
//             mapToImages('additional-harbuz-1'),
//             mapToImages('additional-harbuz-2'),
//             mapToImages('additional-harbuz-3')
//         ]
//     },
//     basePrice: 1550,
//     items: mapToItems('backpack', [[40, 28, 14]], 'malmo', 1550, 15)
// }, {
//     id: getObjectId('product' + 4),
//     category: getObjectId('sub-bags'),
//     name: mapToLanguages(['Сумка з гобеленом', 'Bag with pattern']),
//     description: mapToLanguages([bagWithPatternDescUK, bagWithPatternDescEN]),
//     images: {
//         primary: mapToImages('primary-bag-with-pattern'),
//         additional: [
//             mapToImages('additional-bag-with-pattern-1'),
//             mapToImages('additional-bag-with-pattern-2'),
//             mapToImages('additional-bag-with-pattern-3')
//         ]
//     },
//     basePrice: 900,
//     items: mapToItems('bag', [[38, 36, 10]], 'malmo', 900, 10)
// }, {
//     id: getObjectId('product' + 5),
//     category: getObjectId('sub-bags'),
//     name: mapToLanguages(['Сумка три кольори', 'Three color bag']),
//     description: mapToLanguages([bagThreeColorsDescUK, bagThreeColorsDescEN]),
//     images: {
//         primary: mapToImages('primary-bag-three-colors'),
//         additional: [
//             mapToImages('additional-bag-three-colors-1'),
//             mapToImages('additional-bag-three-colors-2'),
//             mapToImages('additional-bag-three-colors-3')
//         ]
//     },
//     basePrice: 900,
//     items: mapToItems('bag', [[36, 36, 12]], 'malmo', 900, 10)
// }, {
//     id: getObjectId('product' + 6),
//     category: getObjectId('sub-bags'),
//     name: mapToLanguages(['Сумка одноколірна', 'One color bag']),
//     description: mapToLanguages([bagOneColorDescUK, bagOneColorDescEN]),
//     images: {
//         primary: mapToImages('primary-bag-one-color'),
//         additional: [
//             mapToImages('additional-bag-one-color-1'),
//             mapToImages('additional-bag-one-color-2'),
//             mapToImages('additional-bag-one-color-3')
//         ]
//     },
//     basePrice: 900,
//     items: mapToItems('bag', [[36, 36, 12]], 'malmo', 900, 10)
// }, {
//     id: getObjectId('product' + 7),
//     category: getObjectId('sub-bags'),
//     name: mapToLanguages(['Сумка', 'Bag']),
//     description: mapToLanguages([bagSimpleDescUK, bagSimpleDescEN]),
//     images: {
//         primary: mapToImages('primary-bag-simple'),
//         additional: [
//             mapToImages('additional-bag-simple-1'),
//             mapToImages('additional-bag-simple-2'),
//             mapToImages('additional-bag-simple-3')
//         ]
//     },
//     basePrice: 950,
//     items: mapToItems('bag', [[36, 36, 12]], 'malmo', 950, 10)
// }, {
//     id: getObjectId('product' + 8),
//     category: getObjectId('sub-fanny-packs'),
//     name: mapToLanguages(['Бананка велика', 'Fanny pack large']),
//     description: mapToLanguages([fannyPackLargeDescUK, fannyPackLargeDescEN]),
//     images: {
//         primary: mapToImages('primary-fanny-pack-large'),
//         additional: [
//             mapToImages('additional-fanny-pack-large-1'),
//             mapToImages('additional-fanny-pack-large-2'),
//             mapToImages('additional-fanny-pack-large-3')
//         ]
//     },
//     basePrice: 500,
//     items: mapToItems('fanny-pack', [[17, 35]], 'malmo', 500, 10)
// }, {
//     id: getObjectId('product' + 9),
//     category: getObjectId('sub-fanny-packs'),
//     name: mapToLanguages(['Бананка маленька', 'Fanny pack small']),
//     description: mapToLanguages([fannyPackSmallDescUK, fannyPackSmallDescEN]),
//     images: {
//         primary: mapToImages('primary-fanny-pack-small'),
//         additional: [
//             mapToImages('additional-fanny-pack-small-1'),
//             mapToImages('additional-fanny-pack-small-2'),
//             mapToImages('additional-fanny-pack-small-3')
//         ]
//     },
//     basePrice: 400,
//     items: mapToItems('fanny-pack', [[10, 20]], 'malmo', 400, 10)
// }, {
//     id: getObjectId('product' + 0),
//     category: getObjectId('sub-wallets'),
//     name: mapToLanguages(['Гаманець', 'Wallet']),
//     description: mapToLanguages(['', '']),
//     images: {
//         primary: mapToImages('primary-wallet'),
//         additional: [
//             mapToImages('additional-wallet-1'),
//             mapToImages('additional-wallet-2'),
//             mapToImages('additional-wallet-3')
//         ]
//     },
//     basePrice: 200,
//     items: mapToItems('wallet', [[10, 10]], 'malmo', 200, 3)
// }];

module.exports = products;
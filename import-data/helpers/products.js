const fs = require('fs');
const path = require('path');
const { mapToLanguages } = require('./languages');
const { mapToImages } = require('./images');
const { mapToItems } = require('./items');
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

const products = [{
    id: getObjectId('product' + 1),
    category: getObjectId('sub-backpacks'),
    name: mapToLanguages(['Ролтоп', 'RollTop']),
    description: mapToLanguages([rolltopDescUK, rolltopDescEN]),
    images: {
        primary: mapToImages('primary-rolltop'),
        additional: [
            mapToImages('additional-rolltop-1'),
            mapToImages('additional-rolltop-2'),
            mapToImages('additional-rolltop-3')
        ]
    },
    basePrice: 1450,
    items: mapToItems('backpack', [[35, 26, 14], [40, 28, 14], [45, 28, 14]], 'bond', 1450, 30)
}, {
    id: getObjectId('product' + 2),
    category: getObjectId('sub-backpacks'),
    name: mapToLanguages(['Новий', 'New']),
    description: mapToLanguages([newDescUK, newDescEN]),
    images: {
        primary: mapToImages('primary-new'),
        additional: [
            mapToImages('additional-new-1'),
            mapToImages('additional-new-2'),
            mapToImages('additional-new-3')
        ]
    },
    basePrice: 1650,
    items: mapToItems('backpack', [[45, 28, 14]], 'malmo', 1650, 15)
}, {
    id: getObjectId('product' + 3),
    category: getObjectId('sub-backpacks'),
    name: mapToLanguages(['Гарбуз', 'Harbuz']),
    description: mapToLanguages([harbuzDescUK, harbuzDescEN]),
    images: {
        primary: mapToImages('primary-harbuz'),
        additional: [
            mapToImages('additional-harbuz-1'),
            mapToImages('additional-harbuz-2'),
            mapToImages('additional-harbuz-3')
        ]
    },
    basePrice: 1550,
    items: mapToItems('backpack', [[40, 28, 14]], 'malmo', 1550, 15)
}, {
    id: getObjectId('product' + 4),
    category: getObjectId('sub-bags'),
    name: mapToLanguages(['Сумка з гобеленом', 'Bag with pattern']),
    description: mapToLanguages([bagWithPatternDescUK, bagWithPatternDescEN]),
    images: {
        primary: mapToImages('primary-bag-with-pattern'),
        additional: [
            mapToImages('additional-bag-with-pattern-1'),
            mapToImages('additional-bag-with-pattern-2'),
            mapToImages('additional-bag-with-pattern-3')
        ]
    },
    basePrice: 900,
    items: mapToItems('bag', [[38, 36, 10]], 'malmo', 900, 10)
}, {
    id: getObjectId('product' + 5),
    category: getObjectId('sub-bags'),
    name: mapToLanguages(['Сумка три кольори', 'Three color bag']),
    description: mapToLanguages([bagThreeColorsDescUK, bagThreeColorsDescEN]),
    images: {
        primary: mapToImages('primary-bag-three-colors'),
        additional: [
            mapToImages('additional-bag-three-colors-1'),
            mapToImages('additional-bag-three-colors-2'),
            mapToImages('additional-bag-three-colors-3')
        ]
    },
    basePrice: 900,
    items: mapToItems('bag', [[36, 36, 12]], 'malmo', 900, 10)
}, {
    id: getObjectId('product' + 6),
    category: getObjectId('sub-bags'),
    name: mapToLanguages(['Сумка одноколірна', 'One color bag']),
    description: mapToLanguages([bagOneColorDescUK, bagOneColorDescEN]),
    images: {
        primary: mapToImages('primary-bag-one-color'),
        additional: [
            mapToImages('additional-bag-one-color-1'),
            mapToImages('additional-bag-one-color-2'),
            mapToImages('additional-bag-one-color-3')
        ]
    },
    basePrice: 900,
    items: mapToItems('bag', [[36, 36, 12]], 'malmo', 900, 10)
}, {
    id: getObjectId('product' + 7),
    category: getObjectId('sub-bags'),
    name: mapToLanguages(['Сумка', 'Bag']),
    description: mapToLanguages([bagSimpleDescUK, bagSimpleDescEN]),
    images: {
        primary: mapToImages('primary-bag-simple'),
        additional: [
            mapToImages('additional-bag-simple-1'),
            mapToImages('additional-bag-simple-2'),
            mapToImages('additional-bag-simple-3')
        ]
    },
    basePrice: 950,
    items: mapToItems('bag', [[36, 36, 12]], 'malmo', 950, 10)
}, {
    id: getObjectId('product' + 8),
    category: getObjectId('sub-fanny-packs'),
    name: mapToLanguages(['Бананка велика', 'Fanny pack large']),
    description: mapToLanguages([fannyPackLargeDescUK, fannyPackLargeDescEN]),
    images: {
        primary: mapToImages('primary-fanny-pack-large'),
        additional: [
            mapToImages('additional-fanny-pack-large-1'),
            mapToImages('additional-fanny-pack-large-2'),
            mapToImages('additional-fanny-pack-large-3')
        ]
    },
    basePrice: 500,
    items: mapToItems('fanny-pack', [[17, 35]], 'malmo', 500, 10)
}, {
    id: getObjectId('product' + 9),
    category: getObjectId('sub-fanny-packs'),
    name: mapToLanguages(['Бананка маленька', 'Fanny pack small']),
    description: mapToLanguages([fannyPackSmallDescUK, fannyPackSmallDescEN]),
    images: {
        primary: mapToImages('primary-fanny-pack-small'),
        additional: [
            mapToImages('additional-fanny-pack-small-1'),
            mapToImages('additional-fanny-pack-small-2'),
            mapToImages('additional-fanny-pack-small-3')
        ]
    },
    basePrice: 400,
    items: mapToItems('fanny-pack', [[10, 20]], 'malmo', 400, 10)
}, {
    id: getObjectId('product' + 0),
    category: getObjectId('sub-wallets'),
    name: mapToLanguages(['Гаманець', 'Wallet']),
    description: mapToLanguages(['', '']),
    images: {
        primary: mapToImages('primary-wallet'),
        additional: [
            mapToImages('additional-wallet-1'),
            mapToImages('additional-wallet-2'),
            mapToImages('additional-wallet-3')
        ]
    },
    basePrice: 200,
    items: mapToItems('wallet', [[10, 10]], 'malmo', 200, 3)
}];

module.exports = products;
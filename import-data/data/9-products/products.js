const fs = require('fs');
const path = require('path');
const { mapToLanguages } = require('../../helpers/languages');
const { mapToImages } = require('../../helpers/images');
const { mapToItems } = require('../../helpers/items');
const { getObjectId, getObjectIds } = require('mongo-seeding');

const rolltopDescUK = fs.readFileSync(path.join(__dirname, '../../src') + '/rolltopDescUK.html', 'utf8');
const rolltopDescEN = fs.readFileSync(path.join(__dirname, '../../src') + '/rolltopDescEN.html', 'utf8');
const newDescUK = fs.readFileSync(path.join(__dirname, '../../src') + '/newDescUK.html', 'utf8');
const newDescEN = fs.readFileSync(path.join(__dirname, '../../src') + '/newDescEN.html', 'utf8');
const harbuzDescUK = fs.readFileSync(path.join(__dirname, '../../src') + '/harbuzDescUK.html', 'utf8');
const harbuzDescEN = fs.readFileSync(path.join(__dirname, '../../src') + '/harbuzDescEN.html', 'utf8');

const products = [{
    id: getObjectId('rolltop'),
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
    rate: 0,
    rateCount: 0,
    votedUsers: [],
    basePrice: 1450,
    items: mapToItems('backpack', [[35, 26, 14], [40, 28, 14], [45, 28, 14]], 'bond', 1450, 30),
    available: true,
    comments: []
}, {
    id: getObjectId('new'),
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
    rate: 0,
    rateCount: 0,
    votedUsers: [],
    basePrice: 1650,
    items: mapToItems('backpack', [[45, 28, 14]], 'malmo', 1650, 15),
    available: true,
    comments: []
}, {
    id: getObjectId('harbuz'),
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
    rate: 0,
    rateCount: 0,
    votedUsers: [],
    basePrice: 1550,
    items: mapToItems('backpack', [[40, 28, 14]], 'malmo', 1550, 15),
    available: true,
    comments: []
}];

module.exports = products;
const { mapToSizes } = require('./sizes');
const { getObjectId, getObjectIds } = require('mongo-seeding');

const sizes = [
    mapToSizes({ type: 'backpack-S', name: 'S', size: [35, 26, 14], volume: 15, weight: 0.8, price: -50 }),
    mapToSizes({ type: 'backpack-M', name: 'M', size: [40, 28, 14], volume: 19, weight: 0.8, price: 0 }),
    mapToSizes({ type: 'backpack-L', name: 'L', size: [45, 28, 14], volume: 21, weight: 0.8, price: 50 })
];

module.exports = sizes;
const { mapToSizes } = require('../../helpers/sizes');
const { getObjectId, getObjectIds } = require('mongo-seeding');

const sizes = [
    mapToSizes({ type: 'backpack-S', name: 'S', size: [35, 26, 14], volume: 15, weight: 0.8, price: -50 }),
    mapToSizes({ type: 'backpack-M', name: 'M', size: [40, 28, 14], volume: 19, weight: 0.8, price: 0 }),
    mapToSizes({ type: 'backpack-L', name: 'L', size: [45, 28, 14], volume: 21, weight: 0.8, price: 50 }),
    mapToSizes({ type: 'patbag', name: '', size: [38, 36, 10], volume: 0, weight: 0, price: 0 }),
    mapToSizes({ type: 'col1bag', name: '', size: [36, 36, 12], volume: 0, weight: 0, price: 0 }),
    mapToSizes({ type: 'col3smplbag', name: '', size: [38, 36, 12], volume: 0, weight: 0, price: 0 }),
    mapToSizes({ type: 'fanny-pack', name: '', size: [17,35], volume: 0, weight: 0, price: 0 }),
    mapToSizes({ type: 'wallet', name: '', size: [10,10], volume: 0, weight: 0, price: 0 })
];

module.exports = sizes;
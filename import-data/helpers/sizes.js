const { mapToCurrencies } = require('./currencyset');
const { getObjectId } = require('mongo-seeding');

const mapToSizes = ({type = '', name='', size=0, volume=0, weight=0, price = 0}) => {
    return {
        id: getObjectId(type),
        name: name,
        heightInCm: size[0],
        widthInCm: size[1],
        depthInCm: (size.length === 3) ? size[2] : 0,
        volumeInLiters: volume,
        weightInKg: weight,
        available: true,
        additionalPrice: mapToCurrencies(price)
    };
};

module.exports = {
    mapToSizes
};
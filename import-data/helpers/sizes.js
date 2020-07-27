const { getObjectId, getObjectIds } = require('mongo-seeding');

const mapToSizes = ({type = '', name='', size=0, volume=0, weight=0, price = 0}) => {
    const dimensions = {};
    dimensions['id'] = getObjectId(type);
    dimensions['name'] = name;
    if (size != 0 && size.length === 3) {
        dimensions['heightInCm'] = size[0];
        dimensions['widthInCm'] = size[1];
        dimensions['depthInCm'] = size[2]
    } else if (size != 0 && size.length === 2) {
        dimensions['heightInCm'] = size[0];
        dimensions['widthInCm'] = size[1]
    };
    dimensions['volumeInLiters'] = volume;
    dimensions['weightInKg'] = weight;
    dimensions['available'] = true;
    dimensions['additionalPrice'] = price;

    return dimensions;
};

module.exports = {
    mapToSizes
};
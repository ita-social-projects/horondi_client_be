const { getObjectId, getObjectIds } = require('mongo-seeding');

const mapToComponents = (name, material, colorCode) => {
    return {
        name: name,
        material: getObjectId(material),
        colorCode: colorCode
    }
};

module.exports = {
    mapToComponents
};
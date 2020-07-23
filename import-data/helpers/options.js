const { mapToSizes } = require('./sizes');
const { mapToLanguages } = require('./languages');
const { getObjectId, getObjectIds } = require('mongo-seeding');

const mapToOptions = (category, color) => {
    let options = [];
    let sizes = [];
    let bottomMaterials = [];
    let bottomColors = [];
    let availableNumber;

    if (category == 'backpack') {
        sizes = ['backpack-S', 'backpack-M', 'backpack-L'];
    }
    const sizeNumber = sizes.length;

    if (color == 'pink') {
        bottomMaterials = [getObjectId('faux-leather')];
    } else {
        bottomMaterials = [getObjectId('faux-leather'), getObjectId('cordura'), getObjectId('genuine-leather')];
    }
    const materialNumber = bottomMaterials.length;

    if (color == 'pink') {
        bottomColors = ['pink'];
    } else if (color == 'red') {
        bottomColors = ['red', 'black', 'brown'];
    } else if (color == 'purple') {
        bottomColors = ['purple', 'black', 'brown'];
    } else if (color == 'brown') {
        bottomColors = ['brown', 'black', 'brown'];
    } else {
        bottomColors = ['black', 'black', 'black'];
    }

    for (let i = 0; i < sizeNumber; i++) {
        for (let j = 0; j < materialNumber; j++) {
            for (let k = 0; k < 2; k++) {
                availableNumber = ~~(Math.random() * 5);
                options.push({
                    size: getObjectId(sizes[i]),
                    bottomMaterial: bottomMaterials[j],
                    bottomColor: bottomColors[j],
                    additions: [],
                    availableNumber: availableNumber,
                });
                if (k == 1) {
                    options[options.length-1]['additions'] = [{
                        name: mapToLanguages(['Кишеня', 'Pocket']),
                        description: mapToLanguages(['Бокова кишенька за бажанням', 'Side pocket by request']),
                        available: true,
                        additionalPrice: 100
                    }]
                }
            }
        }
    }
    return options;
};

module.exports = {
    mapToOptions
};
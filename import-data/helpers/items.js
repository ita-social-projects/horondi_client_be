const { mapToSizes } = require('./sizes');
const { mapToComponents } = require('./components');
const materials = require('../data/2-materials/materials');
const { getObjectId, getObjectIds } = require('mongo-seeding');

const mapToItems = (category, sizes, material, basePrice, itemsNumber) => {
    let items = [];
    let sizeName;
    let volume;
    let size;
    let materialColors;
    let materialColorsNumber;
    let bottompick;
    let bottomMaterial;
    let bottomColors;
    let bottomColorsNumber;
    let closurepick;
    let closureId;
    let closureColorCode;
    let availableNumber;
    let withPattern;

    const weight = (category == 'backpack') ? 0.8 : 0;

    const patterns = ['pink-wave', 'blue-wave', 'arrows', 'blue', 'black',
                        'red', 'embroidery', 'deers', 'people', 'flowers'];
    const patternsNumber = patterns.length;

    let malmoColors = [];
    const malmoColorsNumber = materials[0]['colors'].length;
    for (let i = 0; i < malmoColorsNumber; i++) {
        malmoColors.push(materials[0]['colors'][i]['code']);
    }

    let bondColors = [];
    const bondColorsNumber = materials[1]['colors'].length;
    for (let i = 0; i < bondColorsNumber; i++) {
        bondColors.push(materials[1]['colors'][i]['code']);
    }

    let fauxColors = [];
    const fauxColorsNumber = materials[2]['colors'].length;
    for (let i = 0; i < fauxColorsNumber; i++) {
        fauxColors.push(materials[2]['colors'][i]['code']);
    }

    let corduraColors = [];
    const corduraColorsNumber = materials[3]['colors'].length;
    for (let i = 0; i < corduraColorsNumber; i++) {
        corduraColors.push(materials[3]['colors'][i]['code']);
    }

    let genuineColors = [];
    const genuineColorsNumber = materials[4]['colors'].length;
    for (let i = 0; i < genuineColorsNumber; i++) {
        genuineColors.push(materials[4]['colors'][i]['code']);
    }

    for (let i = 0; i < itemsNumber; i++) {
        let additionalPriceSize = 0;
        let additionalPriceMaterial = 0;

        size = sizes[~~(Math.random() * sizes.length)];

        if (category == 'backpack' && size.toString() == [35, 26, 14].toString()) {
            sizeName = 'S';
            volume = 15;
            additionalPriceSize = -50;
        } else if (category == 'backpack' && size.toString() == [40, 28, 14].toString()) {
            sizeName = 'M';
            volume = 19;
        } else if (category == 'backpack' && size.toString() == [45, 28, 14].toString()) {
            sizeName = 'L';
            volume = 21;
            additionalPriceSize = 50;
        } else { sizeName = 0 };

        if (material == 'bond') {
            materialColors = bondColors;
            materialColorsNumber = bondColorsNumber;
        } else {
            materialColors = malmoColors;
            materialColorsNumber = malmoColorsNumber;
        }

        bottompick = ~~(Math.random() * 3);
        if (bottompick == 0) {
            bottomMaterial = 'faux-leather';
            bottomColors = fauxColors;
            bottomColorsNumber = fauxColorsNumber;
        } else if (bottompick == 0) {
            bottomMaterial = 'cordura';
            bottomColors = corduraColors;
            bottomColorsNumber = corduraColorsNumber;
        } else {
            bottomMaterial = 'genuine-leather';
            bottomColors = genuineColors;
            bottomColorsNumber = genuineColorsNumber;
            additionalPriceMaterial = 350;
        }

        closurepick = ~~(Math.random() * 2);
        if (closurepick == 0) {
            closureId = getObjectId('metal-closure');
            closureColorCode = ~~(Math.random() * 2) + 1;
        } else if (closurepick == 0) {
            closureId = getObjectId('plastic-closure');
            closureColorCode = 1;
        }

        availableNumber = ~~(Math.random() * 5);

        items.push({
            size: mapToSizes({ name: sizeName, sizes: size, volume: volume, weight: weight }),
            components: [
                mapToComponents ('outer-layer', material, materialColors[~~(Math.random() * materialColorsNumber)]),
                mapToComponents ('bottom', bottomMaterial, bottomColors[~~(Math.random() * bottomColorsNumber)]),
            ],
            pocket: !!(~~(Math.random() * 2)),
            closure: closureId,
            closureColorCode: closureColorCode,
            actualPrice: basePrice + additionalPriceSize + additionalPriceMaterial,
            availableNumber: availableNumber
        });

        withPattern = ~~(Math.random() * 2);
        if (withPattern == 1) {
            items[items.length-1]['pattern'] = getObjectId(patterns[~~(Math.random() * patternsNumber)]);
        }
    }

    return items
};

module.exports = {
    mapToItems
};
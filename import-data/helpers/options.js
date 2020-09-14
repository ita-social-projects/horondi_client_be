const { mapToCurrencies } = require('./currencyset');
const { mapToLanguages } = require('./languages');
const { getObjectId } = require('mongo-seeding');

const mapToOptions = (productName, color) => {
    let options = [];
    let sizes = [];
    let bottomMaterials = [];
    let bottomColorsUK = [];
    let bottomColorsEN = [];
    let availableCount;
    let additionalCompNum;

    if (productName === 'rolltop') {
        sizes = ['backpack-S', 'backpack-M', 'backpack-L'];
    } else if (productName === 'new' || productName === 'harbuz') {
        sizes = ['backpack-M', 'backpack-L'];
    }
    sizes = (sizes.length === 0) ? [productName] : sizes;
    const sizeNumber = sizes.length;

    if (color === 'pink') {
        bottomMaterials = [getObjectId('faux-leather')];
    } else if (color === 'black2') {
        bottomMaterials = [getObjectId('cordura'), getObjectId('genuine-leather')];
    } else if (color === '') {
        bottomMaterials = [];
    } else {
        bottomMaterials = [getObjectId('faux-leather'), getObjectId('cordura'), getObjectId('genuine-leather')];
    }
    const materialNumber = (bottomMaterials.length === 0) ? 1 : bottomMaterials.length;

    if (color === 'pink') {
        bottomColorsUK = ['рожевий'];
        bottomColorsEN = ['pink'];
    } else if (color === 'red') {
        bottomColorsUK = ['червоний', 'чорний', 'коричневий'];
        bottomColorsEN = ['red', 'black', 'brown'];
    } else if (color === 'purple') {
        bottomColorsUK = ['пурпуровий', 'чорний', 'коричневий'];
        bottomColorsEN = ['purple', 'black', 'brown'];
    } else if (color === 'brown') {
        bottomColorsUK = ['коричневий', 'чорний', 'коричневий'];
        bottomColorsEN = ['brown', 'black', 'brown'];
    } else if (color === 'black2'){
        bottomColorsUK = ['чорний', 'чорний'];
        bottomColorsEN = ['black', 'black'];
    } else if (color === '') {
        bottomColorsUK = [];
        bottomColorsEN = [];
    } else {
        bottomColorsUK = ['чорний', 'чорний', 'чорний'];
        bottomColorsEN = ['black', 'black', 'black'];
    }

    for (let i = 0; i < sizeNumber; i++) {
        for (let j = 0; j < materialNumber; j++) {
            additionalCompNum = (productName === 'rolltop') ? 2 : 1;
            for (let k = 0; k < additionalCompNum; k++) {
                availableCount = Math.floor((Math.random() * 5));
                options.push({
                    size: getObjectId(sizes[i]),
                    bottomMaterial: (bottomMaterials.length === 0) ? '' : bottomMaterials[j],
                    bottomColor: (bottomColorsUK.length === 0) ? [] : mapToLanguages(
                        [bottomColorsUK[j], 
                        bottomColorsEN[j]]
                    ),
                    additions: [],
                    availableCount: availableCount,
                });
                if (productName === 'rolltop' && k === 1) {
                    options[options.length-1]['additions'] = [{
                        name: mapToLanguages(['Кишеня', 'Pocket']),
                        description: mapToLanguages(['Бокова кишенька за бажанням', 'Side pocket by request']),
                        available: true,
                        additionalPrice: mapToCurrencies(10000)
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
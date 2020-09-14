const { mapToLanguages } = require('../../helpers/languages');
const { mapToImages } = require('../../helpers/images');
const { getObjectId } = require('mongo-seeding');
const { rolltopDescUK, 
    rolltopDescEN, 
    newDescUK, 
    newDescEN, 
    harbuzDescUK, 
    harbuzDescEN, 
    bagWithPatternDescUK, 
    bagWithPatternDescEN, 
    bagThreeColorsDescUK, 
    bagThreeColorsDescEN, 
    bagOneColorDescUK, 
    bagOneColorDescEN, 
    bagSimpleDescUK, 
    bagSimpleDescEN, 
    fannyPackLargeDescUK, 
    fannyPackLargeDescEN 
} = require('../../helpers/productDesc');

let models = [];

mapToModels('main-backpacks', 'sub-backpacks', ['Ролтоп', 'Rolltop'], [rolltopDescUK, rolltopDescEN], 1);
mapToModels('main-backpacks', 'sub-backpacks', ['Новий', 'New'], [newDescUK, newDescEN], 2);
mapToModels('main-backpacks', 'sub-backpacks', ['Гарбуз', 'Harbuz'], [harbuzDescUK, harbuzDescEN], 3);

mapToModels('main-bags', 'sub-bags', ['Сумка з гобеленом', 'Bag with a Pattern'], [bagWithPatternDescUK, bagWithPatternDescEN], 2);
mapToModels('main-bags', 'sub-bags', ['Сумка одноколірна', 'One Color Bag'], [bagOneColorDescUK, bagOneColorDescEN], 3);
mapToModels('main-bags', 'sub-bags', ['Сумка "Три кольори"', 'Three Color Bag'], [bagThreeColorsDescUK, bagThreeColorsDescEN], 4);
mapToModels('main-bags', 'sub-bags', ['Сумка', 'Bag'], [bagSimpleDescUK, bagSimpleDescEN], 5);
mapToModels('main-bags', 'sub-fanny-packs', ['Бананка', 'Fanny Pack'], [fannyPackLargeDescUK, fannyPackLargeDescEN], 1);

mapToModels('main-accessories', 'sub-wallets', ['Гаманець', 'Wallet'], ['Опис очікуйте найближчим часом...', 'Description will appear shortly...'], 1);

function mapToModels(cat, subcat, name, description, priority){
    models.push({
        category: getObjectId(cat),
        subcategory: getObjectId(subcat),
        name: mapToLanguages(name),
        description: mapToLanguages(description),
        images: mapToImages(name[1]),
        priority: priority,
        show: true
    })
}

module.exports = models;
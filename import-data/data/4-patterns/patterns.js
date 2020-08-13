const { mapToLanguages } = require('../../helpers/languages');
const { mapToImages } = require('../../helpers/images');
const { getObjectId, getObjectIds } = require('mongo-seeding');

let patterns = [];

mapToPatterns('pink-wave', ['Рожева хвилька', 'Pink wave'], ['Фабричний гобелен із зображенням рожевої хвильки', 'Manufactured tapestry with pink wave pattern']);
mapToPatterns('blue-wave', ['Синя хвилька', 'Blue wave'], ['Фабричний гобелен із зображенням синьої хвильки', 'Manufactured tapestry with blue wave pattern']);
mapToPatterns('arrows', ['Стрілки', 'Arrows'], ['Фабричний гобелен із зображенням стрілок', 'Manufactured tapestry with arrow pattern']);
mapToPatterns('blue', ['Синій', 'Blue'], ['Фабричний гобелен із синім визерунком', 'Manufactured tapestry with blue pattern']);
mapToPatterns('black', ['Чорний', 'Black'], ['Фабричний гобелен із чорним визерунком', 'Manufactured tapestry with black pattern']);
mapToPatterns('red', ['Червоний', 'Red'], ['Фабричний гобелен із червоним визерунком', 'Manufactured tapestry with red pattern']);
mapToPatterns('embroidery', ['Вишивка', 'Embroidery'], ['Фабричний гобелен із зображенням вишивки', 'Manufactured tapestry with embroidery pattern']);
mapToPatterns('deers', ['Олені', 'Deers'], ['Фабричний гобелен із зображенням оленів', 'Manufactured tapestry with deer pattern']);
mapToPatterns('people', ['Люди', 'People'], ['Фабричний гобелен із зображенням людей', 'Manufactured tapestry with people pattern']);
mapToPatterns('flowers', ['Квіти', 'Flowers'], ['Фабричний гобелен із зображенням квітів', 'Manufactured tapestry with flower pattern']);

function mapToPatterns(code, name, description){
    patterns.push({
        id: getObjectId(code),
        name: mapToLanguages(name),
        description: mapToLanguages(description),
        images: mapToImages(code),
        material: 'Cotton',
        handmade: false,
        available: true
    })
}

module.exports = patterns;
const { mapToLanguages } = require('../../helpers/languages');
const { mapToImages } = require('../../helpers/images');
const { getObjectId, getObjectIds } = require('mongo-seeding');

const ukDescriptionStub = 'Фабричний гобелен із ';
const enDescriptionStub = 'Manufactured tapestry with ';

const patterns = [
    {
        id: getObjectId('pink-wave'),
        name: mapToLanguages(['Рожева хвилька', 'Pink wave']),
        description: mapToLanguages([ukDescriptionStub.concat('зображенням рожевої хвильки'),
                                    enDescriptionStub.concat('pink wave pattern')]),
        images: mapToImages('pink-wave'),
        material: 'Cotton',
        handmade: false,
        available: true
    },
    {
        id: getObjectId('blue-wave'),
        name: mapToLanguages(['Синя хвилька', 'Blue wave']),
        description: mapToLanguages([ukDescriptionStub.concat('зображенням синьої хвильки'),
                                    enDescriptionStub.concat('blue wave pattern')]),
        images: mapToImages('blue-wave'),
        material: 'Cotton',
        handmade: false,
        available: true
    },
    {
        id: getObjectId('arrows'),
        name: mapToLanguages(['Стрілки', 'Arrows']),
        description: mapToLanguages([ukDescriptionStub.concat('зображенням стрілок'),
                                    enDescriptionStub.concat('arrow pattern')]),
        images: mapToImages('arrows'),
        material: 'Cotton',
        handmade: false,
        available: true
    },
    {
        id: getObjectId('blue'),
        name: mapToLanguages(['Синій', 'Blue']),
        description: mapToLanguages([ukDescriptionStub.concat('синім визерунком'),
                                    enDescriptionStub.concat('blue pattern')]),
        images: mapToImages('blue'),
        material: 'Cotton',
        handmade: false,
        available: true
    },
    {
        id: getObjectId('black'),
        name: mapToLanguages(['Чорний', 'Black']),
        description: mapToLanguages([ukDescriptionStub.concat('чорним визерунком'),
                                    enDescriptionStub.concat('black pattern')]),
        images: mapToImages('black'),
        material: 'Cotton',
        handmade: false,
        available: true
    },
    {
        id: getObjectId('red'),
        name: mapToLanguages(['Червоний', 'Red']),
        description: mapToLanguages([ukDescriptionStub.concat('червоним визерунком'),
                                    enDescriptionStub.concat('red pattern')]),
        images: mapToImages('red'),
        material: 'Cotton',
        handmade: false,
        available: true
    },
    {
        id: getObjectId('embroidery'),
        name: mapToLanguages(['Вишивка', 'Embroidery']),
        description: mapToLanguages([ukDescriptionStub.concat('зображенням вишивки'),
                                    enDescriptionStub.concat('embroidery pattern')]),
        images: mapToImages('embroidery'),
        material: 'Cotton',
        handmade: false,
        available: true
    },
    {
        id: getObjectId('deers'),
        name: mapToLanguages(['Олені', 'Deers']),
        description: mapToLanguages([ukDescriptionStub.concat('зображенням оленів'),
                                    enDescriptionStub.concat('deer pattern')]),
        images: mapToImages('deers'),
        material: 'Cotton',
        handmade: false,
        available: true
    },
    {
        id: getObjectId('people'),
        name: mapToLanguages(['Люди', 'People']),
        description: mapToLanguages([ukDescriptionStub.concat('зображенням людей'),
                                    enDescriptionStub.concat('people pattern')]),
        images: mapToImages('people'),
        material: 'Cotton',
        handmade: false,
        available: true
    },
    {
        id: getObjectId('flowers'),
        name: mapToLanguages(['Квіти', 'Flowers']),
        description: mapToLanguages([ukDescriptionStub.concat('зображенням квітів'),
                                    enDescriptionStub.concat('flower pattern')]),
        images: mapToImages('flowers'),
        material: 'Cotton',
        handmade: false,
        available: true
    }
];

module.exports = patterns;
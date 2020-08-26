const { mapToLanguages } = require('../../helpers/languages');
const { mapToImages } = require('../../helpers/images');
const { getObjectId, getObjectIds } = require('mongo-seeding');

let patterns = [];

mapToPatterns('pink-wave', ['Рожева хвилька', 'Pink wave'], ['Фабричний гобелен із зображенням рожевої хвильки', 'Manufactured tapestry with pink wave pattern'], '335nr4j5dkebkw5cy_pink-wave.jpg');
mapToPatterns('blue-wave', ['Синя хвилька', 'Blue wave'], ['Фабричний гобелен із зображенням синьої хвильки', 'Manufactured tapestry with blue wave pattern'], '335nr4j5dkebkvle7_blue-wave.jpg');
mapToPatterns('blue-pink-wave', ['Синьо-рожева хвилька', 'Blue-pink wave'], ['Фабричний гобелен із зображенням синьо-рожевої хвильки', 'Manufactured tapestry with blue-pink wave pattern'], '335nr431gkebp19ht_blue-pink.jpg');
mapToPatterns('arrows', ['Стрілки', 'Arrows'], ['Фабричний гобелен із зображенням стрілок', 'Manufactured tapestry with arrow pattern'], '335nr4j5dkebkv6hj_arrows.jpg');
mapToPatterns('blue', ['Синій', 'Blue'], ['Фабричний гобелен із синім визерунком', 'Manufactured tapestry with blue pattern'], '335nr4j5dkebkvf6o_blue.jpg');
mapToPatterns('black', ['Чорний', 'Black'], ['Фабричний гобелен із чорним визерунком', 'Manufactured tapestry with black pattern'], '335nr4j5dkebkv6hr_black.jpg');
mapToPatterns('red', ['Червоний', 'Red'], ['Фабричний гобелен із червоним визерунком', 'Manufactured tapestry with red pattern'], '335nr435lkebp5bxe_red.jpg');
mapToPatterns('embroidery', ['Вишивка', 'Embroidery'], ['Фабричний гобелен із зображенням вишивки', 'Manufactured tapestry with embroidery pattern'], '335nr435lkebp2r7d_embroidery.jpg');
mapToPatterns('deers', ['Олені', 'Deers'], ['Фабричний гобелен із зображенням оленів', 'Manufactured tapestry with deer pattern'], '335nr4j5dkebkvleg_deers.jpg');
mapToPatterns('people', ['Люди', 'People'], ['Фабричний гобелен із зображенням людей', 'Manufactured tapestry with people pattern'], '335nr4j5dkebkvzrt_people.jpg');
mapToPatterns('flowers', ['Квіти', 'Flowers'], ['Фабричний гобелен із зображенням квітів', 'Manufactured tapestry with flower pattern'], '335nr4j5dkebkvus7_flowers.jpg');
mapToPatterns('grey-diamonds', ['Сірі ромби', 'Grey diamonds'], ['Фабричний гобелен із зображенням сірих ромбів', 'Manufactured tapestry with grey diamond pattern'], '335nr435lkebp4pbv_grey-diamonds.jpg');
mapToPatterns('green-diamonds', ['Зелені ромби', 'Green diamonds'], ['Фабричний гобелен із зображенням зелених ромбів', 'Manufactured tapestry with green diamond pattern'], '335nr435lkebp3yc5_green-diamonds.jpg');
mapToPatterns('red-diamonds', ['Червоні ромби', 'Red diamonds'], ['Фабричний гобелен із зображенням червоних ромбів', 'Manufactured tapestry with red diamond pattern'], '335nr435lkebp5z0c_red-diamonds.jpg');
mapToPatterns('blue-diamonds', ['Сині ромби', 'Blue diamonds'], ['Фабричний гобелен із зображенням синіх ромбів', 'Manufactured tapestry with blue diamond pattern'], '335nr42zgkeboz0w5_blue-diamonds.jpg');

function mapToPatterns(code, name, description, image){
    patterns.push({
        id: getObjectId(code),
        name: mapToLanguages(name),
        description: mapToLanguages(description),
        images: mapToImages(image),
        material: 'Cotton',
        handmade: false,
        available: true
    })
}

module.exports = patterns;
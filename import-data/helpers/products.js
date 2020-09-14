const { mapToLanguages } = require('./languages');
const { mapToImages } = require('./images');
const { mapToColors } = require('./colors');
const { mapToCurrencies } = require('./currencyset');
const { mapToOptions } = require('./options');
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
} = require('./productDesc');

const fabricDescription = mapToLanguages([
    '100% poliester прошита додатковим шаром спеціального матеріалу, який зміцнює та захищає від води + підкладка + фабричний гобелен',
    '100% poliester padded with a layer of durable and water-resistant material + inner layer + factory-made pattern'
]);

const malmoDescription = mapToLanguages([
    '100% poliester (Malmo) прошита додатковим шаром спеціального матеріалу, який зміцнює та захищає від води + підкладка + фабричний гобелен',
    '100% poliester (Malmo) padded with a layer of durable and water-resistant material + inner layer + factory-made pattern'
]);

const canvasDescription = mapToLanguages([
    'Canvas-400G прошита додатковим шаром спеціального матеріалу, який зміцнює та захищає від води + підкладка',
    'Canvas-400G padded with a layer of durable and water-resistant material + inner layer'
]);

const canvasPatternDescription = mapToLanguages([
    'Canvas-400G прошита додатковим шаром спеціального матеріалу, який зміцнює та захищає від води + підкладка + фабричний гобелен',
    'Canvas-400G padded with a layer of durable and water-resistant material + inner layer + factory-made pattern'
]);

const rolltops = [
    [['Ролтоп червоний 1', 'Rolltop Red 1'], [[205, 'Вишневий', 'Violet-red', 'червоний', 'red']], ['Чорний', 'Black'], 'black', 'black', ['335nr4dqvkebecnuj_27.png', '335nr4dqvkebecnze_28.png', '335nr4dqvkebectld_29.png', '335nr4dqvkebecyfv_30.png', '335nr4dqvkebed33u_31.png', '335nr4dqvkebed7z1_32.jpg', '335nr4dqvkebedcvy_33.jpg', '335nr4dqvkebedpt3_34.jpg', '335nr4dqvkebedzp1_35.jpg', '335nr4dqvkebeeatg_36.jpg']],
    [['Ролтоп сірий 1', 'Rolltop Grey 1'], [[212, 'Срібний', 'Silver', 'сірий', 'grey']], ['Вишивка', 'Embroidery'], 'embroidery', 'black', ['335nr4ek4kebfcavm_70.png', '335nr4ek4kebfcbae_71.png', '335nr4ek4kebfcgue_72.png', '335nr4ek4kebfcmba_73.png', '335nr4ek4kebfcr44_74.png', '335nr4ek4kebfcvu1_75.jpg', '335nr4ek4kebfd0qo_76.jpg', '335nr4ek4kebfdewo_77.jpg', '335nr4ek4kebfdre4_78.jpg']],
    [['Ролтоп рожевий 1', 'Rolltop Pink 1'], [[204, 'Світло-рожевий', 'Light-pink', 'рожевий', 'pink']], ['Вишивка', 'Embroidery'], 'embroidery', 'pink', ['335nr4e1gkebesgxb_79.png', '335nr4e1gkebesh7c_80.png', '335nr4e1gkebesmn7_81.png', '335nr4e1gkebestmp_82.png', '335nr4e1gkebesyqv_83.png', '335nr4e1gkebet3se_84.jpg', '335nr4e1gkebet8nl_85.jpg', '335nr4e1gkebetlxn_86.jpg', '335nr4e1gkebeu0v1_87.jpg', '335nr4e1gkebeud5i_88.jpg', '335nr4e1gkebeuqa7_89.jpg']],
    [['Ролтоп синій 1', 'Rolltop Blue 1'], [[309, 'Королівський синій', 'Royal-blue', 'синій', 'blue']], ['Стрілки', 'Arrows'], 'arrows', 'black', ['335nr4bmtkebc3u7t_37.png', '335nr4bmtkebc3upv_38.png', '335nr4bmtkebc40zf_39.png', '335nr4bmtkebc466e_40.png', '335nr4bmtkebc4bcw_41.png', '335nr4bmtkebc4gm6_42.jpg', '335nr4bmtkebc4lrv_43.jpg', '335nr4bmtkebc6afu_44.jpg', '335nr4bmtkebc6km7_45.jpg']],
    [['Ролтоп жовтий 1', 'Rolltop Yellow 1'], [[206, 'Золотий', 'Golden', 'жовтий', 'yellow']], ['Квіти', 'Flowers'], 'flowers', 'brown', ['335nr4d20kebdojum_53.png', '335nr4d20kebdok1t_54.png', '335nr4d20kebdopdw_55.png', '335nr4d20kebdouly_57.png', '335nr4d20kebdoz9v_58.jpg', '335nr4d20kebdp40b_60.jpg']],
    [['Ролтоп жовтий 2', 'Rolltop Yellow 2'], [[206, 'Золотий', 'Golden', 'жовтий', 'yellow']], ['Олені', 'Deers'], 'deers', 'brown', ['335nr49rckeba7th0_19.png', '335nr49rckeba7tqy_20.png', '335nr49rckeba80my_21.png', '335nr49rckeba87ql_22.png', '335nr49rckeba8cjp_23.png', '335nr49rckeba8h4q_24.jpg', '335nr49rckeba8me0_25.jpg', '335nr49rckeba9rms_26.jpg']],
    [['Ролтоп чорний 1', 'Rolltop Black 1'], [[215, 'Темно-сірий', 'Dark-grey', 'сірий', 'grey']], ['Сірі ромби', 'Grey diamonds'], 'black', 'black', ['335nr4f35kebfxow4_1.png', '335nr4f35kebfxp2b_2.png', '335nr4f35kebfxubm_3.png', '335nr4f35kebfxzi5_4.png', '335nr4f35kebfy3ua_5.jpg', '335nr4f35kebfy8bp_6.jpg', '335nr4f35kebfylbb_7.jpg']],
    [['Ролтоп оливковий 1', 'Rolltop Olive 1'], [[314, 'Темний хакі', 'Dark-khaki', 'зелений', 'green']], ['Чорний', 'Black'], 'black', 'black', ['335nr4ctikebdd2hg_46.png', '335nr4ctikebdd2s5_47.png', '335nr4ctikebdd876_48.png', '335nr4ctikebddd64_49.png', '335nr4ctikebddhta_50.png', '335nr4ctikebddmjf_52.jpg']],
];
const rolltopNumber = rolltops.length;

const news = [
    [['Новий червоний 1', 'New Red 1'], [[205, 'Вишневий', 'Violet-red', 'червоний', 'red']], ['Чорний', 'Black'], 'black', 'black2', ['335nr4fwekebgzp06_90.png', '335nr4fwekebgzp7b_91.png', '335nr4fwekebgzuys_92.png', '335nr4fwekebh00ep_93.png', '335nr4fwekebh05gn_94.png', '335nr4fwekebh0a75_95.jpg', '335nr4fwekebh0f82_96.jpg', '335nr4fwekebh1jqt_IMG_0224.jpg', '335nr4fwekebh37xp_IMG_0227.jpg']],
    [['Новий жовтий 1', 'New Yellow 1'], [[206, 'Золотий', 'Golden', 'жовтий', 'yellow']], ['Синій', 'Blue'], 'blue', 'black2', ['335nr4gfjkebhks7l_119.png', '335nr4gfjkebhksnw_120.png', '335nr4gfjkebhkxwv_121.png', '335nr4gfjkebhl5il_122.png', '335nr4gfjkebhlaho_123.png', '335nr4gfjkebhlfi7_124.png', '335nr4gfjkebhlk6e_125.png', '335nr4guckebhvsmw_126.jpg', '335nr4guckebhvsvb_127.jpg', '335nr4guckebhw7ub_128.jpg', '335nr4guckebhwjtv_129.jpg', '335nr4guckebhwvv4_130.jpg', '335nr4guckebhx7s4_131.jpg', '335nr4guckebhxnbv_132.jpg']],
    [['Новий червоний 2', 'New Red 2'], [[205, 'Вишневий', 'Violet-red', 'червоний', 'red']], ['Олені', 'Deers'], 'deers', 'black2', ['335nr4h2gkebi9zm2_103.png', '335nr4h2gkebi9zut_104.png', '335nr4h2gkebia59w_105.png', '335nr4h2gkebiaadc_106.png', '335nr4h2gkebiafko_107.png', '335nr4h2gkebiakrv_108.jpg', '335nr4h2gkebiapt1_109.jpg', '335nr4h2gkebib2zj_110.jpg']],
];
const newsNumber = news.length;

const harbuz = [
    [['Гарбуз коричневий', 'Harbuz Brown'], [[206, 'Золотий', 'Golden', 'жовтий', 'yellow'], [200, 'Світло-коричневий', 'Light-brown', 'коричневий', 'brown']], [], '', 'black', ['335nr4hiekebio8km_137.png', '335nr4hiekebio8xg_138.png', '335nr4hiekebioehd_139.png', '335nr4hiekebion8o_140.png', '335nr4hiekebioryd_141.png', '335nr4hiekebiowqk_142.jpg', '335nr4hiekebip1kc_143.jpg', '335nr4hiekebipfn9_144.jpg', '335nr4hiekebipsm2_145.jpg']],
];
const harbuzNumber = harbuz.length;

const bags = [
    [['Сумка з гобеленом', 'Bag with a Pattern'], [[200, 'Світло-коричневий', 'Light-brown', 'коричневий', 'brown']], ['Люди', 'People'], 'people', 'black2', ['335nr4hvwkebjt0zp_97.png', '335nr4hvwkebjt1cg_98.png', '335nr4hvwkebjt6xk_99.png', '335nr4hvwkebjtbqm_100.jpg', '335nr4hvwkebjtge6_101.jpg', '335nr4hvwkebjtsou_102.jpg']],
    [['Сумка з гобеленом синя', 'Bag with a Pattern Blue'], [[209, 'Сталево-блакитний', 'Steel-blue', 'синій', 'blue']], ['Олені', 'Deers'], 'deers', 'black2', ['335nr4ijbkebk0m7o_111.png', '335nr4ijbkebk0mhm_112.png', '335nr4ijbkebk0rww_113.png', '335nr4ijbkebk0wqp_114.jpg', '335nr4ijbkebk119l_115.jpg', '335nr4ijbkebk1apk_116.jpg', '335nr4ijbkebk1lpz_117.jpg', '335nr4ijbkebk1wxm_118.jpg']],
    [['Сумка синя', 'Bag Blue'], [[209, 'Сталево-блакитний', 'Steel-blue', 'синій', 'blue']], [], '', 'black2'],
    [['Сумка "Три кольори"', 'Three Color Bag'], [[211, 'Світло-сірий', 'Light-grey', 'сірий', 'grey'], [213, 'Сизий', 'Slate-grey', 'сірий', 'grey'], [215, 'Темно-сірий', 'Dark-grey', 'сірий', 'grey']], [], '', 'black2'],
    [['Сумка', 'Bag'], [[211, 'Світло-сірий', 'Light-grey', 'сірий', 'grey']], [], '', 'black2'],
];
const bagsNumber = bags.length;

const fannyPacks = [
    [['Бананка гірчична', 'Fanny Pack Mustard'], [[206, 'Золотий', 'Golden', 'жовтий', 'yellow']], ['Квіти', 'Flowers'], 'flowers', ''],
    [['Бананка червона', 'Fanny Pack Red'], [[205, 'Вишневий', 'Violet-red', 'червоний', 'red']], ['Червоний', 'Red'], 'red', ''],
    [['Бананка синя', 'Fanny Pack Blue'], [[209, 'Сталево-блакитний', 'Steel-blue', 'синій', 'blue']], ['Стрілки', 'Arrows'], 'arrows', ''],
    [['Бананка рожева', 'Fanny Pack Pink'], [[204, 'Світло-рожевий', 'Light-pink', 'рожевий', 'pink']], ['Вишивка', 'Embroidery'], 'embroidery', ''],
    [['Бананка зелена', 'Fanny Pack Green'], [[207, 'Темно-оливковий', 'Dark-olive', 'зелений', 'green']], ['Чорний', 'Black'], 'black', ''],
    [['Бананка асфальтна', 'Fanny Pack Slate Grey'], [[212, 'Срібний', 'Silver', 'сірий', 'grey']], ['Чорний', 'Black'], 'black', ''],
];
const fannyPacksNumber = fannyPacks.length;

const wallets = [
    [['Гаманець гірчичний', 'Wallet Mustard'], [[206, 'Золотий', 'Golden', 'жовтий', 'yellow']], ['Квіти', 'Flowers'], 'flowers', ''],
    [['Гаманець червоний', 'Wallet Red'], [[205, 'Вишневий', 'Violet-red', 'червоний', 'red']], ['Червоний', 'Red'], 'red', ''],
    [['Гаманець синій', 'Wallet Blue'], [[209, 'Сталево-блакитний', 'Steel-blue', 'синій', 'blue']], ['Стрілки', 'Arrows'], 'arrows', ''],
    [['Гаманець рожевий', 'Wallet Pink'], [[204, 'Світло-рожевий', 'Light-pink', 'рожевий', 'pink']], ['Вишивка', 'Embroidery'], 'embroidery', ''],
    [['Гаманець зелений', 'Wallet Green'], [[207, 'Темно-оливковий', 'Dark-olive', 'зелений', 'green']], ['Чорний', 'Black'], 'black', ''],
    [['Гаманець асфальтний', 'Wallet Slate Grey'], [[212, 'Срібний', 'Silver', 'сірий', 'grey']], ['Чорний', 'Black'], 'black', ''],
];
const walletsNumber = wallets.length;

let products = [];
let counter = 0;
let oldTotalProducts = 0;
let newTotalProducts = 0;
let pattern;
let patternImages;
let strapLengthInCm;
let innerMaterial;
let mainMaterial;
let closure;
let closureColor;
let model;

newTotalProducts += rolltopNumber;
while (counter < newTotalProducts){
    mapProduct('main-backpacks', 'sub-backpacks', 'rolltop', counter, rolltops[counter - oldTotalProducts], rolltopDescUK, rolltopDescEN, 145000);
    counter++
}

oldTotalProducts = newTotalProducts;
newTotalProducts += newsNumber;
while (counter < newTotalProducts){
    mapProduct('main-backpacks', 'sub-backpacks', 'new', counter, news[counter - oldTotalProducts], newDescUK, newDescEN, 165000);
    counter++
}

oldTotalProducts = newTotalProducts;
newTotalProducts += harbuzNumber;
while (counter < newTotalProducts){
    mapProduct('main-backpacks', 'sub-backpacks', 'harbuz', counter, harbuz[counter - oldTotalProducts], harbuzDescUK, harbuzDescEN, 155000);
    counter++
}

oldTotalProducts = newTotalProducts;
newTotalProducts += bagsNumber;
mapProduct('main-bags', 'sub-bags', 'patbag', counter, bags[0], bagWithPatternDescUK, bagWithPatternDescEN, 90000);
mapProduct('main-bags', 'sub-bags', 'patbag', counter + 1, bags[1], bagWithPatternDescUK, bagWithPatternDescEN, 90000);
mapProduct('main-bags', 'sub-bags', 'col1bag', counter + 2, bags[2], bagOneColorDescUK, bagOneColorDescEN, 90000);
mapProduct('main-bags', 'sub-bags', 'col3smplbag', counter + 3, bags[3], bagThreeColorsDescUK, bagThreeColorsDescEN, 90000);
mapProduct('main-bags', 'sub-bags', 'col3smplbag', counter + 4, bags[4], bagSimpleDescUK, bagSimpleDescEN, 95000);
counter += bagsNumber;

oldTotalProducts = newTotalProducts;
newTotalProducts += fannyPacksNumber;
while (counter < newTotalProducts){
    mapProduct('main-bags', 'sub-fanny-packs', 'fanny-pack', counter, fannyPacks[counter - oldTotalProducts], fannyPackLargeDescUK, fannyPackLargeDescEN, 50000);
    counter++
}

oldTotalProducts = newTotalProducts;
newTotalProducts += walletsNumber;
while (counter < newTotalProducts){
    mapProduct('main-accessories', 'sub-wallets', 'wallet', counter, wallets[counter - oldTotalProducts], 'Опис очікуйте найближчим часом...', 'Description will appear shortly...', 20000);
    counter++
}

function mapProduct(cat, subcat, name, i, product, descUK, descEN, price) {
    model = [product[0][0].split(' ')[0], product[0][1].split(' ')[0]];
    model = (model[0] === 'Сумка') ? [product[0][0], product[0][1]] : model;
    model = (name === 'patbag') ? ['Сумка з гобеленом', 'Bag with a Pattern'] : model;
    model = (name === 'col1bag') ? ['Сумка одноколірна', 'One Color Bag'] : model;
    model = (name === 'fanny-pack') ? ['Бананка', 'Fanny Pack'] : model;
    pattern = (product[2].length === 0) ? mapToLanguages(['Немає', 'None']) : mapToLanguages(product[2]);
    patternImages = (product[3] === '') ? null : mapToImages(product[3]);
    strapLengthInCm = 0;
    innerMaterial = [];
    closure = [];
    closureColor = ''
    if (model[1] === 'Rolltop' || model[1] === 'New' || model[1] === 'Harbuz') {
        strapLengthInCm = 100;
        innerMaterial = mapToLanguages(['Oxford 135', 'Oxford 135']);
        mainMaterial = fabricDescription;
        closure = mapToLanguages(['Фастекс (пластикова защіпка)', 'Plastic closure']);
        closureColor = 'black'
    } else if (model[1] === 'Fanny Pack' || model[1] === 'Wallet') {
        mainMaterial = malmoDescription;
    } else {
        mainMaterial = (product[2].length === 0) ? canvasDescription : canvasPatternDescription;
    }
    products.push({
        id: getObjectId('product' + i),
        category: getObjectId(cat),
        subcategory: getObjectId(subcat),
        model: mapToLanguages([model[0], model[1]]),
        name: mapToLanguages([product[0][0], product[0][1]]),
        description: mapToLanguages([descUK, descEN]),
        mainMaterial: mainMaterial,
        innerMaterial: innerMaterial,
        strapLengthInCm: strapLengthInCm,
        images: {
            primary: mapToImages('primary_' + i),
            additional: []
        },
        colors: mapToColors(product[1]),
        pattern: pattern,
        patternImages: patternImages,
        closure: closure,
        closureColor: closureColor,
        basePrice: mapToCurrencies(price),
        options: mapToOptions(name, product[4])
    })
    if (product[5] !== undefined) {
        products[i].images.primary = mapToImages(product[5][0]);
        for (let j = 1; j < product[5].length; j++){
            products[i].images.additional[j-1] = mapToImages(product[5][j]);
        }
    }
}


// const products = [{
//     id: getObjectId('product' + 9),
//     category: getObjectId('sub-fanny-packs'),
//     name: mapToLanguages(['Бананка маленька', 'Fanny pack small']),
//     description: mapToLanguages([fannyPackSmallDescUK, fannyPackSmallDescEN]),
//     images: {
//         primary: mapToImages('primary-fanny-pack-small'),
//         additional: [
//             mapToImages('additional-fanny-pack-small-1'),
//             mapToImages('additional-fanny-pack-small-2'),
//             mapToImages('additional-fanny-pack-small-3')
//         ]
//     },
//     basePrice: 400,
//     items: mapToItems('fanny-pack', [[10, 20]], 'malmo', 400, 10)
// }];

module.exports = products;
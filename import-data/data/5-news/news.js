const fs = require('fs');
const path = require('path');
const { mapToLanguages } = require('../../helpers/languages');

const article1UK = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'article1UK.html'), 'utf8');
const article1EN = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'article1EN.html'), 'utf8');
const article2UK = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'article2UK.html'), 'utf8');
const article2EN = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'article2EN.html'), 'utf8');
const article3UK = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'article3UK.html'), 'utf8');
const article3EN = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'article3EN.html'), 'utf8');

const news = [
    {
        title: mapToLanguages(['Модні новинки сумок на сезон осінь-зима 2019-2020',
                                'Fasionable new bags for fall-winter 2019-2020 season']),
        text: mapToLanguages([article1UK, article1EN]),
        images: {
            primary: { medium: 'https://ukr.media/static/ba/aimg/3/9/3/393626_1.jpg' },
            additional: [
                { medium: 'https://ukr.media/static/ba/aimg/3/9/3/393626_3.jpg' },
                { medium: 'https://ukr.media/static/ba/aimg/3/9/3/393626_4.jpg' },
                { medium: 'https://ukr.media/static/ba/aimg/3/9/3/393626_5.jpg' }
            ]
        },
        video: 'https://www.youtube.com/embed/maP6Daq83fM',
        author: {
            name: mapToLanguages(['Данута Ланська', 'Danuta Lanska']),
            image: { small: 'https://ukr.media/static/ba/aimg/4/1/7/417067_0.jpg' },
        },
        date: new Date('2019-08-14T23:10:38Z'),
    },
    {
        title: mapToLanguages(['Що носити модницям влітку 2020: добірка трендових сумок для спекотного сезону',
                                'A selection of trendy bags for the hot season of summer 2020']),
        text: mapToLanguages([article2UK, article2EN]),
        images: {
            primary: { medium: 'https://s.032.ua/section/newsInternalIcon/upload/images/news/icon/000/052/185/trendi-lita-golovna_5edf9266621db.jpg' },
            additional: [
                { medium: 'https://s.032.ua/section/newsInText/upload/images/news/intext/000/052/185/solomani_5edf8e4b209ed.jpg' },
                { medium: 'https://s.032.ua/section/newsInText/upload/images/news/intext/000/052/185/11_5edf8f3209c11.jpg' },
                { medium: 'https://s.032.ua/section/newsInText/upload/images/news/intext/000/052/185/cepki_5edf8fffc7403.jpg' },
                { medium: 'https://s.032.ua/section/newsInText/upload/images/news/intext/000/052/185/ertfg4_5edf90563e5b1.jpg' },
                { medium: 'https://s.032.ua/section/newsInText/upload/images/news/intext/000/052/185/9_5edf90b4381c8.jpg' },
                { medium: 'https://s.032.ua/section/newsInText/upload/images/news/intext/000/052/185/11_5edf9163c6237.jpg' },
                { medium: 'https://s.032.ua/section/newsInText/upload/images/news/intext/000/052/185/7_5edf942a343c8.jpg' }
            ]
        },
        video: 'https://www.youtube.com/embed/VGqZMqMGjgA',
        author: {
            name: mapToLanguages(['Марія Нашова', 'Mariya Nashova']),
            image: { small: 'https://s.032.ua/section/userphoto/upload/managers/photos/000/051/775/866162337758924195687066424348618920034304n_5e4a57bc8f345.jpg' },
        },
        date: new Date('2020-06-01T13:55:02Z'),
    },
    {
        title: mapToLanguages(['Аксесуар на пояс, зручна сумка, стильна штучка!',
                                'Belt accessory, comfortable bag, stylish thingy!']),
        text: mapToLanguages([article3UK, article3EN]),
        images: {
            primary: { medium: 'https://images.stylight.net/image/upload/t_web_post_500x667/q_auto,f_auto/post-c27c63a5b58deb0d4535ddd5993e68b2e4d0776d756fdc41c0f7c391.jpg' },
            additional: [
                { small: 'https://intersumka.ua/image/catalog/_all/banan2.jpg' },
                { small: 'https://intersumka.ua/image/catalog/_all/banan3.jpg' }
            ]
        },
        video: 'https://www.youtube.com/embed/Y7L_gvaGfx0',
        author: {
            name: mapToLanguages(['Денис Когут', 'Denys Kogut']),
            image: { small: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
        },
        date: new Date('2020-02-23T17:10:46Z'),
    }
];

module.exports = news;
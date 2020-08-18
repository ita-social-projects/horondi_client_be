const fs = require('fs');
const path = require('path');
const { mapToLanguages } = require('../../helpers/languages');

const articlePath = path.join(__dirname, '..', '..', 'src');

const news = [
    {
        title: mapToLanguages(['Модні новинки сумок на сезон осінь-зима 2019-2020',
                'Fasionable new bags for fall-winter 2019-2020 season']),
        text: mapToLanguages([fs.readFileSync(path.join(articlePath, 'article1UK.html'), 'utf8').split('\n').join(''),
                fs.readFileSync(path.join(articlePath, 'article1EN.html'), 'utf8').split('\n').join('')]),
        images: {
            primary: { medium: 'https://ukr.media/static/ba/aimg/3/9/3/393626_1.jpg' },
            additional: [
                { medium: 'https://ukr.media/static/ba/aimg/3/9/3/393626_3.jpg' },
                { medium: 'https://ukr.media/static/ba/aimg/3/9/3/393626_4.jpg' },
                { medium: 'https://ukr.media/static/ba/aimg/3/9/3/393626_5.jpg' }
            ]
        },
        author: {
            name: mapToLanguages(['Данута Ланська', 'Danuta Lanska']),
            image: { small: 'https://ukr.media/static/ba/aimg/4/1/7/417067_0.jpg' },
        },
        date: new Date('2019-08-14T23:10:38Z'),
        show: true,
        languages: ['uk', 'en']
    },
    {
        title: mapToLanguages(['Що носити модницям влітку 2020: добірка трендових сумок для спекотного сезону',
                'A selection of trendy bags for the hot season of summer 2020']),
        text: mapToLanguages([fs.readFileSync(path.join(articlePath, 'article2UK.html'), 'utf8').split('\n').join(''),
                fs.readFileSync(path.join(articlePath, 'article2EN.html'), 'utf8').split('\n').join('')]),
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
        author: {
            name: mapToLanguages(['Марія Нашова', 'Mariya Nashova']),
            image: { small: 'https://s.032.ua/section/userphoto/upload/managers/photos/000/051/775/866162337758924195687066424348618920034304n_5e4a57bc8f345.jpg' },
        },
        date: new Date('2020-06-01T13:55:02Z'),
        show: true,
        languages: ['uk', 'en']
    },
    {
        title: mapToLanguages(['Аксесуар на пояс, зручна сумка, стильна штучка!',
                'Belt accessory, comfortable bag, stylish thingy!']),
        text: mapToLanguages([fs.readFileSync(path.join(articlePath, 'article3UK.html'), 'utf8').split('\n').join(''),
                fs.readFileSync(path.join(articlePath, 'article3EN.html'), 'utf8').split('\n').join('')]),
        images: {
            primary: { medium: 'https://images.stylight.net/image/upload/t_web_post_500x667/q_auto,f_auto/post-c27c63a5b58deb0d4535ddd5993e68b2e4d0776d756fdc41c0f7c391.jpg' },
            additional: [
                { small: 'https://intersumka.ua/image/catalog/_all/banan2.jpg' },
                { small: 'https://intersumka.ua/image/catalog/_all/banan3.jpg' }
            ]
        },
        author: {
            name: mapToLanguages(['Денис Когут', 'Denys Kogut']),
            image: { small: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
        },
        date: new Date('2020-02-23T17:10:46Z'),
        show: true,
        languages: ['uk', 'en']
    },
    {
        title: mapToLanguages(['Даруємо знижку - 10%', null]),
        text: mapToLanguages([fs.readFileSync(path.join(articlePath, 'article4UK.html'), 'utf8').split('\n').join(''),
                null]),
        images: {
            primary: { medium: 'https://scontent.fiev1-1.fna.fbcdn.net/v/t1.0-9/116838241_3017994774993868_611054070321174116_n.jpg?_nc_cat=105&_nc_sid=8bfeb9&_nc_ohc=c3GKqEaSnl4AX-JmVIC&_nc_ht=scontent.fiev1-1.fna&oh=bb7d22b5287e3d59d99df7341f29d7f2&oe=5F534DDD' },
            additional: []
        },
        author: {
            name: mapToLanguages(['Горонді', 'Horondi']),
            image: { small: 'https://scontent.fiev1-1.fna.fbcdn.net/v/t1.0-1/p148x148/70185999_2269139786546041_1214757974128459776_o.png?_nc_cat=109&_nc_sid=1eb0c7&_nc_ohc=yhpVEU0rep8AX8IyGUG&_nc_oc=AQlqGh37cAVcZbcz6VKWShS0nbnApzfMDKQtWrcKpBYGXoj20RumzX8zuL4p2C1lY5U&_nc_ht=scontent.fiev1-1.fna&oh=0c41615ad374c216c9a6188d2e4e67c8&oe=5F52785E' },
        },
        date: new Date('2020-08-01T08:53:18Z'),
        show: true,
        languages: ['uk']
    },
    {
        title: mapToLanguages([null, 'Delivery to the EU now available']),
        text: mapToLanguages([null,
                fs.readFileSync(path.join(articlePath, 'article5EN.html'), 'utf8').split('\n').join('')]),
        images: {
            primary: { medium: 'https://scontent.fiev1-1.fna.fbcdn.net/v/t1.0-0/p526x296/110127144_2991586697634676_6284799529819342098_o.jpg?_nc_cat=100&_nc_sid=730e14&_nc_ohc=mVoXJ6ASDcQAX-FIdmp&_nc_ht=scontent.fiev1-1.fna&_nc_tp=6&oh=8b209139dda9781126f7020998b76e0a&oe=5F5149EC' },
            additional: []
        },
        author: {
            name: mapToLanguages(['Горонді', 'Horondi']),
            image: { small: 'https://scontent.fiev1-1.fna.fbcdn.net/v/t1.0-1/p148x148/70185999_2269139786546041_1214757974128459776_o.png?_nc_cat=109&_nc_sid=1eb0c7&_nc_ohc=yhpVEU0rep8AX8IyGUG&_nc_oc=AQlqGh37cAVcZbcz6VKWShS0nbnApzfMDKQtWrcKpBYGXoj20RumzX8zuL4p2C1lY5U&_nc_ht=scontent.fiev1-1.fna&oh=0c41615ad374c216c9a6188d2e4e67c8&oe=5F52785E' },
        },
        date: new Date('2019-11-15T11:32:03Z'),
        show: true,
        languages: ['en']
    }
];

module.exports = news;
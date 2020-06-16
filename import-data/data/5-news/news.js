const { mapToLanguages } = require('../../helpers/languages');
const { ukArticles, enArticles } = require('../../helpers/articles');

const news = [
    {
        title: mapToLanguages(['Модні новинки сумок на сезон осінь-зима 2019-2020',
                                'Fasionable new bags for fall-winter 2019-2020 season']),
        text: mapToLanguages([ukArticles[0], enArticles[0]]),
        images: {
            primary: { medium: 'https://ukr.media/static/ba/aimg/3/9/3/393626_1.jpg' },
            additional: [
                { medium: 'https://ukr.media/static/ba/aimg/3/9/3/393626_3.jpg' },
                { medium: 'https://ukr.media/static/ba/aimg/3/9/3/393626_4.jpg' },
                { medium: 'https://ukr.media/static/ba/aimg/3/9/3/393626_5.jpg' }
            ]
        },
        video: String,
        author: {
            name: 'Danuta Lanska',
            image: { small: 'https://ukr.media/static/ba/aimg/4/1/7/417067_0.jpg' },
        },
        date: '2019-08-04T23:10:88',
    }
];

module.exports = news;
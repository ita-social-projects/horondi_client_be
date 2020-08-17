const { mapToImages } = require('../../helpers/images');
const { mapToLanguages } = require('../../helpers/languages');
const { getObjectId, getObjectIds } = require('mongo-seeding');

const contacts = [{
  phoneNumber: 380961737361,
  openHours: mapToLanguages(['Пн: 09:00 - 17:00|Вт: 09:00 - 18:00|Ср: 09:00 - 18:00|Чт: 09:00 - 18:00|Пт: 09:00 - 18:00|Сб: Вихідний|Нд: Вихідний',
        'Mon: 9 a.m. - 5 p.m.|Tue: 9 a.m. - 6 p.m.|Wed: 9 a.m. - 6 p.m.|Thu: 9 a.m. - 6 p.m.|Fri: 9 a.m. - 6 p.m.|Sat: Closed|Sun: Closed']),
  address: mapToLanguages(['<p>Львів 79000</p><p>вул. Угорська, 2</p>',
          '<p>Lviv 79000</p><p>2 Uhorska Str.</p>']),
  email: 'horondi@gmail.com',
  images: [{
    lang: 'uk',
    value: mapToImages('map-u'),
  }, {
    lang: 'en',
    value: mapToImages('map-e'),
  }],
  link: "https://www.google.com.ua/maps/place/Uhorska+St,+2,+L'viv,+L'vivs'ka+oblast,+79000/@49.8130011,24.0348852,17z/data=!3m1!4b1!4m5!3m4!1s0x473ae7fa9be7c3b5:0xb30b2516d705bae6!8m2!3d49.8130011!4d24.0370739"
}];

module.exports = contacts;
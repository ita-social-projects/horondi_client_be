const { mapToImages } = require('../../helpers/images');
const { mapToLanguages } = require('../../helpers/languages');

const contacts = [{
  phoneNumber: 380961737361,
  openHours: mapToLanguages(['Пн: 10:00 - 19:00|Вт: 10:00 - 19:00|Ср: 10:00 - 19:00|Чт: 10:00 - 19:00|Пт: 10:00 - 19:00|Сб: Вихідний|Нд: Вихідний',
        'Mon: 10 a.m. - 7 p.m.|Tue: 10 a.m. - 7 p.m.|Wed: 10 a.m. - 7 p.m.|Thu: 10 a.m. - 7 p.m.|Fri: 10 a.m. - 7 p.m.|Sat: Closed|Sun: Closed']),
  address: mapToLanguages(['<p>Львів</p><p>вул. Угорська, 2</p>',
          '<p>Lviv</p><p>2 Uhorska Str.</p>']),
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
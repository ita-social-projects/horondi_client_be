const fs = require('fs');
const path = require('path');
const { mapToLanguages } = require('../../helpers/languages');

const srcPath = path.join(__dirname, '..', '..', 'src');

const aboutUsUK = fs.readFileSync(path.join(srcPath, 'aboutUsUK.html'), 'utf8');
const aboutUsEN = fs.readFileSync(path.join(srcPath, 'aboutUsEN.html'), 'utf8');

const aboutTexts = [
    {
        categoryCode: 'about-us',
        title: mapToLanguages(['Про нас', 'About Us']),
        text: mapToLanguages([aboutUsUK, aboutUsEN]),
        date: new Date(),
    },
    {
        categoryCode: 'terms-and-conditions',
        title: mapToLanguages(['Умови', 'Terms and Conditions']),
        text: mapToLanguages([' ', ' ']),
        date: new Date(),
    },
    {
        categoryCode: 'payment-and-shipping',
        title: mapToLanguages(['Оплата і доставка', 'Payment and Shipping']),
        text: mapToLanguages([' ', ' ']),
        date: new Date(),
    },
    {
        categoryCode: 'contacts',
        title: mapToLanguages(['Контакти', 'Contacts']),
        text: mapToLanguages([' ', ' ']),
        date: new Date(),
    }
];

module.exports = aboutTexts;
const fs = require('fs');
const path = require('path');
const { mapToLanguages } = require('../../helpers/languages');

const srcPath = path.join(__dirname, '..', '..', 'src');

const aboutTexts = [
    {
        code: 'about-us',
        title: mapToLanguages(['Про нас', 'About Us']),
        text: mapToLanguages([fs.readFileSync(path.join(srcPath, 'aboutUsUK.html'), 'utf8').split('\n').join(''),
                fs.readFileSync(path.join(srcPath, 'aboutUsEN.html'), 'utf8').split('\n').join('')]),
        date: new Date(),
    },
    {
        code: 'terms-and-conditions',
        title: mapToLanguages(['Умови', 'Terms and Conditions']),
        text: mapToLanguages(['Умови очікуйте найближчим часом...', 'Terms and Conditions will appear shortly...']),
        date: new Date(),
    },
    {
        code: 'payment-and-shipping',
        title: mapToLanguages(['Оплата і доставка', 'Payment and Shipping']),
        text: mapToLanguages(['Оплату і доставку очікуйте найближчим часом...', 'Payment and Shipping will appear shortly...']),
        date: new Date(),
    },
    {
        code: 'contacts',
        title: mapToLanguages(['Контакти', 'Contacts']),
        text: mapToLanguages(['Контакти очікуйте найближчим часом...', 'Contacts will appear shortly...']),
        date: new Date(),
    }
];

module.exports = aboutTexts;
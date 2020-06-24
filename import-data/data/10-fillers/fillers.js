const { mapToLanguages } = require('../../helpers/languages');

const fillers = [{
    page: 'registration',
    heading: mapToLanguages(['Реєстрація', 'Registration']),
    buttons: [{
            name: 'signin',
            text: mapToLanguages(['Увійти', 'Sign in'])
        }, {
            name: 'forgot',
            text: mapToLanguages(['Забув пароль?', 'Forgot password?'])
    }],
    placeholders: [{
            name: 'firstname',
            text: mapToLanguages(['Введіть ім’я', 'Enter firstname'])
        }, {
            name: 'lastname',
            text: mapToLanguages(['Введіть прізвище', 'Enter lastname'])
        }, {
            name: 'email',
            text: mapToLanguages(['Введіть емейл*', 'Enter email*'])
        }, {
            name: 'password',
            text: mapToLanguages(['Введіть пароль*', 'Enter password*'])
        }, {
            name: 'confirm',
            text: mapToLanguages(['Підтвердіть пароль', 'Confirm password'])
    }],
    errors: [{
            name: 'firstname',
            text: mapToLanguages(['Будь-ласка введіть ім’я', 'Please enter firstname'])
        }, {
            name: 'lastname',
            text: mapToLanguages(['Будь-ласка введіть прізвище', 'Please enter lastname'])
        }, {
            name: 'email',
            text: mapToLanguages(['Будь-ласка введіть емейл', 'Please enter email'])
        }, {
            name: 'password',
            text: mapToLanguages(['Будь-ласка введіть пароль', 'Please enter password'])
        }, {
            name: 'confirm',
            text: mapToLanguages(['Будь-ласка підтвердіть пароль', 'Please confirm password'])
    }]
}, {
    page: 'news',
    heading: mapToLanguages(['Новини', 'News']),
    regionOptions: [{
            name: 'date',
            text: mapToLanguages(['ukr-UA', 'en-US'])
    }],
    buttons: [{
            name: 'readmore',
            text: mapToLanguages(['читати далі', 'read more...'])
    }],
    errors: [{
            name: 'title',
            text: mapToLanguages(['Назва не вказана', 'No title provided'])
        }, {
            name: 'image',
            text: mapToLanguages(['Зображення немає', 'No image provided'])
        }, {
            name: 'text',
            text: mapToLanguages(['Тексту статті немає', 'No text provided'])
        }, {
            name: 'author',
            text: mapToLanguages(['Автор не вказаний', 'No author provided'])
    }]
}];

module.exports = fillers;
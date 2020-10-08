const fs = require('fs');
const path = require('path');

function generateFirstName() {
    const namesFromFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'names.txt'), 'utf8');
    const names = namesFromFile.split('\n')
                .map( line => line.split(' ')[0])
                .map( word => word.slice(0,1).toUpperCase() + word.slice(1).toLowerCase());
    const namesNumber = names.length;

    return names[Math.floor((Math.random() * namesNumber))];
}

function generateLastName() {
    const surnamesFromFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'surnames.txt'), 'utf8');
    const surnames = surnamesFromFile.split('\n')
                .map( line => line.trim());
    const surnamesNumber = surnames.length;

    return surnames[Math.floor((Math.random() * surnamesNumber))];
}

function generatePhoneNumber() {
    const countryCode = '38';
    const phoneOperators = ['039', '067', '068', '096', '097', '098', '050', '066', '095', '099', '063', '093', '091'];
    const operatorsNumber = phoneOperators.length;
    return parseInt(countryCode + phoneOperators[Math.floor((Math.random() * operatorsNumber))] + Math.floor((Math.random() * 10000000)).toString(), 10);
}

function generateEmail() {
    const emailServices = ['gmail.com', 'ukr.net', 'yahoo.com', 'aol.com', 'tuta.nota.com', 'meta.ua', 'mail.lycos.com', 'zoho.com'];
    const servicesNumber = emailServices.length;
    return (Math.random()).toString(36).slice(-10) + '@' + emailServices[Math.floor((Math.random() * servicesNumber))];
}

function generateAddress(type) {
    const citiesFromFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'cities.txt'), 'utf8');
    const cities = citiesFromFile.split('\n')
                    .map( line => line.split('\t')[1].trim());
    const citiesNumber = cities.length;

    const regions = citiesFromFile.split('\n')
                    .map( line => line.split('\t')[2].trim());

    const streetsFromFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'streets.txt'), 'utf8');
    const streets = streetsFromFile.split('\n')
                    .map( line => line.split('(')[0].trim());    
    const streetsNumber = streets.length;

    const location = Math.floor((Math.random() * citiesNumber));
    let address = {
        country: 'Україна',
        region: regions[location],
        city: cities[location],
        street: streets[Math.floor((Math.random() * streetsNumber))],
        buildingNumber: Math.floor((Math.random() * 300))
    };

    if (type === 'private') {
        address['zipcode'] = Math.floor((Math.random() * (99999 - 10000) + 10000));
        address['appartment'] = Math.floor((Math.random() * 150));
    };

    return address;
}

module.exports = {
    generateFirstName,
    generateLastName,
    generatePhoneNumber,
    generateEmail,
    generateAddress
};
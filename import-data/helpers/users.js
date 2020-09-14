const fs = require('fs');
const path = require('path');
const { randomDateSince } = require('./dates');
const { getObjectId, getObjectIds } = require('mongo-seeding');

const recordNumber = 100;

const namesFromFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'names.txt'), 'utf8');
const names = namesFromFile.split('\n')
                .map( line => line.split(' ')[0])
                .map( word => word.slice(0,1).toUpperCase() + word.slice(1).toLowerCase());

const surnamesFromFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'surnames.txt'), 'utf8');
const surnames = surnamesFromFile.split('\n')
                .map( line => line.trim());

const citiesFromFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'cities.txt'), 'utf8');
const cities = citiesFromFile.split('\n')
                .map( line => line.split('\t')[1].trim());

const regions = citiesFromFile.split('\n')
                .map( line => line.split('\t')[2].trim());

const streetsFromFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'streets.txt'), 'utf8');
const streets = streetsFromFile.split('\n')
                .map( line => line.split('(')[0].trim());

const backpacks = getObjectIds(['rolltop', 'new', 'harbuz']);
const backpacksNumber = backpacks.length;

function generateCredentials() {
    let credentials = [];
    const possibleCreds = ['local', 'google', 'facebook'];
    const credPick = Math.floor((Math.random() * 100));
    if ((credPick >= 0 && credPick < 25) || credPick >= 95 ) {
        credentials.push({
                source: possibleCreds[0],
                tokenPass: (Math.random()).toString(36).slice(-10).toUpperCase()
            }
        )
    } if (credPick >= 20 && credPick < 70) {
        credentials.push({
                source: possibleCreds[1],
                tokenPass: (Math.random()).toString(36).slice(-10).toUpperCase()
            }
        )
    } if (credPick >= 60 && credPick < 100) {
        credentials.push({
                source: possibleCreds[2],
                tokenPass: (Math.random()).toString(36).slice(-10).toUpperCase()
            }
        )
    }
    return credentials;
}

const mapToUsers = (names, surnames, cities, streets, recordNumber) => {
    const namesNumber = names.length;
    const surnamesNumber = surnames.length;
    const citiesNumber = cities.length;
    const streetsNumber = streets.length;
    const countryCode = '38';
    const phoneOperators = ['039', '067', '068', '096', '097', '098', '050', '066', '095', '099', '063', '093', '091'];
    const operatorsNumber = phoneOperators.length;
    let result = [];
    let usedEmails = [];
    let emailStub;
    let usedPhoneNumbers = [];
    let phoneNumber;
    let location;
    let commentsOfUser = [];
    for (let i = 0; i < recordNumber; i++) {
        do {
            emailStub = (Math.random()).toString(36).slice(-10);
        } while (emailStub in usedEmails);
        usedEmails.push(emailStub);

        do {
            phoneNumber = parseInt(countryCode + phoneOperators[Math.floor((Math.random() * operatorsNumber))] + 
                Math.floor((Math.random() * 10000000)).toString(), 10);
        } while (phoneNumber in usedPhoneNumbers);
        usedPhoneNumbers.push(phoneNumber);

        location = Math.floor((Math.random() * citiesNumber));

        commentsOfUser = [];
        for (let j = 0; j < 3; j++){
            commentsOfUser.push(getObjectId('comment' + i + '_' + j));
        }

        result.push({
            id: getObjectId('user' + i),
            firstName: names[Math.floor((Math.random() * namesNumber))],
            lastName: surnames[Math.floor((Math.random() * surnamesNumber))],
            role: 'user',
            email: emailStub + '@gmail.com',
            phoneNumber: phoneNumber,
            address: {
                country: 'Україна',
                region: regions[location],
                city: cities[location],
                zipcode: Math.floor((Math.random() * (99999 - 10000) + 10000)),
                street: streets[Math.floor((Math.random() * streetsNumber))],
                buildingNumber: Math.floor((Math.random() * 300)),
                appartment: Math.floor((Math.random() * 150)),
            },
            images: {
                    large: 'large-' + emailStub + '.jpg',
                    medium: 'medium-' + emailStub + '.jpg',
                    small: 'small-' + emailStub + '.jpg',
                    thumbnail: 'thumbnail-' + emailStub + '.jpg'
                },
            credentials: generateCredentials(),
            registrationDate: randomDateSince(new Date('January 01, 2010 00:00:00')),
            wishlist: [backpacks[Math.floor((Math.random() * backpacksNumber))]],
            orders: [getObjectId('order' + i)],
            purchasedProducts: [],
            comments: commentsOfUser,
            banned: false,
            confirmed: false
        })
    };
    return result
};

const users = mapToUsers(names, surnames, cities, streets, recordNumber);

module.exports = users;

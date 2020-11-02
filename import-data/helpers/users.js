const { randomDateSince } = require('./dates');
const { generateFirstName, generateLastName, generatePhoneNumber, generateEmail, generateAddress } = require('./contacts');
const { getObjectId, getObjectIds } = require('mongo-seeding');

const recordNumber = 100;

const backpacks = getObjectIds(['rolltop', 'new', 'harbuz']);
const backpacksNumber = backpacks.length;

let usedEmails = [];
let usedPhoneNumbers = [];

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

const mapToUsers = (recordNumber) => {
    let result = [];
    let email;
    let phoneNumber;
    let commentsOfUser = [];
    for (let i = 0; i < recordNumber; i++) {
        do {
            email = generateEmail();
        } while (email in usedEmails);
        usedEmails.push(email);

        do {
            phoneNumber = generatePhoneNumber();
        } while (phoneNumber in usedPhoneNumbers);
        usedPhoneNumbers.push(phoneNumber);

        commentsOfUser = [];
        for (let j = 0; j < 3; j++){
            commentsOfUser.push(getObjectId('comment' + i + '_' + j));
        }

        result.push({
            id: getObjectId('user' + i),
            firstName: generateFirstName(),
            lastName: generateLastName(),
            role: 'user',
            email: email,
            phoneNumber: phoneNumber,
            address: generateAddress('private'),
            images: {
                    large: 'large-' + i + '.jpg',
                    medium: 'medium-' + i + '.jpg',
                    small: 'small-' + i + '.jpg',
                    thumbnail: 'thumbnail-' + i + '.jpg'
                },
            credentials: generateCredentials(),
            registrationDate: randomDateSince(new Date('January 01, 2010 00:00:00')),
            wishlist: [backpacks[Math.floor((Math.random() * backpacksNumber))]],
            orders: [],
            cart: [],
            purchasedProducts: [],
            comments: commentsOfUser,
            banned: false,
            confirmed: false
        })
    };
    return result
};

const users = mapToUsers(recordNumber);

module.exports = {
    users,
    usedEmails,
    usedPhoneNumbers
};

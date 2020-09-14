const users = require('../../helpers/users');
const products = require('../../helpers/products');
const { successfulPurchases } = require('../../helpers/orders');

const usersNumber = users.length;
const successfulPurchasesNumber = successfulPurchases.length;

for(let i = 0; i < usersNumber; i++) {
    for (let j = 0; j < successfulPurchasesNumber; j++){
        if (successfulPurchases[j][0] === users[i].id) {
            users[i]['purchasedProducts'].push(products[successfulPurchases[j][1]].id);
        }
    }
}

module.exports = users;
const { users } = require('../../helpers/users');
const products = require('../../helpers/products');
const { successfulPurchases, placedOrders } = require('../../helpers/orders');

const usersNumber = users.length;
const successfulPurchasesNumber = successfulPurchases.length;
const placedOrdersNumber = placedOrders.length;

for(let i = 0; i < usersNumber; i++) {
    for (let j = 0; j < successfulPurchasesNumber; j++){
        if (successfulPurchases[j][0] === users[i].id) {
            users[i]['purchasedProducts'].push(products[successfulPurchases[j][1]].id);
        }
    }
    for (let j = 0; j < placedOrdersNumber; j++){
        if (placedOrders[j][0] === users[i].id) {
            users[i]['orders'].push(placedOrders[j][1]);
        }
    }
}

module.exports = users;
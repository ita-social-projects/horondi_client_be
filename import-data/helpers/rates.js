const products = require('./products');
const { successfulPurchases } = require('./orders');
const { getObjectId, getObjectIds } = require('mongo-seeding');

const successfulPurchasesNumber = successfulPurchases.length;
const productsNumber = products.length;
let lastUpdatedDate;
let rate;

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

let rates = [];

let ratesPerProduct = [];
for (let i = 0; i < productsNumber; i++){
    ratesPerProduct[i] = new Array();
}

for (let i = 0; i < successfulPurchasesNumber; i++){
        lastUpdatedDate = randomDate(successfulPurchases[i][2], new Date('July 31, 2020 23:23:59'));
        rate = ~~(Math.random() * 3) + 3;
        rates.push({
            id: getObjectId('rate' + i),
            rate: rate,
            lastUpdatedDate: lastUpdatedDate,
            user: successfulPurchases[i][0],
            product: getObjectId('product' + successfulPurchases[i][2]),
            show: true
        });
        ratesPerProduct[successfulPurchases[i][1]].push(
            rate
        )
};

module.exports = {
    rates,
    ratesPerProduct
};
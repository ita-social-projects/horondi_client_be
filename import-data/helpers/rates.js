const products = require('./products');
const { successfulPurchases } = require('./orders');

const successfulPurchasesNumber = successfulPurchases.length;
const productsNumber = products.length;

let ratesPerProduct = [];
for (let i = 0; i < productsNumber; i++){
    ratesPerProduct[i] = new Array();
}

for (let i = 0; i < successfulPurchasesNumber; i++){
        ratesPerProduct[successfulPurchases[i][1]].push({
            user: successfulPurchases[i][0],
            rate: Math.floor((Math.random() * 3) + 3)
        })
};

module.exports = {
    ratesPerProduct
};
const products = require('../../helpers/products');
const { commentsPerProduct } = require('../../helpers/comments');
const { ratesPerProduct } = require('../../helpers/rates');

const productsNumber = products.length;
let votedUsersNumber;
let rate;

for(let i = 0; i < productsNumber; i++) {
    votedUsersNumber = ratesPerProduct[i].length;
    rate = (votedUsersNumber == 0) ? 0 : ratesPerProduct[i].reduce((total, el) => total + el) / votedUsersNumber;
    products[i]['comments'] = commentsPerProduct[i];
    products[i]['rateCount'] = votedUsersNumber;
    products[i]['rate'] = rate;
    products[i]['available'] = true;
    products[i]['isHotItem'] = true;
    products[i]['purchasedCount'] = ~~(Math.random() * (50 - 10) + 10);
}

module.exports = products;
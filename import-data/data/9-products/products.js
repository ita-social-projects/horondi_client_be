const products = require('../../helpers/products');
const { commentsPerProduct, votedUsers } = require('../../helpers/comments');

const productsNumber = products.length;
let votedUsersNumber;

for(let i = 0; i < productsNumber; i++) {
    votedUsersNumber = votedUsers[i].length;
    products[i]['comments'] = commentsPerProduct[i];
    products[i]['votedUsers'] = votedUsers[i];
    products[i]['rateCount'] = votedUsersNumber;
    products[i]['rate'] = ~~(Math.random() * (50 - 35) + 35) / 10;
    products[i]['available'] = true;
    products[i]['isHotItem'] = true;
    products[i]['purchasedNumber'] = ~~(Math.random() * (50 - 10) + 10);
}

module.exports = products;
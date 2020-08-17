const users = require('../data/8-users/users');
const products = require('./products');
const materials = require('../data/2-materials/materials');
const sizes = require('../data/5-sizes/sizes');
const categories = require('../data/1-categories/categories');
const { mapToCurrencies } = require('./currencyset');
const { randomDateSince, addDays } = require('./dates');
const { getObjectId, getObjectIds } = require('mongo-seeding');

let orders = [];
const usersNumber = users.length;
const productsNumber = products.length;
let product;
let productCount;
let option;
let categoryPick;
let subcategoryPick;
let materialPick;
let sizePick;
let actualPrice;
let totalPrice;
let successfulPurchases = [];

for (let i = 0; i < usersNumber; i++) {
    const dateOfCreation = randomDateSince(users[i].registrationDate);
    productCount = ~~(Math.random() * productsNumber);
    product = products[productCount];
    option = product.options[~~(Math.random() * product.options.length)];

    categoryPick = categories.find(el => el.id.toHexString() == product.category);
    subcategoryPick = categories.find(el => el.id.toHexString() == product.subcategory);
    materialPick = (option.bottomMaterial == null) ? null : materials.find(el => el.id.toHexString() == option.bottomMaterial);
    sizePick = sizes.find(el => el.id.toHexString() == option.size);

    actualPrice = product.basePrice[0].value + sizePick.additionalPrice[0].value;
    actualPrice = (materialPick == null) ? actualPrice : actualPrice + materialPick.additionalPrice[0].value;
    actualPrice = (option.additions.length === 0) ? actualPrice : actualPrice + option.additions[0].additionalPrice[0].value;

    successfulPurchases[i] = [users[i].id, productCount, dateOfCreation];

    orders[i] = {
        id: getObjectId('order' + i),
        status: 'sent', //'sent', 'pending', 'canceled'
        user: {
            firstName: users[i].firstName,
            lastName: users[i].lastName,
            email: users[i].email,
            phoneNumber: users[i].phoneNumber,
            address: users[i].address,
        },
        dateOfCreation: dateOfCreation,
        delivery: {
            sentOn: addDays(dateOfCreation, ~~(Math.random() * (5 - 1) + 1)),
            sentBy: 'Nova Poshta',
            invoiceNumber: ~~(Math.random() * 10000000).toString(),
        },
        items: [
            {
                category: categoryPick.name,
                subcategory: subcategoryPick.name,
                model: product.model,
                name: product.name,
                mainMaterial: product.mainMaterial,
                colors: product.colors,
                pattern: product.pattern,
                closure: product.closure,
                closureColor: product.closureColor,
                size: sizePick,
                bottomMaterial: (materialPick == null) ? [] : materialPick.name,
                bottomColor: option.bottomColor,
                additions: option.additions,
                actualPrice: mapToCurrencies(actualPrice),
                quantity: 1,
            },
        ],
        paymentMethod: 'card'
    };

    totalPrice = 0;
    for (let j = 0; j < orders[i].items.length; j++) {
        totalPrice += orders[i].items[j].actualPrice[0].value * orders[i].items[j].quantity;
    }
    orders[i]['totalPrice'] = mapToCurrencies(totalPrice);
}

console.log(orders[0].items[0])
console.log(orders[0].totalPrice)

module.exports = {
    orders,
    successfulPurchases
};
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
let dateOfCreation;
let sentOn;
let lastUpdatedDate;
let product;
let productCount;
let option;
let categoryPick;
let subcategoryPick;
let materialPick;
let sizePick;
let colors;
let actualPrice;
let totalItemsPrice;
let successfulPurchases = [];

for (let i = 0; i < usersNumber; i++) {
    dateOfCreation = randomDateSince(users[i].registrationDate);
    sentOn = addDays(dateOfCreation, ~~(Math.random() * (5 - 1) + 1));
    lastUpdatedDate = addDays(sentOn, ~~(Math.random() * (5 - 1) + 1));
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

    colors = [];
    for (let j = 0; j < product.colors.length; j++) {
        colors.push(product.colors[j].name);
    }

    successfulPurchases[i] = [users[i].id, productCount, dateOfCreation];

    orders[i] = {
        id: getObjectId('order' + i),
        status: 'DELIVERED',
        user: {
            firstName: users[i].firstName,
            lastName: users[i].lastName,
            email: users[i].email,
            phoneNumber: users[i].phoneNumber,
        },
        dateOfCreation: dateOfCreation,
        lastUpdatedDate: lastUpdatedDate,
        completed: true,
        userComment: '',
        adminComment: '',
        cancellationReason: '',
        delivery: {
            sentOn: sentOn,
            sentBy: 'Nova Poshta',
            courier: true,
            courierOffice: ~~(Math.random() * (20 - 1) + 1),
            invoiceNumber: ~~(Math.random() * 10000000).toString(),
            serviceType: 'WarehouseDoors',
            cost: mapToCurrencies(50.00),
        },
        address: users[i].address,
        items: [
            {
                category: categoryPick.name,
                subcategory: subcategoryPick.name,
                model: product.model,
                name: product.name,
                colors: colors,
                pattern: product.pattern,
                closure: product.closure,
                closureColor: product.closureColor,
                size: {
                    heightInCm: sizePick.heightInCm,
                    widthInCm: sizePick.widthInCm,
                    depthInCm: sizePick.depthInCm,
                    volumeInLiters: sizePick.volumeInLiters,
                    weightInKg: sizePick.weightInKg
                },
                bottomMaterial: (materialPick == null) ? [] : materialPick.name,
                bottomColor: option.bottomColor,
                additions: (option.additions.length == 0) ? [] : [option.additions[0].name],
                actualPrice: mapToCurrencies(actualPrice),
                quantity: 1,
            },
        ],
        paymentMethod: 'card',
        isPaid: true,
    };

    totalItemsPrice = 0;
    for (let j = 0; j < orders[i].items.length; j++) {
        totalItemsPrice += orders[i].items[j].actualPrice[0].value * orders[i].items[j].quantity;
    }
    orders[i]['totalItemsPrice'] = mapToCurrencies(totalItemsPrice);

    orders[i]['totalPriceToPay'] = mapToCurrencies(orders[i]['totalItemsPrice'][0].value + orders[i].delivery.cost[0].value);
}

console.log(orders[0]);
// console.log(orders[0].totalItemsPrice);
// console.log(orders[0].delivery.cost[0].value);
// console.log(orders[0].totalPriceToPay);

module.exports = {
    orders,
    successfulPurchases
};
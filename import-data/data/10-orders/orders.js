const users = require('../7-users/users');
const products = require('../9-products/products');
const materials = require('../2-materials/materials');
const patterns = require('../4-patterns/patterns');
const closures = require('../6-closures/closures');
//const categories = require('../1-categories/categories');
const { getObjectId, getObjectIds } = require('mongo-seeding');

let orders = [];
const usersNumber = users.length;
const productsNumber = products.length;
let product;
let item;
let componentsNumber;
let patternPick;
let materialPick;
let materialColorPick;
let closurePick;
let closureColorPick;
let totalPrice;

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

for (let i = 0; i < usersNumber; i++) {
    const dateOfCreation = randomDate(users[i].registrationDate, new Date('June 30, 2020 23:23:59'));
    product = products[~~(Math.random() * productsNumber)];
    item = product.items[~~(Math.random() * product.items.length)];

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
            product: product.name,
            size: item.size,
            components: [],
            actualPrice: item.actualPrice,
            quantity: 1,
            },
        ],
        paymentMethod: 'card'
    };

    componentsNumber = item.components.length;
    for (let j = 0; j < componentsNumber; j++) {
        materialPick = materials.find(el => el.id.toHexString() == item.components[j].material);
        materialColorPick = materialPick.colors.find(el => el.code == item.components[j].colorCode);
        orders[i].items[0].components.push({
            name: {
                lang: 'en',
                value: item.components[j].name,
            },
            material: materialPick.name,
            color: materialColorPick.name,
        });
    };

    if (item.hasOwnProperty('closure')) {
        closurePick = closures.find(el => el.id.toHexString() == item.closure);
        orders[i].items[0]['closure'] = closurePick.name;
        closureColorPick = closurePick.colors.find(el => el.code == item.closureColorCode);
        orders[i].items[0]['closureColor'] = closureColorPick.name;
    }

    if (item.hasOwnProperty('pattern')) {
        patternPick = patterns.find(el => el.id.toHexString() == item.pattern);
        orders[i].items[0]['pattern'] = patternPick.name;
    }

    if (item.hasOwnProperty('pocket')) {
        orders[i].items[0]['pocket'] = item.pocket;
    }

    // if (product.hasOwnProperty('category')) {
    //     for (let j = 0; j < categories.length; j++) {
    //         for (let k = 0; k < categories[j].subcategories.length; k++) {
    //             if (categories[j].subcategories[k].id.toHexString() == product.category) {
    //                 orders[i].items[0]['category'] = categories[j].subcategories[k].name
    //             }
    //         }
    //     }
    // }

    totalPrice = 0;
    for (let j = 0; j < orders[i].items.length; j++) {
        totalPrice += orders[i].items[j].actualPrice * orders[i].items[j].quantity;
    }
    orders[i]['totalPrice'] = totalPrice;
}

module.exports = orders;
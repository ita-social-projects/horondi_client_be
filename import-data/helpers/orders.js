const { users } = require('./users');
const products = require('./products');
const materials = require('../data/2-materials/materials');
const sizes = require('../data/5-sizes/sizes');
const categories = require('../data/1-categories/categories');
const { generateFirstName, generateLastName, generatePhoneNumber, generateEmail, generateAddress } = require('./contacts');
const { mapToCurrencies } = require('./currencyset');
const { randomDateSince, addDays } = require('./dates');
const { getObjectId } = require('mongo-seeding');

const servedUsersNumber = 1000;
let orders = [];
let orderId =' ';
const usersNumber = users.length;
const productsNumber = products.length;
let successfulPurchases = [];
let placedOrders = [];

for (let i = 0; i < servedUsersNumber; i++) {  
    const numberOfOrders = Math.floor((Math.random() * (3 - 1) + 1));
    if (i < usersNumber) {
        for (let m = 0; m < numberOfOrders; m++) {
            orders.push(mapOrderOfUser(i, m, 'registered'));
        }
    } else {
        orders.push(mapOrderOfUser(i, 0, 'guest'));
    }
}

function mapOrderOfUser(i, m, userStatus) {
    let user = {};
    let address = {};
    let dateOfCreation;
    const byCourier = (Math.floor((Math.random() * (3 - 1) + 1)) === 1) ? true : false;

    if (userStatus === 'registered') {
        dateOfCreation = randomDateSince(users[i].registrationDate);
        user = {
            firstName: users[i].firstName,
            lastName: users[i].lastName,
            email: users[i].email,
            phoneNumber: users[i].phoneNumber,
        };
        address = (byCourier) ? users[i].address : generateAddress('organization');
    } else {
        dateOfCreation = randomDateSince(new Date('January 01, 2010 00:00:00'));
        user = {
            firstName: generateFirstName(),
            lastName: generateLastName(),
            email: generateEmail(),
            phoneNumber: generatePhoneNumber(),
        };
        address = (byCourier) ? generateAddress('private') : generateAddress('organization');
        
    };
    
    const sentOn = addDays(dateOfCreation, Math.floor((Math.random() * (5 - 1) + 1)));
    const lastUpdatedDate = addDays(sentOn, Math.floor((Math.random() * (5 - 1) + 1)));
    const numberOfItems = Math.floor((Math.random() * (3 - 1) + 1));

    const orderStatus = ((i + m) % 10 === 0) ? 'CANCELLED' : 'DELIVERED';

    let items = [];
    for (let k = 0; k < numberOfItems; k++) {

        items.push(mapOrderItem(i, dateOfCreation, orderStatus, userStatus));
    }

    const order = {
        id: getObjectId('order' + i + '_' + m),
        orderId:orderId,
        status: orderStatus,
        user: user,
        dateOfCreation: dateOfCreation,
        lastUpdatedDate: lastUpdatedDate,
        completed: true,
        userComment: '',
        adminComment: '',
        cancellationReason: '',
        delivery: {
            sentOn: sentOn,
            sentBy: 'Nova Poshta',
            byCourier: byCourier,
            courierOffice: Math.floor((Math.random() * (20 - 1) + 1)),
            invoiceNumber: Math.floor((Math.random() * 10000000)).toString(),
            cost: mapToCurrencies(5000),
        },
        address: address,
        items: items,
        paymentMethod: (Math.floor((Math.random() * (3 - 1) + 1)) === 1) ? 'CARD' : 'CASH',
        isPaid: (orderStatus === 'CANCELLED') ? false : true,
    };

    let totalItemsPrice = 0;
    for (let j = 0; j < order.items.length; j++) {
        totalItemsPrice += order.items[j].actualPrice[0].value * order.items[j].quantity;
    }
    order['totalItemsPrice'] = mapToCurrencies(totalItemsPrice);

    order['totalPriceToPay'] = mapToCurrencies(order['totalItemsPrice'][0].value + order.delivery.cost[0].value);

    if (userStatus === 'registered') {
        placedOrders.push([users[i].id, order.id]);
    }
    
    if (orderStatus === 'CANCELLED') {
        order['cancellationReason'] = 'Передумав купляти';
    }

    if ((i + m) % 7 === 0) {
        order['adminComment'] = 'Термінове замовлення';
    }

    if ((i + m) % 3 === 0) {
        order['userComment'] = 'Хотілось би отримати не пізніше тижня';
    }

    return order;
}

function mapOrderItem(i, dateOfCreation, orderStatus, userStatus) {
    if (digits_count(i)==1){
        orderId ="00000";
    }
    else if (digits_count(i)==2){
        orderId ="0000";
    }
    else if (digits_count(i)==3){
        orderId ="000";
    }
    orderId+=i;

    const productCount = Math.floor((Math.random() * productsNumber));
    const product = products[productCount];
    const option = product.options[Math.floor((Math.random() * product.options.length))];
    
    const categoryPick = categories.find(el => el.id.toHexString() == product.category);
    const subcategoryPick = categories.find(el => el.id.toHexString() == product.subcategory);
    const materialPick = (option.bottomMaterial == null) ? null : materials.find(el => el.id.toHexString() == option.bottomMaterial);
    const sizePick = sizes.find(el => el.id.toHexString() == option.size);

    let actualPrice = product.basePrice[0].value + sizePick.additionalPrice[0].value;
    actualPrice = (materialPick == null) ? actualPrice : actualPrice + materialPick.additionalPrice[0].value;
    actualPrice = (option.additions.length === 0) ? actualPrice : actualPrice + option.additions[0].additionalPrice[0].value;

    let colors = [];
    for (let j = 0; j < product.colors.length; j++) {
        colors.push(product.colors[j].name);
    }

    if (userStatus === 'registered' && orderStatus === 'DELIVERED') {
        successfulPurchases.push([users[i].id, productCount, dateOfCreation]);
    }

    return {
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
        additions: (option.additions.length === 0) ? [] : [option.additions[0].name],
        actualPrice: mapToCurrencies(actualPrice),
        quantity: 1,
    }
};
function digits_count(n) {
    var count = 0;
    if (n >= 1) ++count;
  
    while (n / 10 >= 1) {
      n /= 10;
      ++count;
    }
  
    return count;
  };

module.exports = {
    orders,
    successfulPurchases,
    placedOrders
};
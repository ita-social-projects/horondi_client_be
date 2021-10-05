module.exports = function changeCartItemSizeHandler(
  itemId,
  size,
  price,
  quantity,
  cart
) {
  const changedItems = cart.map(el => {
    if (el._id.toString() === itemId.toString()) {
      el.options.size = size;
      el.price = price;

      el.price.forEach(priceEl => {
        priceEl.value *= quantity;
      });
    }
    return el;
  });

  for (let i = 0; i < changedItems.length; i++) {
    for (let j = 0; j < changedItems.length; j++) {
      if (
        changedItems[i].product._id.toString() ===
          changedItems[j].product._id.toString() &&
        changedItems[i].options.size._id.toString() ===
          changedItems[j].options.size._id.toString() &&
        i !== j
      ) {
        changedItems[i].quantity += changedItems[j].quantity;

        for (let k = 0; k < changedItems[i].price.length; k++) {
          changedItems[i].price[k].value += changedItems[j].price[k].value;
        }

        changedItems.splice(j, 1);
      }
    }
  }

  return changedItems;
};

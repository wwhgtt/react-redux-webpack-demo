const _has = require('lodash.has');
const isGroupDish = exports.isGroupDish = (dish) => _has(dish, 'subDishItems');

exports.orderedDishPrice = (dishList) => {
  let dishPriceCollection = [];
  dishList.map(dish => {
    if (isGroupDish(dish)) {
      let childDishPriceCollection = [];
      dish.subDishItems.map(childDish => childDishPriceCollection.push(childDish.price));
      const groupDishPrice = dish.price + childDishPriceCollection.reduce((p, c) => p + c, 0);
      return groupDishPrice < 0 ? 0 : dishPriceCollection.push(groupDishPrice);
    }
    return dishPriceCollection.push(dish.price);
  });
  return parseFloat((dishPriceCollection.reduce((p, c) => p + c, 0)).toFixed(2));
};

exports.getDishPrice = (dish) => {
  if (isGroupDish(dish)) {
    let childDishPriceCollection = [];
    dish.subDishItems.map(childDish => childDishPriceCollection.push(childDish.price));
    const groupDishPrice = dish.price + childDishPriceCollection.reduce((p, c) => p + c, 0);
    return groupDishPrice < 0 ? 0 : parseFloat(groupDishPrice.toFixed(2));
  }
  return dish.price;
};

exports.isSingleDishWithoutProps = (dish) => {
  if (isGroupDish(dish)) {
    return false;
  }
  return dish.memo;
};

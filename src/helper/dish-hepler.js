const isSingleDishWithoutProps = exports.isSingleDishWithoutProps = function (dishData) {
  if (dishData.type === 0 && dishData.dishPropertyTypeInfos.length === 0) {
    return true;
  }
  return false;
};
exports.isGroupDish = function (dishData) {
  return dishData.hasOwnProperty('groups');
};
exports.getOrderedDishes = function (dishesData) {
  return dishesData.filter(dishData => dishData.hasOwnProperty('order'));
};
exports.getDishesCount = function (dishesData) {
  return dishesData.
    map(dishData => {
      if (dishData.hasOwnProperty('order')) {
        if (isSingleDishWithoutProps(dishData)) {
          return dishData.order;
        }
        return dishData.order.map((order => order.count)).reduce((c, p) => c + p);
      }
      return 0;
    }).
    reduce((p, c) => p + c, 0);
};
const getDishPrice = exports.getDishPrice = function (dishData) {
  if (isSingleDishWithoutProps(dishData)) {
    return dishData.marketPrice * dishData.order;
  }
  return 0;
};

exports.getDishesPrice = function (dishesData) {
  return dishesData.map(dishData => getDishPrice(dishData)).
    reduce((c, p) => c + p, 0);
};

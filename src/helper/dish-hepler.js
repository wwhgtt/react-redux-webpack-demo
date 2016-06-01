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
const getOrderPrice = exports.getOrderPrice = function (basePrice, orderData) {
  const rePriceProps = orderData.dishPropertyTypeInfos.filter(prop => prop.type !== 3);
  const checkedRepriceProps = [].concat.apply(
    [], rePriceProps.map(
      rePriceProp => rePriceProp.properties.filter(prop => prop.isChecked).
      map(prop => prop.reprice)
    )
  );
  return orderData.count * (basePrice + parseFloat(checkedRepriceProps.reduce((c, p) => c + p, 0), 10));
};
const getDishPrice = exports.getDishPrice = function (dishData) {
  if (isSingleDishWithoutProps(dishData)) {
    return dishData.marketPrice * dishData.order;
  }
  return dishData.order.map(eachOrder => getOrderPrice(dishData.marketPrice, eachOrder)).reduce((c, p) => c + p);
};

exports.getDishesPrice = function (dishesData) {
  return dishesData.map(dishData => getDishPrice(dishData)).
    reduce((c, p) => c + p, 0);
};

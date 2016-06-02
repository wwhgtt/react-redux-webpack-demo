const isSingleDishWithoutProps = exports.isSingleDishWithoutProps = function (dishData) {
  if (dishData.type === 0 && dishData.dishPropertyTypeInfos.length === 0) {
    return true;
  }
  return false;
};
const isGroupDish = exports.isGroupDish = function (dishData) {
  return dishData.groups !== undefined;
};
exports.getOrderedDishes = function (dishesData) {
  return dishesData.filter(dishData => !(dishData.order === undefined) || (dishData.order && dishData.order.length));
};
const getDishesCount = exports.getDishesCount = function (dishesData) {
  return dishesData.
    map(dishData => {
      if (dishData.order !== undefined) {
        if (isSingleDishWithoutProps(dishData)) {
          return dishData.order;
        }
        return dishData.order.map((order => order.count)).reduce((c, p) => c + p, 0);
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
  return orderData.count *
    (basePrice + parseFloat(checkedRepriceProps.reduce((c, p) => c + p, 0), 10));
};
const getDishPrice = exports.getDishPrice = function (dishData) {
  if (isSingleDishWithoutProps(dishData)) {
    return dishData.marketPrice * dishData.order;
  }
  return dishData.order.map(
    eachOrder => getOrderPrice(dishData.marketPrice, eachOrder)
  ).reduce((c, p) => c + p, 0);
};

exports.getDishesPrice = function (dishesData) {
  return dishesData.map(dishData => getDishPrice(dishData)).
    reduce((c, p) => c + p, 0);
};

exports.getNewCountOfDish = function (dishData, increment) {
  let newCount = 0;
  if (isSingleDishWithoutProps(dishData)) {
    if (dishData.order === undefined) {
      newCount = dishData.dishIncreaseUnit;
    } else if (dishData.order + increment < dishData.dishIncreaseUnit) {
      newCount = undefined;
    } else {
      newCount = dishData.order + increment;
    }
  } else if (isGroupDish(dishData)) {
    // todo
  } else {
    const oldCount = getDishesCount([dishData]);
    if (oldCount === 0) {
      // if never ordered this dish;
      newCount = dishData.dishIncreaseUnit;
    } else if (oldCount + increment < dishData.dishIncreaseUnit) {
      // if never ordered this dish and now want to order a count that is smaller thant dishIncreaseUnit;
      newCount = 0;
    } else {
      newCount = oldCount + increment;
    }
  }

  return newCount;
};

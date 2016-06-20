const isSingleDishWithoutProps = exports.isSingleDishWithoutProps = function (dish) {
  if (dish.type !== 1 && dish.dishPropertyTypeInfos.length === 0) {
    return true;
  }
  return false;
};
const isGroupDish = exports.isGroupDish = function (dish) {
  return dish.groups !== undefined;
};
exports.isChildDish = function (dish) {
  return dish.isChildDish;
};
exports.getOrderedDishes = function (dishes) {
  return dishes.filter(dish => !(dish.order === undefined) || (dish.order && dish.order.length));
};
const getDishesCount = exports.getDishesCount = function (dishes) {
  return dishes.
    map(dish => {
      if (dish.order !== undefined) {
        if (isSingleDishWithoutProps(dish)) {
          return dish.order;
        }
        return dish.order.map((order => order.count)).reduce((c, p) => c + p, 0);
      }
      return 0;
    }).
    reduce((p, c) => p + c, 0);
};
const getOrderPrice = exports.getOrderPrice = function (dish, orderData) {
  if (isGroupDish(dish)) {
    const orderedChildDishPrices = [].concat.apply([], orderData.groups.map(
      group => group.childInfos.filter(childDish => childDish.order).
        map(
          childDish => isSingleDishWithoutProps(childDish) ? childDish.marketPrice * childDish.order
            : getOrderPrice(childDish, childDish.order[0])
        )
    ));
    return Math.floor(orderData.count *
      (dish.marketPrice + parseFloat(orderedChildDishPrices.reduce((c, p) => c + p, 0))) * 100) / 100;
  }
  // for nongroup dish, from this line.
  const rePriceProps = orderData.dishPropertyTypeInfos.filter(prop => prop.type !== 3);
  const checkedRepricePropPrices = [].concat.apply(
    [], rePriceProps.map(
      rePriceProp => rePriceProp.properties.filter(prop => prop.isChecked).
        map(prop => prop.reprice)
    )
  );
  return Math.floor(orderData.count *
    (dish.marketPrice + parseFloat(checkedRepricePropPrices.reduce((c, p) => c + p, 0))) * 100) / 100;
};
const getDishPrice = exports.getDishPrice = function (dish) {
  if (isSingleDishWithoutProps(dish)) {
    return dish.marketPrice * dish.order;
  }
  return dish.order.map(
    eachOrder => getOrderPrice(dish, eachOrder)
  ).reduce((c, p) => c + p, 0);
};

exports.getDishesPrice = function (dishes) {
  return dishes.map(dish => getDishPrice(dish)).
    reduce((c, p) => c + p, 0);
};

exports.getNewCountOfDish = function (dish, increment) {
  let newCount = 0;
  if (isSingleDishWithoutProps(dish)) {
    if (dish.order === undefined) {
      newCount = dish.dishIncreaseUnit;
    } else if (dish.order + increment < dish.dishIncreaseUnit) {
      newCount = undefined;
    } else {
      newCount = dish.order + increment;
    }
  } else {
    const oldCount = getDishesCount([dish]);
    if (oldCount === 0) {
      // if never ordered this dish;
      newCount = dish.dishIncreaseUnit;
    } else if (oldCount + increment < dish.dishIncreaseUnit) {
      // if never ordered this dish and now want to order a count that is smaller thant dishIncreaseUnit;
      newCount = 0;
    } else {
      newCount = oldCount + increment;
    }
  }

  return newCount;
};
const getOrderPropIds = function (order) {
  const { dishPropertyTypeInfos, dishIngredientInfos } = order;
  const propsIds = [].concat.apply([], dishPropertyTypeInfos.map(
    prop => prop.properties.filter(
      property => property.isChecked
    ).map(
      property => property.id
    )
  ));
  const ingredientIds = dishIngredientInfos.filter(
    ingredient => ingredient.isChecked
  ).map(ingredient => ingredient.id);
  return [propsIds, ingredientIds];
};
// setCookie
const setCookieFuc = exports.setCookieFuc = function (name, value) {
  const Days = 30;
  const exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${exp.toGMTString()}`;
};
const getUrlParam = exports.getUrlParam = function (param) {
  const reg = new RegExp(`(^|&)${param}=([^&]*)(&|$)`, 'i');
  const r = window.location.search.replace(/\?/g, '&').substr(1).match(reg);
  if (r != null) {
    return (r[2]);
  }
  return null;
};
exports.getDishCookieString = function (dish, orderIdx) {
  const isSingleDish = !isGroupDish(dish);
  const consumeType = getUrlParam('type');
  const shopId = getUrlParam('shopId');
  const { id, marketPrice } = dish;
  const dishCount = getDishesCount([dish]);
  if (isSingleDish) {
    const propIds = isSingleDishWithoutProps(dish) ? [] : getOrderPropIds(dish.order[orderIdx]);
    const arrayIsEmpty = function (array) {
      if (array.length === 0) {
        return true;
      }
      return false;
    };
    const spliceResultOfPropIds = arrayIsEmpty(propIds) ? '-' : `${propIds[0].join('^')}-${propIds[1].join('^')}`;
    const name = `${consumeType}_${shopId}_${id}_${id}|1-${spliceResultOfPropIds}`;
    const value = `${dishCount}|${marketPrice}`;
    setCookieFuc(name, value);
  } else {
    const splitPropsIds = [].concat.apply([], dish.order[orderIdx].groups.map(group => {
      const groupId = group.id;
      const result = group.childInfos.map(childInfo => {
        const propIds = isSingleDishWithoutProps(childInfo) ? [] : getOrderPropIds(childInfo.order[orderIdx]);
        const arrayIsEmpty = function (array) {
          if (array.length === 0) {
            return true;
          }
          return false;
        };
        const spliceResultOfPropIds = arrayIsEmpty(propIds) ? '-' : `${propIds[0].join('^')}-${propIds[1].join('^')}`;
        return `${childInfo.id}A${groupId}|${getDishesCount([childInfo])}-${spliceResultOfPropIds}`;
      });
      return [].concat.apply([], result);
    }));
    const name = `${consumeType}_${shopId}_${id}_${splitPropsIds.join('#')}`;
    const value = `${dishCount}|${marketPrice}`;
    setCookieFuc(name, value);
  }
};

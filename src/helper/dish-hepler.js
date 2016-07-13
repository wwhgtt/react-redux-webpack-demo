const getUrlParam = exports.getUrlParam = function (param) {
  const reg = new RegExp(`(^|&)${param}=([^&]*)(&|$)`, 'i');
  const r = window.location.search.replace(/\?/g, '&').substr(1).match(reg);
  if (r != null) {
    return (r[2]);
  }
  return null;
};
const isSingleDishWithoutProps = exports.isSingleDishWithoutProps = function (dish) {
  if (dish.type !== 1 && dish.dishPropertyTypeInfos.length === 0) {
    return true;
  } else if (dish.type !== 1 && dish.dishPropertyTypeInfos.length === 1 && dish.dishPropertyTypeInfos[0].type === 4) {
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
const getOrderedDishes = exports.getOrderedDishes = function (dishes) {
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
    return (orderData.count *
      (dish.marketPrice + parseFloat(orderedChildDishPrices.reduce((c, p) => c + p, 0)))).toFixed(2);
  }
  // for nongroup dish, from this line.
  const rePriceProps = orderData.dishPropertyTypeInfos.filter(prop => prop.type !== 3);
  const ingredientsPriceProps = orderData.dishIngredientInfos;
  const checkedRepricePropPrices = [].concat.apply(
    [], rePriceProps.map(
      rePriceProp => rePriceProp.properties.filter(prop => prop.isChecked).
        map(prop => prop.reprice)
    )
  );
  const checkedIngredientsPropsPrice = [].concat.apply(
    [], ingredientsPriceProps.filter(
      ingredientsPriceProp => ingredientsPriceProp.isChecked
    ).map(ingredientsPriceProp => ingredientsPriceProp.reprice)
  );
  return (orderData.count *
    (dish.marketPrice +
       parseFloat(checkedRepricePropPrices.reduce((c, p) => c + p, 0)) +
       parseFloat(checkedIngredientsPropsPrice.reduce((c, p) => c + p, 0))
    )).toFixed(2);
};
const getDishPrice = exports.getDishPrice = function (dish) {
  if (isSingleDishWithoutProps(dish)) {
    return dish.marketPrice * dish.order;
  }
  return dish.order.map(
    eachOrder => parseFloat(getOrderPrice(dish, eachOrder))
  ).reduce((c, p) => c + p, 0);
};

exports.getDishesPrice = function (dishes) {
  const dishesPrice = dishes.map(dish => getDishPrice(dish)).
    reduce((c, p) => c + p, 0);
  if (Number.isInteger(dishesPrice)) {
    return dishesPrice;
  }
  return parseFloat(dishesPrice.toFixed(2));
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
exports.hasSelectedProps = function (dish) {
  const propsIdsCollection = getOrderPropIds(dish.order[0]);
  if (propsIdsCollection[0].length !== 0 || propsIdsCollection[1].length !== 0) {
    return true;
  }
  return false;
};
// setCookie
exports.setCookie = function (name, value) {
  const Days = 30;
  const exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${exp.toGMTString()};path=/`;
};
exports.getDishCookieObject = function (dish, orderIdx) {
  const isSingleDish = !isGroupDish(dish);
  const consumeType = getUrlParam('type');
  const shopId = getUrlParam('shopId');
  const { id, marketPrice } = dish;
  const orderCount = isSingleDishWithoutProps(dish) ? getDishesCount([dish]) : dish.order[orderIdx].count;
  if (isSingleDish) {
    const spliceResultOfPropIds = isSingleDishWithoutProps(dish)
     ? '-' :
      `${getOrderPropIds(dish.order[orderIdx])[1].join('^')}-${getOrderPropIds(dish.order[orderIdx])[0].join('^')}`;
    return { key : `${consumeType}_${shopId}_${id}_${id}|1-${spliceResultOfPropIds}`, value : `${orderCount}|${marketPrice}` };
  }
  const splitPropsIds = [].concat.apply([], dish.order[orderIdx].groups.map(group => {
    const groupId = group.id;
    const result = group.childInfos.map(childInfo => {
      const spliceResultOfPropIds = isSingleDishWithoutProps(childInfo)
       ? '-' :
        `${getOrderPropIds(childInfo.order[0])[1].join('^')}-${getOrderPropIds(childInfo.order[0])[0].join('^')}`;
      return `${childInfo.id}A${groupId}|${getDishesCount([childInfo])}-${spliceResultOfPropIds}`;
    });
    return [].concat.apply([], result);
  }));
  return { key : `${consumeType}_${shopId}_${id}_${splitPropsIds.join('#')}`, value : `${orderCount}|${marketPrice}` };
};
exports.storeDishesLocalStorage = function (data) {
  let lastOrderedDishes = {
    shopId: getUrlParam('shopId'),
    type: getUrlParam('type'),
    expires: Date.now() + 24 * 60 * 60 * 1000,
    dishes: getOrderedDishes(data),
  };

  localStorage.setItem('lastOrderedDishes', JSON.stringify(lastOrderedDishes));
};
const clearDishesLocalStorage = exports.clearDishesLocalStorage = function () {
  localStorage.removeItem('lastOrderedDishes');
};
exports.restoreDishesLocalStorage = function (data) {
  const lastOrderedDishes = JSON.parse(localStorage.getItem('lastOrderedDishes') || '{}');

  if (lastOrderedDishes.hasOwnProperty('shopId') && lastOrderedDishes.hasOwnProperty('type')) {
    const shopId = lastOrderedDishes.shopId;
    const type = lastOrderedDishes.type;

    if (shopId === getUrlParam('shopId') && type === getUrlParam('type') && lastOrderedDishes.expires > Date.now()) {
      data.dishList.forEach(dish => {
        const orderedDishIndex = lastOrderedDishes.dishes.findIndex(orderedDish => orderedDish.id === dish.id);
        if (orderedDishIndex > -1) {
          dish.order = lastOrderedDishes.dishes[orderedDishIndex].order;
        }
      });
    } else {
      clearDishesLocalStorage();
    }
  }
  return data;
};

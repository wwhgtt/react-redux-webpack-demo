const getUrlParam = exports.getUrlParam = function (param) {
  const reg = new RegExp(`(^|&)${param}=([^&]*)(&|$)`, 'i');
  const r = window.location.search.replace(/\?/g, '&').substr(1).match(reg);
  if (r != null) {
    return (r[2]);
  }
  return null;
};
const isSingleDishWithoutProps = exports.isSingleDishWithoutProps = dish => {
  if (dish.type === 1) return false;

  const propTypeInfo = dish.dishPropertyTypeInfos || [];
  const ingredientInfos = dish.dishIngredientInfos || [];
  return !ingredientInfos.length && (!propTypeInfo.length || propTypeInfo.every(prop => prop.type === 4));
};
const isGroupDish = exports.isGroupDish = function (dish) {
  return dish.groups !== undefined;
};
const setHasRulesDishProps = function (dish) {
  return dish.dishPropertyTypeInfos.map(
   property => {
     if (property.type === 4 && Array.isArray(property.properties) && property.properties.length) {
       return property.properties.forEach(prop => prop.isChecked = true);
     }
     return property;
   }
 );
};
const setHasIngredientProps = function (dish) {
  return dish.dishIngredientInfos.map(
   Ingredient => Ingredient.isChecked = false
 );
};
exports.setDishPropertyTypeInfos = function (dishesList) {
  if (dishesList && dishesList.length) {
    dishesList.map(
      dish => {
        // 这里判断的是单品菜的情况
        if (dish.dishPropertyTypeInfos && dish.dishPropertyTypeInfos.length) {
          setHasRulesDishProps(dish);
        } else if (isGroupDish(dish)) {
          dish.groups.map(group => {
            group.childInfos.map(childInfo => {
              if (childInfo.dishPropertyTypeInfos && childInfo.dishPropertyTypeInfos.length) {
                setHasRulesDishProps(childInfo);
              }
              return true;
            });
            return true;
          });
        }
        if (dish.dishIngredientInfos && dish.dishIngredientInfos.length) {
          setHasIngredientProps(dish);
        } else if (isGroupDish(dish)) {
          dish.groups.map(group => {
            group.childInfos.map(childInfo => {
              if (childInfo.dishIngredientInfos && childInfo.dishIngredientInfos.length) {
                setHasIngredientProps(childInfo);
              }
              return true;
            });
            return true;
          });
        }
        return dish;
      }
    );
  }
  return dishesList;
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
  const signleDishPrice = parseFloat((orderData.count *
    (dish.marketPrice +
       parseFloat(checkedRepricePropPrices.reduce((c, p) => c + p, 0)) +
       parseFloat(checkedIngredientsPropsPrice.reduce((c, p) => c + p, 0))
    )).toFixed(2), 10);
  return signleDishPrice >= 0 ? signleDishPrice : 0;
};
const getDishPrice = exports.getDishPrice = function (dish) {
  if (isSingleDishWithoutProps(dish)) {
    const signleDishPrice = parseFloat((dish.marketPrice * dish.order).toFixed(2));
    return signleDishPrice >= 0 ? signleDishPrice : 0;
  }
  const hasPropsDishPrice = dish.order.map(
    eachOrder => parseFloat(getOrderPrice(dish, eachOrder))
  ).reduce((c, p) => c + p, 0);
  return hasPropsDishPrice >= 0 ? hasPropsDishPrice : 0;
};

exports.getDishesPrice = function (dishes) {
  const dishesPrice = dishes.map(dish => getDishPrice(dish)).
    reduce((c, p) => c + p, 0);
  if (isFinite(dishesPrice) && Math.floor(dishesPrice) === dishesPrice) {
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
const getSignleDishRuleIds = function (dish) {
  let rulePropertyCollection = [];
  dish.dishPropertyTypeInfos.map(
    property => property.properties.map(
      prop => rulePropertyCollection.push(prop.id)
    )
  );
  return rulePropertyCollection.join('^');
};
const getDishBoxCount = exports.getDishBoxCount = function (orderedDishes) {
  let dishBoxContainer = [];
  orderedDishes.map(
    orderDish => {
      if (isGroupDish(orderDish)) {
        orderDish.order.map(
          childOrder =>
            childOrder.groups.map(
              group =>
                group.childInfos.filter(childDish => childDish.order).map(
                  child =>
                    child.boxQty && child.dishQty ?
                      dishBoxContainer.push(Math.ceil(getDishesCount([child]) / parseFloat(child.dishQty)) * parseFloat(child.boxQty))
                      :
                      false
                )
            )
        );
      } else {
        if (orderDish.boxQty && orderDish.dishQty) {
          dishBoxContainer.push(
            Math.ceil(getDishesCount([orderDish]) / parseFloat(orderDish.dishQty)) * parseFloat(orderDish.boxQty)
          );
        }
      }
      return true;
    }
  );
  return dishBoxContainer.reduce((c, p) => c + p, 0);
};
exports.getDishBoxprice = function (orderedDishes, dishBoxChargeInfo) {
  if (!dishBoxChargeInfo || dishBoxChargeInfo.orderFlag !== 1) {
    return 0;
  }
  return getDishBoxCount(orderedDishes) * dishBoxChargeInfo.content;
};
exports.hasSelectedProps = function (dish) {
  const hasProps = dish.order[0].dishPropertyTypeInfos.some(prop => prop.type !== 4 && prop.properties.some(item => item.isChecked));
  const hasIngredients = dish.order[0].dishIngredientInfos.some(item => item.isChecked);
  if (hasProps || hasIngredients) return true;
  return false;
};
// setCookie
const setCookie = exports.setCookie = function (name, value) {
  const Days = 30;
  const exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${exp.toGMTString()};path=/`;
};
const getDishCookieObject = exports.getDishCookieObject = function (dish, orderIdx) {
  const isSingleDish = !isGroupDish(dish);
  const consumeType = getUrlParam('type');
  const shopId = getUrlParam('shopId');
  const { id, marketPrice } = dish;
  const orderCount = isSingleDishWithoutProps(dish) ? getDishesCount([dish]) : dish.order[orderIdx].count;
  if (isSingleDish) {
    let spliceResultOfPropIds = null;
    if (isSingleDishWithoutProps(dish)) {
      if (dish.dishPropertyTypeInfos && dish.dishPropertyTypeInfos.length) {
        // 到这里就剩下只有规格的菜品了
        spliceResultOfPropIds = `-${getSignleDishRuleIds(dish)}`;
      } else {
        spliceResultOfPropIds = '-';
      }
    } else {
      spliceResultOfPropIds = `${getOrderPropIds(dish.order[orderIdx])[1].join('^')}-${getOrderPropIds(dish.order[orderIdx])[0].join('^')}`;
    }
    return { key : `${consumeType}_${shopId}_${id}_${id}|1-${spliceResultOfPropIds}`, value : `${orderCount}|${marketPrice}` };
  }
  const splitPropsIds = [].concat.apply([], dish.order[orderIdx].groups.map(group => {
    const groupId = group.id;
    const result = group.childInfos.filter(childInfos => getDishesCount([childInfos])).map(childInfo => {
      let spliceResultOfPropIds = null;
      if (isSingleDishWithoutProps(childInfo)) {
        if (childInfo.dishPropertyTypeInfos && childInfo.dishPropertyTypeInfos.length) {
          // 到这里就剩下只有规格的菜品了
          spliceResultOfPropIds = `-${getSignleDishRuleIds(childInfo)}`;
        } else {
          spliceResultOfPropIds = '-';
        }
      } else {
        spliceResultOfPropIds = `${getOrderPropIds(childInfo.order[0])[1].join('^')}-${getOrderPropIds(childInfo.order[0])[0].join('^')}`;
      }
      return `${childInfo.id}A${groupId}|${getDishesCount([childInfo])}-${spliceResultOfPropIds}`;
    });
    return [].concat.apply([], result);
  }));
  const groupChildDishIds = !splitPropsIds.join('#') || splitPropsIds.join('#') === '' ? id + '|1--' : splitPropsIds.join('#');
  return { key : `${consumeType}_${shopId}_${id}_${groupChildDishIds}`, value : `${orderCount}|${marketPrice}` };
};
exports.storeDishesLocalStorage = function (data, func) {
  const lastOrderedDishes = {
    shopId: getUrlParam('shopId'),
    type: getUrlParam('type'),
    expires: Date.now() + 24 * 60 * 60 * 1000,
    dishes: func ? func(data) : getOrderedDishes(data),
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
exports.isShopOpen = function (timeList) {
  // timeList == [] or null, shop opens 24 hours
  if (!timeList || timeList.length === 0) {
    return true;
  }

  // convert "HH:MM:SS" format to seconds
  const timeToSeconds = (time) => {
    const hms = time.split(':');
    return (+hms[0]) * 60 * 60 + (+hms[1]) * 60 + (+hms[2]);
  };

  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = timeToSeconds(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);

  return timeList.some(entry => {
    const startTime = timeToSeconds(entry.startTime);
    let endTime = timeToSeconds(entry.endTime) || timeToSeconds('24:00:00');
    if (endTime < startTime) endTime += timeToSeconds('24:00:00'); // if endTime is in the next day

    const isOpenTime = currentTime >= startTime && currentTime <= endTime;
    let isOpenDay = false;

    // open in 7 days a week
    if (entry.week === 7) {
      isOpenDay = true;
    }

    // open in working days
    if (entry.week === 0 && currentDay >= 1 && currentDay <= 5) {
      isOpenDay = true;
    }

    // open in weekend
    if (entry.week === 1 && (currentDay === 0 || currentDay === 6)) {
      isOpenDay = true;
    }

    return isOpenDay && isOpenTime;
  });
};
exports.setDishCookie = (dishesData, orderedData) => {
  // 下面开始区分套餐cookie和单品菜cookie
  orderedData.map(orderData => {
    if (!isSingleDishWithoutProps(orderData)) {
      for (let index in orderData.order) {
        const setPackageDishCookie = getDishCookieObject(orderData, index);
        setCookie(setPackageDishCookie.key, setPackageDishCookie.value);
      }
      return true;
    }
    const setSignleDishCookie = getDishCookieObject(orderData, 0);
    return setCookie(setSignleDishCookie.key, setSignleDishCookie.value);
  });
};
exports.deleteOldDishCookie = function () {
  const oldCookieCollection = document.cookie.match(/(WM|TS).+?((?=;)|$)/g);
  if (oldCookieCollection && oldCookieCollection.length) {
    oldCookieCollection.forEach(cookie => {
      let date = new Date();
      date.setTime(date.getTime() - 10000);
      document.cookie = cookie + '=a; expires=' + date.toGMTString() + '; path=/';
    });
  }
};


exports.generateDishNameWithUnit = (dishData) => {
  if (Array.isArray(dishData.dishPropertyTypeInfos) && dishData.dishPropertyTypeInfos.length) {
    const avaliableDishProps = dishData.dishPropertyTypeInfos.filter(prop => prop.type === 4);
    if (avaliableDishProps.length) {
      const properties = avaliableDishProps.map(prop => prop.properties[0].name).join(', ');
      return `${dishData.name}(${properties})/${dishData.unitName}`;
    }
    return `${dishData.name}/${dishData.unitName}`;
  }
  return `${dishData.name}/${dishData.unitName}`;
};

exports.formatOpenTime = (openTimeList, isWeekend) => {
  let restore1 = '';
  let restore2 = '';
  let restoreAll = '';
  if (!openTimeList || openTimeList.length === 0 && !isWeekend) {
    return '全天候';
  }
  openTimeList.map((item, index) => {
    const startTime = item.startTime.substring(0, 5);
    const endTime = item.endTime.substring(0, 5);
    const allTime = `${startTime}-${endTime}`;

    if (item.type === 0 && item.week === 7) {
      if (!isWeekend) {
        restoreAll = `${allTime}`;
      } else {
        restoreAll = '';
      }
    } else if (item.type === 1) {
      if (item.week === 0 && !isWeekend) {
        restore1 = `工作日：${allTime}`;
      } else if (item.week === 1 && !isWeekend) {
        restore1 = `休息日：${allTime}`;
      }
      restoreAll = `${isWeekend ? restore2 : restore1}`;
    } else if (item.type === 3 && item.week === 7) { // 分餐
      if (!isWeekend) {
        if (index === 0) {
          restore1 = `${allTime}`;
        }
        restore2 = `${allTime}`;
        restoreAll = `${restore1} ${restore2}`;
      } else {
        restoreAll = '';
      }
    } else if (item.type === 2) {
      if (index === 0 && item.week === 0) {
        restore1 = `${allTime}`;
      } else if (index === 1 && item.week === 0) {
        restore2 = `${allTime}`;
      } else if (index === 2 && item.week === 1 && isWeekend) {
        restore1 = `${allTime}`;
      } else if (index === 3 && item.week === 1 && isWeekend) {
        restore2 = `${allTime}`;
      }
      restoreAll = `${isWeekend ? '休息日' : '工作日'}：${restore1} ${restore2}`;
    }
    return false;
  });
  return restoreAll;
};

exports.formatMarket = (marketList, formatDishesData) => {
  const formatMarket = {};
  marketList.forEach((item, index) => {
    const dishId = item.dishId;
    if (item.rules && item.rules.length !== 0 && formatDishesData[dishId]) {
      Object.assign(formatMarket, JSON.parse('{ "' + dishId + '" : ' + JSON.stringify(item.rules) + '}'));
    }
  });
  return formatMarket;
};

exports.formatMarketUpdate = (marketList, formatDishesData) => {
  let formatMarketUpdate = [];
  marketList.forEach((item, index) => {
    const dishId = item.dishId;
    if (item.rules && item.rules.length !== 0 && formatDishesData[dishId]) {
      item.rules.forEach((itemt, indext) => {
        formatMarketUpdate = formatMarketUpdate.concat({ dishId, rule:itemt });
      });
    }
  });
  return formatMarketUpdate.sort((a, b) => b.rule.updateTime > a.rule.updateTime);
};

exports.formatDishesData = (dishesData) => {
  const formatDishesData = {};
  dishesData.forEach((item, index) => {
    Object.assign(formatDishesData, JSON.parse('{ "' + item.brandDishId + '" : ' + JSON.stringify(item) + '}'));
  });
  return formatDishesData;
};

exports.matchDishesData = (marketListUpdate, formatDishesData) => {
  let marketMatchDishes = false;
  marketListUpdate.forEach((item, index) => {
    if (formatDishesData[item.dishId]) {
      marketMatchDishes = true;
    }
  });
  return marketMatchDishes;
};

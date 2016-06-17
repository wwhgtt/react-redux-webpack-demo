const isSingleDishWithoutProps = exports.isSingleDishWithoutProps = function (dishData) {
  if (dishData.type === 0 && dishData.dishPropertyTypeInfos.length === 0) {
    return true;
  }
  return false;
};
// 区分是否为单品菜和套餐
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
// 判断菜品配料等是否为空
const haveReMark = exports.haveReMark = function (order) {
  if (order instanceof Array) {
    const dishIngredientInfos = order[0].dishIngredientInfos;
    if (dishIngredientInfos.length !== 0) {
      const ingredient = [];
      for (let i = 0; i < dishIngredientInfos.length; i++) {
        if (dishIngredientInfos[i].isChecked) {
          ingredient.push(dishIngredientInfos[i].id);
        }
      }
      return ingredient.join('ˆ');
    } return '';
      // 代表没有配料
  } return '';
};

// 判断做法备注等等
const howToWork = exports.howToWork = function (order) {
  if (order instanceof Array) {
    const dishPropertyTypeInfos = order[0].dishPropertyTypeInfos;
    if (dishPropertyTypeInfos.length !== 0) {
      for (let i = 0; i < dishPropertyTypeInfos.length; i++) {
        const infomation = [];
        if (dishPropertyTypeInfos[i].type === 3) {
          // 代表备注信息
          const properties = dishPropertyTypeInfos[i].properties;
          if (properties && properties.length !== 0) {
            for (let j = 0; j < properties.length; j++) {
              if (properties[j].isChecked) {
                infomation.push(properties[j].id);
              }
            }
          }
        } else if (dishPropertyTypeInfos[i].type === 1) {
          // 代表做法信息
          const properties = dishPropertyTypeInfos[i].properties;
          if (properties && properties.length !== 0) {
            for (let j = 0; j < properties.length; j++) {
              if (properties[j].isChecked) {
                infomation.push(properties[j].id);
              }
            }
          }
        }
        return infomation.join('ˆ');
      }
    } else {
      // 没有备注做法信息
      return '';
    }
  } else {
    // 表示order是数量
    return '';
  }
  return true;
};

// 判断order是不是数组
const orderIsArray = exports.orderIsArray = function (data) {
  if (data instanceof Array) {
    return data[0].count;
  } return data;
};
// setCookie
const setCookieFuc = exports.setCookieFuc = function (name, value) {
  const Days = 30;
  const exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()}`;
};
exports.setCookieFromData = function (orderData) {
  if (isGroupDish(orderData)) {
    // 套餐cookie
    // console.log(orderData);
  } else {
    // 单品cookie  配料ID 做法备注口味id
    // console.log(orderData);
    const signalCookieName = `TS_${orderData.brandDishId}_${orderData.id}_`
    + `${orderData.id}|1-${haveReMark(orderData.order)}-`
    + `${howToWork(orderData.order)}`;
    const signalCookieValue = `${orderIsArray(orderData.order)}`
    + `|${orderData.marketPrice} `;
    setCookieFuc(signalCookieName, signalCookieValue);
  }
};

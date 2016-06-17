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
// exports.getOrderPropsInfoIds = function (order) {
//   const { dishPropertyTypeInfos, dishIngredientInfos } = order;
// };
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
  }
  return data;
};
// setCookie
const setCookieFuc = exports.setCookieFuc = function (name, value) {
  const Days = 30;
  const exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()}`;
};
// 套餐里面groups的判断
const getWhichGroup = exports.getWhichGroup = function (data) {
  const extra = [];
  for (let i = 0; i < data.length; i ++) {
    // 这是分组ID,还需要配料等ID
    const groupId = data[i].id;
    const childInfos = data[i].childInfos;
    for (let j = 0; j < childInfos.length; j++) {
      // 获取子菜ID
      const dishId = childInfos[j].id;
      if (childInfos[j].order) {
        const dishString = `${dishId}A${groupId}|`;
        const orderInfo = childInfos[j].order;
        if (orderInfo instanceof Array) {
          // 数量 配菜  做法／备注
          const count = `${orderInfo[0].count}`;
          if (count) {
            extra.push(`${dishString}${count}-${haveReMark(orderInfo)}-${howToWork(orderInfo)}`);
          }
        } else {
          extra.push(`${dishString}${orderInfo}--`);
        }
      }
    }
  }
  return extra.join('#');
};

exports.setCookieFromData = function (orderData) {
  if (isGroupDish(orderData)) {
    // 套餐cookie
    console.log(orderData.order[0].groups);
    const complexCookieName = `TS_${orderData.brandDishId}_${orderData.id}_`
    + `${getWhichGroup(orderData.order[0].groups)}`;
    const complexCookieValue = `${orderIsArray(orderData.order[0].count)}`
    + `|${orderData.marketPrice} `;
    setCookieFuc(complexCookieName, complexCookieValue);
  } else {
    // 单品cookie  配料ID 做法备注口味id
    // console.log(orderData);
    const signalCookieName = `TS_${orderData.brandDishId}_${orderData.id}_`
    + `${orderData.id}|1-${haveReMark(orderData.order)}-`
    + `${howToWork(orderData.order)}`;
    const signalCookieValue = `${orderIsArray(orderData.order)}`
    + `|${orderData.marketPrice} `;
    console.log(signalCookieValue);
    setCookieFuc(signalCookieName, signalCookieValue);
  }
};

const config = require('../../config');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
const helper = require('../../helper/dish-hepler');
const setMenuData = createAction('SET_MENU_DATA', menuData => menuData);
exports.showDishDetail = createAction('SHOW_DISH_DETAIL', dishData => dishData);
exports.orderDish = createAction('ORDER_DISH', (dishData, action) => [dishData, action]);
exports.removeAllDishes = createAction('REMOVE_ALL_DISHES');
exports.activeDishType = createAction('ACTIVE_DISH_TYPE', (evt, dishTypeId) => {
  if (evt && /dish-type-item/.test(evt.target.className)) {
    window.__scrollByType__ = true;
  }
  return dishTypeId;
});
exports.fetchMenuData = () => (dispatch, getStates) => {
  fetch(config.dishMenuAPI, {
    method: 'GET', mod: 'cors',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  }).
    then(res => {
      if (!res.ok) {
        throw new Error('获取菜单信息失败...');
      }
      return res.json();
    }).
    then(menuData => {
      dispatch(setMenuData(menuData.data));
    }).
    catch(err => {
      throw err;
    });
};

const setCookie = exports.setCookie = function (orderData) {
  if (helper.isGroupDish(orderData)) {
    // 套餐cookie
    // console.log(orderData);
  } else {
    // 单品cookie  配料ID 做法备注口味id
    // console.log(orderData);
    const signalCookieName = `TS_${orderData.brandDishId}_${orderData.id}_`
    + `${orderData.id}|1-${helper.haveReMark(orderData.order)}-`
    + `${helper.haveAnoMark(orderData.order)}`;
    const signalCookieValue = `${helper.orderIsArray(orderData.order)}`
    + `|${orderData.marketPrice} `;
    helper.setcookie(signalCookieName, signalCookieValue);
  }
};

exports.onBillBtnTap = () => (dispatch, getStates) => {
  const dishesData = getStates().dishesData;
  const ordersData = helper.getOrderedDishes(dishesData);
  console.log(ordersData);
  // 下面开始区分套餐cookie和单品菜cookie
  ordersData.map(orderData => setCookie(orderData));
};

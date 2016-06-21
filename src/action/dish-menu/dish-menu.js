const config = require('../../config');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
const helper = require('../../helper/dish-hepler');
const setMenuData = createAction('SET_MENU_DATA', menuData => menuData);
const orderDishAction = createAction('ORDER_DISH', (dishData, action) => [dishData, action]);
const removeAllDishesAction = createAction('REMOVE_ALL_DISHES');
exports.showDishDetail = createAction('SHOW_DISH_DETAIL', dishData => dishData);
exports.orderDish = createAction('ORDER_DISH', (dishData, action) => [dishData, action]);
exports.removeAllOrders = createAction('REMOVE_ALL_ORDERS', orders => orders);
exports.activeDishType = createAction('ACTIVE_DISH_TYPE', (evt, dishTypeId) => {
  if (evt && /dish-type-item/.test(evt.target.className)) {
    window.__activeTypeByTap__ = true;
  } else {
    window.__activeTypeByTap__ = false;
  }
  return dishTypeId;
});
exports.fetchMenuData = () => (dispatch, getStates) => {
  const type = helper.getUrlParam('type');
  const shopId = helper.getUrlParam('shopId');
  let url = '';
  if (type === 'TS') {
    url = `${config.orderallMenuAPI}?shopId=${shopId}`;
  } else {
    url = `${config.takeawayMenuAPI}?shopId=${shopId}`;
  }
  fetch(url, {
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
      if (localStorage.getItem('lastShopId') === helper.getUrlParam('shopId')) {
        const lastSelectedDishes = JSON.parse(localStorage.getItem('lastSelectedDishes'));
        menuData.data.dishList.forEach(dish => {
          if (lastSelectedDishes[dish.id]) {
            dish.order = lastSelectedDishes[dish.id];
          }
        });
      } else {
        localStorage.removeItem('lastShopId');
        localStorage.removeItem('lastSelectedDishes');
      }
      dispatch(setMenuData(menuData.data));
    }).
    catch(err => {
      throw err;
    });
};

exports.orderDish = (dishData, action) => (dispatch, getStates) => {
  let lastSelectedDishes = {};

  dispatch(orderDishAction(dishData, action));

  helper.getOrderedDishes(getStates().dishesData).forEach(dish => {
    lastSelectedDishes[dish.id] = dish.order;
  });

  localStorage.setItem('lastShopId', helper.getUrlParam('shopId'));
  localStorage.setItem('lastSelectedDishes', JSON.stringify(lastSelectedDishes));
};

exports.removeAllDishes = () => (dispatch, getStates) => {
  localStorage.removeItem('lastShopId');
  localStorage.removeItem('lastSelectedDishes');
  dispatch(removeAllDishesAction());
};

exports.setDishCookie = () => (dispatch, getStates) => {
  const dishesData = getStates().dishesData;
  const orderedData = helper.getOrderedDishes(dishesData);
  // 下面开始区分套餐cookie和单品菜cookie
  orderedData.map(orderData => {
    if (!helper.isSingleDishWithoutProps(orderData)) {
      for (let index in orderData.order) {
        const setPackageDishCookie = helper.getDishCookieObject(orderData, index);
        helper.setCookie(setPackageDishCookie.key, setPackageDishCookie.value);
      }
      return true;
    }
    const setSignleDishCookie = helper.getDishCookieObject(orderData, 0);
    return helper.setCookie(setSignleDishCookie.key, setSignleDishCookie.value);
  });
};

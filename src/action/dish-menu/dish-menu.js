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
    window.__activeTypeByTap__ = true;
  } else {
    window.__activeTypeByTap__ = false;
  }
  return dishTypeId;
});
exports.fetchMenuData = () => (dispatch, getStates) => {
  const type = helper.getFoodType('type');
  const shopId = helper.getFoodType('shopId');
  let url = '';
  if (type === 'TS') {
    url = `${config.dishMenuAPI}?type=TS&shopId=${shopId}`;
  } else {
    url = `${config.dishMenuAPI}?type=TS&shopId=${shopId}`;
  }
  // `http://devweixin.shishike.com/takeaway/dishAll.json?type=MW&shopId=${shopId}`;
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
      dispatch(setMenuData(menuData.data));
    }).
    catch(err => {
      throw err;
    });
};

exports.setDishCookie = () => (dispatch, getStates) => {
  const dishesData = getStates().dishesData;
  const ordersData = helper.getOrderedDishes(dishesData);
  // 下面开始区分套餐cookie和单品菜cookie
  ordersData.map(orderData => helper.setCookieFromData(orderData));
};

const config = require('../../config');
const createAction = require('redux-actions').createAction;
const helper = require('../../helper/dish-hepler');
require('es6-promise');
require('isomorphic-fetch');

const setMenuData = createAction('SET_MENU_DATA', menuData => menuData);
const showDishDetail = createAction('SHOW_DISH_DETAIL', dishData => dishData);
const orderDish = createAction('ORDER_DISH', (dishData, action) => [dishData, action]);
exports.tryToOrderDish = (dishData, action) => (dispatch, getStates) => {
  if (helper.isSingleDishWithoutProps(dishData) && !action) { // if it's complex dish, and no action passed, show dish detail;
    dispatch(showDishDetail(dishData.id));
  } else {
    dispatch(orderDish(dishData, action));
  }
};

exports.activeDishType = createAction('ACTIVE_DISH_TYPE', (evt, dishTypeId) => [evt, dishTypeId]);
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

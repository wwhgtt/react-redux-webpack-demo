const config = require('../../config');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');

const setMenuData = createAction('SET_MENU_DATA', menuData => menuData);
exports.showDishDetail = createAction('SHOW_DISH_DETAIL', dishData => dishData);
exports.orderDish = createAction('ORDER_DISH', (dishData, action) => [dishData, action]);

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

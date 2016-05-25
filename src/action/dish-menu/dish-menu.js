const config = require('../../config');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');

const setMenuData = createAction('SET_MENU_DATA', menuData => menuData);

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
      console.log(err);
    });
};

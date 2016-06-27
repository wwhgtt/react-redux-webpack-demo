const config = require('../../config');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
const setOrderData = createAction('SET_ORDER_DATA', menuData => menuData);
exports.orderFetchData = () => (dispatch, getState) => {
  fetch(config.orderDineInMenuAPi, {
    method: 'GET', mod: 'cors',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  }).
    then(res => {
      if (!res.ok) {
        throw new Error('获取订单信息失败...');
      }
      return res.json();
    }).
    then(menuData => {
      dispatch(setOrderData(menuData.data));
    }).
    catch(err => {
      throw err;
    });
};

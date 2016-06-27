const config = require('../../config');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
const setOrder = createAction('SET_ORDER', menuData => menuData);
exports.fetchOrder = () => (dispatch, getState) => {
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
    then(order => {
      console.log(order.data);
      dispatch(setOrder(order.data));
    }).
    catch(err => {
      throw err;
    });
};

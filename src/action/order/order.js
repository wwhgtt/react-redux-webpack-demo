const config = require('../../config');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');

const setOrder = createAction('SET_ORDER', order => order);
exports.fetchOrder = () => (dispatch, getState) => {
  fetch(config.orderDineInAPi, {
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
      dispatch(setOrder(order.data));
    }).
    catch(err => {
      throw err;
    });
};
exports.setGetOrderWay = (evt, optionData) => (dispatch, getState) => {
  const dataId = optionData.id;
  if (dataId === 1) {
    getState().updateIn(
      ['serviceProps', 'isPickupFromFrontDesk'],
      item => item.set('isChecked', false)
    );
    console.log(getState());
  }
};

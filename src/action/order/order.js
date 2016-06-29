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
exports.getOrderDiscountInfo = () => (dispatch, getState) => {
  fetch(config.orderDiscountInfoAPI, {
    method: 'GET', mod: 'cors',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  }).
    then(res => {
      if (!res.ok) {
        throw new Error('获取会员信息失败...');
      }
      return res.json();
    }).
    then(discount => {
      // dispatch(setOrder(order.data));
    }).
    catch(err => {
      throw err;
    });
};
exports.getOrderCoupons = () => (dispatch, getState) => {
  fetch(config.orderCouponsAPI, {
    method: 'GET', mod: 'cors',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  }).
    then(res => {
      if (!res.ok) {
        throw new Error('获取会员信息失败...');
      }
      return res.json();
    }).
    then(coupon => {
      // dispatch(setOrder(order.data));
    }).
    catch(err => {
      throw err;
    });
};
exports.setOrderProps = createAction('SET_ORDER_PROPS', (evt, option) => option);

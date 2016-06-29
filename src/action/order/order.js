const config = require('../../config');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');

const setOrder = createAction('SET_ORDER', order => order);
const mergeDiscountToOrder = createAction('MERGE_DISCOUNT_TO_ORDER', discount => discount);
const mergeCouponsToOrder = createAction('MERGE_COUPONS_TO_ORDER', coupons => coupons);
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
exports.fetchOrderDiscountInfo = () => (dispatch, getState) => {
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
      dispatch(mergeDiscountToOrder(discount.data));
    }).
    catch(err => {
      throw err;
    });
};
exports.fetchOrderCoupons = () => (dispatch, getState) => {
  fetch(config.orderCouponsAPI, {
    method: 'GET', mod: 'cors',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  }).
    then(res => {
      if (!res.ok) {
        throw new Error('获取折扣信息失败...');
      }
      return res.json();
    }).
    then(coupons => {
      dispatch(mergeCouponsToOrder(coupons.data));
    }).
    catch(err => {
      throw err;
    });
};
exports.setOrderProps = createAction('SET_ORDER_PROPS', (evt, option) => option);
exports.calculateOrderPrice = createAction('CALCULATE_ORDER_PRICE', (evt, option) => option);

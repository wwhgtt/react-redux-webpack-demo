const config = require('../../config');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');

const setOrder = createAction('SET_ORDER', order => order);
const setOrderProps = exports.setOrderProps = createAction('SET_ORDER_PROPS', (evt, option) => option);
const setDiscountToOrder = createAction('SET_DISCOUNT_TO_ORDER', discount => discount);
const setCouponsToOrder = createAction('SET_COUPONS_TO_ORDER', coupons => coupons);
const setChildView = exports.setChildView = createAction('SET_CHILDVIEW', viewHash => viewHash);
const setOrderedDishesToOrder = createAction('SET_ORDERED_DISHES_TO_ORDER', dishes => dishes);
exports.setChildView = createAction('SET_CHILDVIEW', viewHash => viewHash);
exports.fetchOrder = () => (dispatch, getState) =>
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
      return order.data;
    }).
    catch(err => {
      console.log(err);
    });

exports.fetchOrderDiscountInfo = () => (dispatch, getState) =>
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
      dispatch(setDiscountToOrder(discount.data));
    }).
    catch(err => {
      console.log(err);
    });
exports.fetchOrderCoupons = () => (dispatch, getState) =>
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
      dispatch(setCouponsToOrder(coupons.data));
    }).
    catch(err => {
      console.log(err);
    });
exports.setOrderPropsAndResetChildView = (evt, option) => (dispatch, getState) => {
  dispatch(setOrderProps(evt, option));
  dispatch(setChildView(''));
};
exports.getLastOrderedDishes = () => (dispatch, getState) => {
  const lastOrderedDishes = localStorage.getItem('lastOrderedDishes');
  dispatch(setOrderedDishesToOrder(JSON.parse(lastOrderedDishes)));
};
exports.setOrderProps = createAction('SET_ORDER_PROPS', (evt, option) => option);

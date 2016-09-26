require('es6-promise');
require('isomorphic-fetch');
const createAction = require('redux-actions').createAction;
const config = require('../../config');
const getUrlParam = require('../../helper/common-helper.js').getUrlParam;
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setOrderDetail = createAction('SET_ORDER_DETAIL', orderDetail => orderDetail);
const shopId = getUrlParam('shopId');
const orderId = getUrlParam('orderId');

exports.getOrderDetailUncheck = () => (dispatch, getState) => {
  const getOrderDetailUncheckURL = `${config.tradeDetailUncheckAPI}?shopId=${shopId}&orderId=${orderId}`;
  config.requestOptions.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  fetch(getOrderDetailUncheckURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('获取信息失败'));
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      dispatch(setOrderDetail(res.data));
      dispatch(setErrorMsg(''));
    } else {
      dispatch(setErrorMsg(res.msg));
    }
  });
};

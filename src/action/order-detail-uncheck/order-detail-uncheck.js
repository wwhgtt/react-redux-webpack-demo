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
  const requestOptions = Object.assign({}, config.requestOptions);
  requestOptions.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  requestOptions.method = 'GET';

  fetch(getOrderDetailUncheckURL, requestOptions).
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
    } else if (res.code === '70005') {
      dispatch(setErrorMsg(res.msg));
      setTimeout(() => { location.href = `http://${location.host}/order/orderallDetail?shopId=${shopId}&orderId=${orderId}`; }, 3000);
    } else {
      dispatch(setErrorMsg(res.msg));
    }
  });
};

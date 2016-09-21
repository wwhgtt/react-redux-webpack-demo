require('es6-promise');
require('isomorphic-fetch');
const createAction = require('redux-actions').createAction;
const config = require('../../config');
const getUrlParam = require('../../helper/common-helper.js').getUrlParam;
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setOrderDetail = createAction('SET_ORDER_DETAIL', orderDetail => orderDetail);
const shopId = getUrlParam('shopId');

exports.getOrderDetailUncheck = () => (dispatch, getState) => {
  const getOrderDetailUncheckURL = `${config.tradeDetailUncheckAPI}?${shopId}`;
  fetch(getOrderDetailUncheckURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('获取订单信息失败'));
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      dispatch(setOrderDetail(res.data));
    } else {
      dispatch(setErrorMsg(res.msg));
    }
  });
};

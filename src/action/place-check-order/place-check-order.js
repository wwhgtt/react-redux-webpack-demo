const config = require('../../config');
const commonHelper = require('../../helper/common-helper');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
const setOrderDetail = createAction('SET_ORDER_DETAIL', orderDetail => orderDetail);
const setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setLoadMsg = createAction('SET_LOAD_MSG', loadInfo => loadInfo);
const shopId = commonHelper.getUrlParam('shopId');
const orderId = commonHelper.getUrlParam('orderId');

exports.getPlaceCheckOrder = () => (dispatch, getState) => {
  const getPlaceCheckOrderURL = `${config.tradeDetailUncheckAPI}?shopId=${shopId}&orderId=${orderId}`;
  const requestOptions = Object.assign({}, config.requestOptions);
  requestOptions.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  requestOptions.method = 'GET';

  dispatch(setLoadMsg({ status:true, word:'加载中' }));
  if (!shopId) {
    dispatch(setErrorMsg('找不到门店号'));
    return;
  }
  fetch(getPlaceCheckOrderURL, requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('获取预点菜信息失败'));
    }
    return res.json();
  }).
  then(res => {
    dispatch(setLoadMsg({ status:false, word:'' }));
    if (res.code === '200') {
      dispatch(setOrderDetail(res.data));
    } else {
      dispatch(setErrorMsg(res.msg));
    }
  });
};

exports.confirmBill = (note) => (dispatch, getstate) => {
  dispatch(setLoadMsg({ status:true, word:'提交订单中...' }));
  fetch(config.placeCheckOrderAPI, commonHelper.getFetchPostParam({ shopId, orderId, note })).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('确认订单失败！！'));
    }
    return res.json();
  }).
  then(res => {
    dispatch(setLoadMsg({ status:false, word:'' }));
    if (res.code === '200') {
      location.href = 'http://app.d.cn';
    } else {
      dispatch(setErrorMsg(res.msg));
    }
  });
};

exports.clearErrorMsg = () => (dispatch, getStates) => {
  dispatch(setErrorMsg(''));
};

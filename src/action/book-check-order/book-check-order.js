const config = require('../../config');
const commonHelper = require('../../helper/common-helper');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
const setOrderDetail = createAction('SET_ORDER_DETAIL', orderDetail => orderDetail);
const setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setLoadMsg = createAction('SET_LOAD_MSG', loadInfo => loadInfo);
const shopId = commonHelper.getUrlParam('shopId');
// const orderId = commonHelper.getUrlParam('orderId');

exports.getBookCheckOrder = () => (dispatch, getState) => {
  if (!localStorage.lastOrderedDishes) { // 如果没有菜品
    location.href = `${config.orderallListURL}&shopId=${shopId}#dinner`;
  }
  const lastOrderedDishes = JSON.parse(localStorage.lastOrderedDishes || '{}');
  dispatch(setOrderDetail(lastOrderedDishes));
};

exports.confirmBill = (data) => (dispatch, getstate) => {
  dispatch(setLoadMsg({ status:true, word:'提交订单中...' }));
  const requestOptions = Object.assign({}, config.requestOptions, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  fetch(`${config.bookingSubOrderAPI}?shopId=${shopId}`, requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('确认订单失败！！'));
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      const orderId = sessionStorage.YDrelatedId;
      localStorage.clear();
      location.href = `${config.bookingDetailURL}?shopId=${commonHelper.getUrlParam('shopId')}&type=YD&orderId=${orderId}`;
    } else {
      dispatch(setLoadMsg({ status:false, word:'' }));
      dispatch(setErrorMsg(res.msg));
    }
  }).
  catch(err => {
    console.log(err);
  });
};

exports.clearErrorMsg = () => (dispatch, getStates) => {
  dispatch(setErrorMsg(''));
};

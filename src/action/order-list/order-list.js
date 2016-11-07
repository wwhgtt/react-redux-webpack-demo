require('es6-promise');
require('isomorphic-fetch');
const config = require('../../config');
const createAction = require('redux-actions').createAction;
const helper = require('../../helper/common-helper.js');

const setOrderList = createAction('SET_ORDER_LIST', orderList => orderList);
exports.setChildView = createAction('SET_CHILD_VIEW', childView => childView);
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);

const shopId = helper.getUrlParam('shopId');

// 堂食订单列表
exports.getOrderList = (pageNum) => (dispatch, getStates) => {
  const orderListURL = `${config.orderListAPI}?shopId=${shopId}&pageNum=${pageNum}`;
  fetch(orderListURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('订单列表获取失败'));
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      dispatch(setOrderList(res.data.list));
    } else {
      dispatch(setErrorMsg('订单列表获取失败'));
    }
  });
};

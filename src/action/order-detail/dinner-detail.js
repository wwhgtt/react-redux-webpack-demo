require('es6-promise');
require('isomorphic-fetch');
const config = require('../../config');
const createAction = require('redux-actions').createAction;
const helper = require('../../helper/common-helper.js');
const setDinnerDetail = createAction('SET_DINNER_DETAIL', dinnerDetail => dinnerDetail);

const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);

const shopId = helper.getUrlParam('shopId');
const orderId = helper.getUrlParam('orderId');

exports.getDinnerDetail = () => (dispatch, getStates) => {
  const getDinnerDetailURL = `${config.getDinnerDetailAPI}?shopId=${shopId}&orderId=${orderId}`;
  fetch(getDinnerDetailURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('订单详情获取失败'));
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      dispatch(setDinnerDetail(res.data));
    } else {
      dispatch(setErrorMsg('订单详情获取失败'));
    }
  });
};

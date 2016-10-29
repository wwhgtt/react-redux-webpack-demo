const config = require('../../config');
const commonHelper = require('../../helper/common-helper');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');

const setBalanceInfo = createAction('SET_BALANCE_INFO', balanceInfo => balanceInfo);
const shopId = commonHelper.getUrlParam('shopId');

// 获取余额信息
exports.getBalanceInfo = () => (dispatch, getStates) => {
  const getBalanceInfoURL = `${config.getBalanceInfoAPI}?shopId=${shopId}`;
  fetch(getBalanceInfoURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      return false;
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      dispatch(setBalanceInfo(res.data));
    }
  });
};

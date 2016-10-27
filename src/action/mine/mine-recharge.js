const config = require('../../config');
const commonHelper = require('../../helper/common-helper');

const createAction = require('redux-actions').createAction;
const setRechargeInfo = createAction('SET_RECHARGE_INFO', rechargeInfo => rechargeInfo);
require('es6-promise');
require('isomorphic-fetch');

const shopId = commonHelper.getUrlParam('shopId');

// 获取充值卡信息
exports.getRechargeInfo = () => (dispatch, getStates) => {
  const getRechargeInfoURL = `${config.getRechargeInfoAPI}?shopId=${shopId}`;
  fetch(getRechargeInfoURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      return false;
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      dispatch(setRechargeInfo(res.data));
    }
  });
};

// 会员卡充值
exports.addRecharge = price => (dispatch, getStates) => {
  const addRechargeURL = `${config.addRechargeAPI}?shopId=${shopId}&price=${price}`;
  fetch(addRechargeURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      return false;
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      const orderId = res.data.id;
      console.log(location.host);
      location.href = `http://${location.host}/shop/payDetail?shopId=${shopId}&orderType=""&orderId=${orderId}`;
    } else {
      alert(1);
    }
  });
};

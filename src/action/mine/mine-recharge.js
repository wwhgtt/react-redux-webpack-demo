const config = require('../../config');
const commonHelper = require('../../helper/common-helper');

const createAction = require('redux-actions').createAction;
const setRechargeInfo = createAction('SET_RECHARGE_INFO', rechargeInfo => rechargeInfo);
const setUserInfo = createAction('SET_USER_INFO', userInfo => userInfo);
const setBrandInfo = createAction('SET_BRAND_INFO', brandInfo => brandInfo);
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
      const returnUrl = encodeURIComponent(`http://${location.host}/member/valueCard?shopId=${shopId}`);
      sessionStorage.setItem('rurl_payDetaill', JSON.stringify(returnUrl));
      location.href = `http://${location.host}/shop/payDetail?shopId=${shopId}&orderId=${orderId}&orderType=recharge`;
    }
  });
};

// 获取用户信息
exports.getUserInfo = () => (dispatch, getStates) => {
  const getUserInfo = `${config.individualAPI}?shopId=${shopId}`;
  fetch(getUserInfo, config.requestOptions).
  then(res => {
    if (!res.ok) {
      return false;
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      dispatch(setUserInfo(res.data));
    }
  });
};

// 获取门店信息
exports.getBrandInfo = () => (dispatch, getStates) => {
  const getBrandInfoURL = `${config.indexAPI}?shopId=${shopId}`;
  fetch(getBrandInfoURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      return false;
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      dispatch(setBrandInfo(res.data));
    }
  });
};

require('es6-promise');
require('isomorphic-fetch');

const config = require('../../config');
const getUrlParam = require('../../helper/common-helper').getUrlParam;
const createAction = require('redux-actions').createAction;

const setAccumulationInfo = createAction('SET_ACCUMULATION_INFO', info => info);
const setCurrIntegralRule = createAction('SET_CURRINTEGRAL_RULE', rule => rule);

const shopId = getUrlParam('shopId');

// 获取基本信息
exports.fetchAccumulationInfo = (currentPage) => (dispatch, getStates) => {
  const pageSize = 12;
  return fetch(`${config.getIntegralDetailAPI}?shopId=${shopId}&currentPage=${currentPage}&pageSize=${pageSize}`, config.requestOptions)
    .then(res => {
      if (!res.ok) {
        return false;
      }
      return res.json();
    })
    .then(res => {
      if (res.code === '200') {
        dispatch(setAccumulationInfo(res.data));
      }
    });
};

// 获取当前积分基本信息
exports.fetchCurrIntegralRule = () => (dispatch, getStates) => {
  fetch(`${config.getCurrIntegralRuleAPI}?shopId=${shopId}`, config.requestOptions)
    .then(res => {
      if (!res.ok) {
        return false;
      }
      return res.json();
    })
    .then(res => {
      if (res.code === '200') {
        dispatch(setCurrIntegralRule(res.data));
      }
    });
};


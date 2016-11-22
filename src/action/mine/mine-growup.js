require('es6-promise');
require('isomorphic-fetch');

const config = require('../../config');
const getUrlParam = require('../../helper/common-helper').getUrlParam;
const createAction = require('redux-actions').createAction;

const setGrowupInfo = createAction('SET_GROWUP_INFO', info => info);
const setCurrGrownRule = createAction('SET_CURRGROWN_RULE', rule => rule);
const shopId = getUrlParam('shopId');

// 获取基本信息
exports.fetchGrowupInfo = (currentPage) => (dispatch, getStates) => {
  const pageSize = 12;
  return fetch(`${config.getGrownDetailAPI}?shopId=${shopId}&currentPage=${currentPage}&pageSize=${pageSize}`, config.requestOptions)
    .then(res => {
      if (!res.ok) {
        return false;
      }
      return res.json();
    })
    .then(res => {
      if (res.code === '200') {
        dispatch(setGrowupInfo(res.data));
      }
    });
};

exports.fetchCurrGrownRule = () => (dispatch, getStates) =>
  fetch(`${config.getCurrGrownRuleAPI}?shopId=${shopId}`, config.requestOptions)
    .then(res => {
      if (!res.ok) {
        return false;
      }
      return res.json();
    })
    .then(res => {
      if (res.code === '200') {
        dispatch(setCurrGrownRule(res.data || []));
      }
    });

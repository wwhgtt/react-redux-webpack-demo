require('es6-promise');
require('isomorphic-fetch');

const config = require('../../config');
const getUrlParam = require('../../helper/common-helper').getUrlParam;
const createAction = require('redux-actions').createAction;

const setAccumulationInfo = createAction('SET_ACCUMULATION_INFO', info => info);
const shopId = getUrlParam('shopId');

// 获取基本信息
exports.fetchAccumulationInfo = () => (dispatch, getStates) => {
  fetch(`${config.getIntegralAPI}?shopId=${shopId}`, config.requestOptions)
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

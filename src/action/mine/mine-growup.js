require('es6-promise');
require('isomorphic-fetch');

const config = require('../../config');
const getUrlParam = require('../../helper/common-helper').getUrlParam;
const createAction = require('redux-actions').createAction;

const setGrowupInfo = createAction('SET_GROWUP_INFO', info => info);
const shopId = getUrlParam('shopId');

// 获取基本信息
exports.fetchGrowupInfo = () => (dispatch, getStates) => {
  fetch(`${config.getGrowthValueAPI}?shopId=${shopId}`, config.requestOptions)
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

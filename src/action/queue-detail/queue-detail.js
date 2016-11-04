require('es6-promise');
require('isomorphic-fetch');
const config = require('../../config');
const createAction = require('redux-actions').createAction;
const helper = require('../../helper/common-helper.js');
const setQueueInfo = createAction('SET_QUEUE_INFO', queueInfo => queueInfo);

const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setRefresh = exports.setRefresh = createAction('SET_REFRESH', isRefresh => isRefresh);

const shopId = helper.getUrlParam('shopId');
const orderId = helper.getUrlParam('orderId');

// 获取排队信息
const getQueueInfo = exports.getQueueInfo = () => (dispatch, getStates) => {
  const getQueueInfoURL = `${config.getQueueInfoAPI}?shopId=${shopId}&orderId=${orderId}`;
  fetch(getQueueInfoURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('获取排队信息失败'));
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      dispatch(setQueueInfo(res.data));
    } else {
      dispatch(setErrorMsg('获取排队信息失败'));
    }
    if (getStates().isRefresh) {
      dispatch(setRefresh(false));
    }
  });
};

// 取消排队
exports.cancelQueue = () => (dispatch, getStates) => {
  const cancelQueueURL = `${config.cancelQueueAPI}?shopId=${shopId}&orderId=${orderId}`;
  fetch(cancelQueueURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('取消排队失败，请重试'));
    }
    return res.json();
  }).
  then(res => {
    if (String(res.data.status) === '0') {
      dispatch(getQueueInfo());
    } else {
      dispatch(setErrorMsg('取消排队失败，请重试'));
    }
  });
};

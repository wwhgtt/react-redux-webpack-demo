require('es6-promise');
require('isomorphic-fetch');
const config = require('../../config');
const createAction = require('redux-actions').createAction;
const helper = require('../../helper/common-helper.js');
const setQueueInfo = createAction('SET_QUEUE_INFO', queueInfo => queueInfo);
const setQueueDetail = createAction('SET_QUEUE_DETAIL', queueDetail => queueDetail);

const setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setLoadMsg = createAction('SET_LOAD_MSG', loadInfo => loadInfo);
const setRefresh = exports.setRefresh = createAction('SET_REFRESH', isRefresh => isRefresh);

const shopId = helper.getUrlParam('shopId');
const orderSyn = helper.getUrlParam('orderSyn');


exports.getQueueDetail = () => (dispatch, getStates) => {
  if (!orderSyn) {
    dispatch(setErrorMsg('找不到订单号'));
    setTimeout(() => {
      location.href = `${config.shopDetailURL}?shopId=${shopId}`;
    }, 3000);
    return false;
  }
  dispatch(setLoadMsg({ status:true, word:'加载中' }));
  const getQueueDetailURL = `${config.getQueueDetailAPI}?shopId=${shopId}&orderSyn=${orderSyn}`;
  return fetch(getQueueDetailURL, config.requestOptions).
    then(res => {
      dispatch(setLoadMsg({ status:false, word:'' }));
      if (!res.ok) {
        dispatch(setErrorMsg('预订信息获取失败'));
      }
      return res.json();
    }).
    then(res => {
      dispatch(setLoadMsg({ status:false, word:'' }));
      if (res.code === '200') {
        dispatch(setQueueDetail(res.data));
        if (res.data.queue && res.data.queue.queueID) {
          sessionStorage.removeItem('PDrelatedId');
          sessionStorage.removeItem('PDorderSyn');
          sessionStorage.setItem('PDrelatedId', res.data.queue.queueID);
          sessionStorage.setItem('PDorderSyn', orderSyn);
        }
      } else {
        dispatch(setErrorMsg('预订信息获取失败'));
      }
      if (getStates().isRefresh) {
        dispatch(setRefresh(false));
      }
    }).
    catch(err =>
      console.log(err)
    );
};

// 获取排队信息
const getQueueInfo = exports.getQueueInfo = () => (dispatch, getStates) => {
  if (!orderSyn) {
    dispatch(setErrorMsg('找不到订单号'));
    setTimeout(() => {
      location.href = `${config.shopDetailURL}?shopId=${shopId}`;
    }, 3000);
    return;
  }
  const relatedId = sessionStorage.PDrelatedId;
  const getQueueInfoURL = `${config.queueMyPreOrderAPI}?shopId=${shopId}&relatedId=${relatedId}&relatedType=PD`;
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
  });
};

// 取消排队
exports.cancelQueue = () => (dispatch, getStates) => {
  const cancelQueueURL = `${config.cancelQueueAPI}?shopId=${shopId}&orderSyn=${orderSyn}`;
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

exports.clearErrorMsg = () => (dispatch, getStates) => {
  dispatch(setErrorMsg(''));
};

require('es6-promise');
require('isomorphic-fetch');
const config = require('../../config');
const createAction = require('redux-actions').createAction;
const helper = require('../../helper/common-helper.js');

const setInfo = createAction('SET_INFO', info => info);
exports.setChildView = createAction('SET_CHILDVIEW', viewHash => viewHash);
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setLoadStatus = createAction('SET_LOAD_STATUS', loadStatus => loadStatus);

const shopId = helper.getUrlParam('shopId');
const uuid = helper.getUrlParam('uuid');
const posDeviceID = helper.getUrlParam('posDeviceID');

// pos扫码信息，用于展示
exports.getPosLoginInfo = () => (dispatch, getState) => {
  const posLoginInfoRUL = `${config.getPosLoginInfoAPI}?shopId=${shopId}`;
  fetch(posLoginInfoRUL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('信息获取失败'));
    }

    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      dispatch(setInfo(res.data));
    } else {
      dispatch(setErrorMsg(res.msg));
    }
  });
};

// pos扫码登录
exports.loginWxByPos = () => (dispatch, getState) => {
  dispatch(setLoadStatus(true));
  const posLoginInfoRUL = `${config.loginWxByPosAPI}?shopId=${shopId}&uuid=${uuid}&posDeviceID=${posDeviceID}`;
  fetch(posLoginInfoRUL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('登录失败'));
    }

    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      dispatch(setLoadStatus(false));
      location.href = `http://${location.host}/user/loginFromPosScanSuc?shopId=${shopId}&uuid=${uuid}&posDeviceID=${posDeviceID}`;
    } else {
      dispatch(setErrorMsg(res.msg));
    }
  });
};

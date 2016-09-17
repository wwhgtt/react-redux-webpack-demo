const config = require('../../config');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');

const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
const getSendCodeParamStr = require('../../helper/register-helper.js').getSendCodeParamStr;
const shopId = getUrlParam('shopId');

const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setLoadingInfo = exports.setLoadingInfo = createAction('SET_LOADING_INFO', info => info);
const setSupportInfo = createAction('SET_SUPPORT_INFO', info => info);


exports.login = (info) => (dispatch, getState) => {
  if (!shopId) {
    dispatch(setErrorMsg('门店编码不能为空'));
    return false;
  }

  const returnUrl = getUrlParam('returnUrl') || encodeURIComponent(`/brand/index${location.search}`);
  if (info.isWeixin) {
    location.href = `${config.userLoginWXURL}?shopId=${shopId}&returnUrl=${returnUrl}`;
    return false;
  }

  dispatch(setLoadingInfo({ ing: true, text: '系统处理中...' }));
  const url = `${config.userLoginAPI}?shopId=${shopId}&mobile=${info.phoneNum}&code=${info.code}`;
  return fetch(url, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('登录失败'));
        dispatch(setLoadingInfo({ ing: false }));
      }
      return res.json();
    }).
    then(result => {
      dispatch(setLoadingInfo({ ing: false }));
      if (result.code !== '200') {
        dispatch(setErrorMsg(result.msg));
        return;
      }
      location.href = decodeURIComponent(returnUrl);
    }).
    catch(err => {
      console.log(err);
    });
};

exports.fetchVericationCode = (phoneNum) => (dispatch, getState) => {
  const obj = Object.assign({}, { shopId, mobile: phoneNum, timestamp: new Date().getTime() });
  const paramStr = getSendCodeParamStr(obj);
  const url = `${config.sendCodeAPI}?${paramStr}`;
  dispatch(setLoadingInfo({ ing: true, text: '发送中...' }));
  return fetch(url, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('验证码获取失败'));
        dispatch(setLoadingInfo({ ing: false }));
      }
      return res.json();
    }).
    then(result => {
      dispatch(setLoadingInfo({ ing: false }));
      if (result.code !== '200') {
        dispatch(setErrorMsg(result.msg));
        return;
      }
    }).
    catch(err => {
      console.log(err);
    });
};

exports.fetchSupportInfo = () => (dispatch, getState) => {
  const url = `${config.getUserLoginSupportAPI}?shopId=${shopId}`;
  dispatch(setLoadingInfo({ ing: true, text: '加载中...' }));
  return fetch(url, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setLoadingInfo({ ing: false }));
      }
      return res.json();
    }).
    then(result => {
      dispatch(setLoadingInfo({ ing: false }));
      if (result.code !== '200') {
        dispatch(setErrorMsg(result.msg));
        return;
      }

      dispatch(setSupportInfo(result.data));
    }).
    catch(err => {
      console.log(err);
    });
};


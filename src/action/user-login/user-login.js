const config = require('../../config');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');

const getUrlParam = require('../../helper/dish-helper.js').getUrlParam;
const getSendCodeParamStr = require('../../helper/register-helper.js').getSendCodeParamStr;
const shopId = getUrlParam('shopId');

const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setLoadingInfo = exports.setLoadingInfo = createAction('SET_LOADING_INFO', info => info);
const setSupportInfo = createAction('SET_SUPPORT_INFO', info => info);
const setTimeStamp = createAction('SET_TIMESTAMP', timestamp => timestamp);

exports.login = (info) => (dispatch, getState) => {
  let fromBrand = 1;
  if (!shopId) {
    dispatch(setErrorMsg('门店编码不能为空'));
    return false;
  }

  const returnUrl = getUrlParam('returnUrl') || encodeURIComponent(`/brand/index${location.search}`);
  const returnUrlDecode = decodeURIComponent(returnUrl);
  const returnUrlPath = returnUrlDecode.substring(0, returnUrlDecode.indexOf('?'));
  const isFromBrand = /dishBox|Dinner|queue|prepare/.test(returnUrlPath);
  if (isFromBrand) {
    fromBrand = 0;
  }

  if (info.isWeixin) {
    location.href = `${config.userLoginWXURL}?shopId=${shopId}&returnUrl=${returnUrl}&fromBrand=${fromBrand}`;
    return false;
  }

  dispatch(setLoadingInfo({ ing: true, text: '系统处理中...' }));
  const timestamp = getState().timestamp || new Date().getTime();
  const url = `${config.userLoginAPI}?shopId=${shopId}&mobile=${info.phoneNum}&code=${info.code}&timeStamp=${timestamp}&fromBrand=${fromBrand}`;
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
      throw new Error(err);
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
      dispatch(setTimeStamp(result.data.timeStamp));
    }).
    catch(err => {
      throw new Error(err);
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
      throw new Error(err);
    });
};


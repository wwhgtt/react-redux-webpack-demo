require('es6-promise');
require('isomorphic-fetch');
import { createAction } from 'redux-actions';
const config = require('../../config');
const helper = require('../../helper/common-helper.js');
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setLoadMsg = exports.setLoadMsg = createAction('SET_LOAD_MSG', loadinfo => loadinfo);
const setUserInfo = createAction('SET_USER_INFO', userInfo => userInfo);
const setPhoneCode = createAction('SET_PHONE_CODE', phoneCode => phoneCode);
const shopId = helper.getUrlParam('shopId');
const returnUrl = helper.getUrlParam('returnUrl');
const getSendCodeParamStr = require('../../helper/register-helper.js').getSendCodeParamStr;
const getFetchPostParam = require('../../helper/common-helper').getFetchPostParam;

exports.getUserInfo = () => (dispatch, getStates) => {
  const getRegisterInfoURL = `${config.registerInfoAPI}?shopId=${shopId}`;
  fetch(getRegisterInfoURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('获取用户信息失败'));
    }

    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      dispatch(setUserInfo(res.data));
    } else {
      dispatch(setErrorMsg(res.msg));
    }
  });
};

exports.saveRegisterMember = (info) => (dispatch, getStates) => {
  const registerURL = `${config.registerAPI}?shopId=${shopId}`;

  fetch(registerURL, getFetchPostParam(info)).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('用户注册失败'));
    }

    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      let displayUrl = '';
      dispatch(setLoadMsg({ status:false, word: '' }));
      dispatch(setPhoneCode(''));
      dispatch(setErrorMsg('注册成功'));
      if (returnUrl) {
        displayUrl = decodeURIComponent(returnUrl);
      } else {
        displayUrl = config.mineIndexURL;
      }
      setTimeout(() => {
        location.href = `${displayUrl}?shopId=${shopId}`;
      }, 3000);
    } else if (res.code === '10107') {
      dispatch(setPhoneCode(''));
      dispatch(setLoadMsg({ status:false, word: '' }));
      dispatch(setErrorMsg(res.msg));
    } else {
      dispatch(setLoadMsg({ status:false, word: '' }));
      dispatch(setErrorMsg(res.msg));
    }
  });
};

exports.sendCode = phoneNum => (dispatch, getStates) => {
  const codeObj = Object.assign({}, { shopId, mobile: phoneNum, timestamp: new Date().getTime() });
  const paramStr = getSendCodeParamStr(codeObj);
  const sendCodeURl = `${config.sendCodeAPI}?${paramStr}`;
  fetch(sendCodeURl, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('验证码发送失败'));
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      dispatch(setErrorMsg('验证码发送成功注意查收'));
    } else {
      dispatch(setErrorMsg(res.msg));
    }
  });
};

require('es6-promise');
require('isomorphic-fetch');
import { createAction } from 'redux-actions';
const config = require('../../config');
const helper = require('../../helper/common-helper.js');
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setLoadMsg = exports.setLoadMsg = createAction('SET_LOAD_MSG', loadinfo => loadinfo);
const setUserInfo = createAction('SET_USER_INFO', userInfo => userInfo);
const setPhoneFalg = createAction('SET_PHONE_FLAG', phoneFlag => phoneFlag);
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

const register = exports.saveRegisterMember = (info) => (dispatch, getStates) => {
  dispatch(setLoadMsg({ status: true, word: '注册中，请稍后……' }));
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
      dispatch(setPhoneFalg(true));
      dispatch(setErrorMsg('注册成功'));
      if (returnUrl) {
        displayUrl = decodeURIComponent(returnUrl);
      } else {
        displayUrl = config.mineIndexURL;
      }
      setTimeout(() => {
        location.href = `${displayUrl}?shopId=${shopId}`;
      }, 3000);
    } else if (res.code === '20013') {
      dispatch(setPhoneFalg(false));
      dispatch(setErrorMsg(''));
      dispatch(setLoadMsg({ status:false, word: '' }));
    } else {
      dispatch(setPhoneFalg(true));
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

exports.checkCode = phoneInfo => (dispatch, getStates) => {
  dispatch(setLoadMsg({ status: true, word: '验证中……' }));
  const checkCodeURL = `${config.checkCodeAvaliableAPI}?shopId=${shopId}&mobile=${phoneInfo.phoneNum}&code=${phoneInfo.code}`;
  fetch(checkCodeURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('手机验证失败'));
    }
    return res.json();
  }).then(res => {
    if (res.code === '200') {
      dispatch(setLoadMsg({ status:false, word: '' }));
      dispatch(setErrorMsg('验证成功'));
      dispatch(setPhoneFalg(true));
      dispatch(register());
    } else {
      dispatch(setErrorMsg(res.msg));
    }
  });
};

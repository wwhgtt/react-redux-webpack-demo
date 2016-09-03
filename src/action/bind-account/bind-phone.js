import { createAction } from 'redux-actions';
const config = require('../../config');
const helper = require('../../helper/common-helper.js');

exports.setChildView = createAction('SET_CHILDVIEW', viewHash => viewHash);
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const getSendCodeParamStr = require('../../helper/register-helper.js').getSendCodeParamStr;

require('es6-promise');
require('isomorphic-fetch');

const shopId = helper.getUrlParam('shopId');

// 发送验证码
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
      console.log(res);
    } else {
      dispatch(setErrorMsg(res.msg));
    }
  });
};

// 绑定手机
exports.bindPhone = phoneInfo => (dispatch, getStates) => {
  const phoneNum = phoneInfo.phoneNum;
  const code = phoneInfo.code;
  const bindPhoneURL = `${config.bindPhoneAPI}?shopId=${shopId}&mobile=${phoneNum}&code=${code}`;

  fetch(bindPhoneURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('绑定手机失败'));
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      window.sessionStorage.setItem('phoneNum', phoneInfo.phoneNum);
      location.hash = '#phone-success';
    } else {
      dispatch(setErrorMsg(res.msg));
    }
  });
};

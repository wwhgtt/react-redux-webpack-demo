import { createAction } from 'redux-actions';
const config = require('../../config');
const helper = require('../../helper/common-helper.js');

exports.setChildView = createAction('SET_CHILDVIEW', viewHash => viewHash);
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
// const setPhone = createAction('SET_PHONE', phoneInfo => phoneInfo);
require('es6-promise');
require('isomorphic-fetch');

const shopId = helper.getUrlParam('shopId');

exports.sendCode = phoneNum => (dispatch, getStates) => {
  const sendCodeURl = `${config.sendCodeAPI}?shopId=${shopId}&mobile=${phoneNum}`;
  // const sendCodeURl = `${config.sendCodeAPI}`;
  fetch(sendCodeURl, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('验证码发送失败'));
    }
    return res.json();
  }).
  then(res => {
    if (res.code !== '200') {
      dispatch(setErrorMsg(res.msg));
    } else {
      console.log(res);
    }
  });
};

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
    if (res.code !== '200') {
      dispatch(setErrorMsg(res.msg));
    } else {
      console.log(res);
    }
  });
  // if (phoneInfo) {
  //   console.log(phoneInfo.phoneNum);
  //   window.sessionStorage.setItem('phoneNum', phoneInfo.phoneNum);
  //   dispatch(setErrorMsg('成功'));
  //   location.hash = '#phone-success';
  // }
};

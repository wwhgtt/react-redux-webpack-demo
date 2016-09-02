import { createAction } from 'redux-actions';
const config = require('../../config');
const helper = require('../../helper/common-helper.js');

exports.setChildView = createAction('SET_CHILDVIEW', viewHash => viewHash);
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setWXInfo = exports.setWXInfo = createAction('SET_WX_INFO', wxInfo => wxInfo);
require('es6-promise');
require('isomorphic-fetch');

const shopId = helper.getUrlParam('shopId');

// 获取openid
exports.getOpenId = () => (dispatch, getStates) => {
  const wxUrl = encodeURIComponent('http://' + location.host + window.location.pathname + window.location.search + '#wx-info');
  const getOpenIdURL = `${config.wxOauthAPI}?shopId=${shopId}&returnUrl=${wxUrl}`;
  fetch(getOpenIdURL, config.requestOptions).
  then(res => {
    console.log('已发送');
  });
};

// 获取微信信息
exports.getWXInfo = () => (dispatch, getStates) => {
  const getWXInfoURL = `${config.getWXInfoAPI}?shopId=${shopId}`;
  fetch(getWXInfoURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('信息获取失败'));
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      const headImg = res.data.headUrl;
      const wxName = res.data.name;
      const wxInfo = { headUrl: headImg, name: wxName };

      window.sessionStorage.wxInfo = JSON.stringify(wxInfo);
      console.log(res.data);
      dispatch(setWXInfo(res.data));
    } else {
      dispatch(setErrorMsg(res.msg));
    }
  });
};

// 绑定微信
exports.bindWX = () => (dispatch, getStates) => {
  const phoneNum = window.sessionStorage.getItem('mobile');
  const bindWXURL = `${config.bindWXAPI}?shopId=${shopId}&mobile=${phoneNum}`;
  fetch(bindWXURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('绑定微信失败'));
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      location.hash = '#wx-success';
    } else {
      dispatch(setErrorMsg(res.msg));
    }
  });
};

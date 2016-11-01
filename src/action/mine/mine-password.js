require('es6-promise');
require('isomorphic-fetch');

const config = require('../../config');
const getSendCodeParamStr = require('../../helper/register-helper.js').getSendCodeParamStr;
const getUrlParam = require('../../helper/common-helper').getUrlParam;
const shopId = getUrlParam('shopId');

// 修改密码
exports.modifyPassword = (data, setLoadding, showErrorMessage) => (dispatch, getStates) => {
  setLoadding({ ing: true, text: '系统处理中...' });
  fetch(`${config.modifyPwd}?shopId=${shopId}&newPwd=${data.newPassword}&oldPwd=${data.password}`, config.requestOptions)
    .then(res => {
      if (!res.ok) {
        return false;
      }

      return res.json();
    })
    .then(res => {
      setLoadding(false);
      if (res.code === '200') {
        location.href = `${config.mineSettingURL}${location.search}`;
        return;
      }

      showErrorMessage({ msg: res.msg });
    })
    .catch(err => {
      setLoadding(false);
      throw new Error(err);
    });
};

exports.resetPassword = (data, setLoadding, showErrorMessage) => (dispatch, getStates) => {
  setLoadding({ ing: true, text: '系统处理中...' });
  fetch(`${config.resetPassword}?shopId=${shopId}&pwd=${data.newPassword}&reNewPwd=${data.confirmedPassword}`, config.requestOptions)
    .then(res => {
      if (!res.ok) {
        return false;
      }

      return res.json();
    })
    .then(res => {
      setLoadding(false);
      if (res.code === '200') {
        const returnUrl = getUrlParam('returnUrl');
        location.href = returnUrl ? decodeURIComponent(returnUrl) : `${config.mineSettingURL}${location.search}`;
        return;
      }

      showErrorMessage({ msg: res.msg });
    })
    .catch(err => {
      setLoadding(false);
      throw new Error(err);
    });
};

exports.login = (info, args) => (dispatch, getState) => {
  const { setLoadding, showErrorMessage, callback } = args;
  if (!shopId) {
    showErrorMessage('门店编码不能为空');
    return false;
  }

  setLoadding({ ing: true, text: '系统处理中...' });
  const timestamp = info.timeStamp || new Date().getTime();
  const url = `${config.userLoginAPI}?shopId=${shopId}&mobile=${info.phoneNum}&code=${info.code}&timeStamp=${timestamp}`;
  return fetch(url, config.requestOptions).
    then(res => {
      if (!res.ok) {
        showErrorMessage('登录失败');
        setLoadding(false);
      }
      return res.json();
    }).
    then(result => {
      setLoadding(false);
      if (result.code !== '200') {
        showErrorMessage(result.msg);
        return;
      }

      if (callback) {
        callback();
      }
    }).
    catch(err => {
      throw new Error(err);
    });
};

exports.fetchVericationCode = (phoneNum, args) => (dispatch, getState) => {
  const { setLoadding, showErrorMessage, callback } = args;
  const obj = Object.assign({}, { shopId, mobile: phoneNum, timestamp: new Date().getTime() });
  const paramStr = getSendCodeParamStr(obj);
  const url = `${config.sendCodeAPI}?${paramStr}`;
  setLoadding({ ing: true, text: '发送中...' });
  return fetch(url, config.requestOptions).
    then(res => {
      if (!res.ok) {
        showErrorMessage('验证码获取失败');
        setLoadding(false);
      }
      return res.json();
    }).
    then(result => {
      setLoadding(false);
      if (result.code !== '200') {
        showErrorMessage(result.msg);
        return;
      }
      if (callback) {
        callback(result.data);
      }
    }).
    catch(err => {
      throw new Error(err);
    });
};

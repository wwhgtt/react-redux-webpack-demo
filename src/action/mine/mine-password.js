require('es6-promise');
require('isomorphic-fetch');

const config = require('../../config');
const getSendCodeParamStr = require('../../helper/register-helper.js').getSendCodeParamStr;
const getUrlParam = require('../../helper/common-helper').getUrlParam;
const shopId = getUrlParam('shopId');

const getSessionStorageValueOnce = (key, defaultValue) => {
  const value = sessionStorage.getItem(key);
  sessionStorage.removeItem(key);
  return value ? JSON.parse(value) : defaultValue;
};

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
      if (parseInt(res.data.status, 10)) {
        showErrorMessage({ msg: '修改成功', names:['success'] });
        setLoadding({ ing: true, text: '页面跳转中...' });
        setTimeout(() => {
          location.href = getSessionStorageValueOnce('rurl_modifyPwd', `${config.mineSettingURL}${location.search}`);
        }, 2000);
        return;
      }

      showErrorMessage({ msg: res.data.message, names:[''] });
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
      if (parseInt(res.data.status, 10) === 0) {
        showErrorMessage({ msg: '修改成功', names:['success'] });
        setTimeout(() => {
          const returnUrl = getUrlParam('url');
          location.href = returnUrl ? decodeURIComponent(returnUrl) : `${config.mineSettingURL}${location.search}`;
        }, 2000);
        return;
      }

      showErrorMessage({ msg: res.data.message, names:[''] });
    })
    .catch(err => {
      setLoadding(false);
      throw new Error(err);
    });
};

exports.login = (info, args) => (dispatch, getState) => {
  let fromBrand = 1;
  const { setLoadding, showErrorMessage, callback } = args;
  if (!shopId) {
    showErrorMessage('门店编码不能为空');
    return false;
  }

  setLoadding({ ing: true, text: '系统处理中...' });
  const timestamp = info.timeStamp || new Date().getTime();

  const returnUrl = getUrlParam('url') || '';
  const returnUrlDecode = decodeURIComponent(returnUrl);
  const returnUrlPath = returnUrlDecode.substring(0, returnUrlDecode.indexOf('?'));
  const isFromBrand = /dishBox|Dinner|queue|prepare/.test(returnUrlPath);
  if (isFromBrand) {
    fromBrand = 0;
  }

  const url = `${config.userLoginAPI}?shopId=${shopId}&mobile=${info.phoneNum}&code=${info.code}&timeStamp=${timestamp}&fromBrand${fromBrand}`;
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

exports.fetchUserInfo = (args) => (dispatch, getState) => {
  const { setLoadding, callback } = args;
  const url = `${config.getResetPasswordUserInfoAPI}?shopId=${shopId}`;
  setLoadding({ ing: true, text: '系统处理中...' });
  return fetch(url, config.requestOptions).
    then(res => {
      if (!res.ok) {
        setLoadding(false);
      }
      return res.json();
    }).
    then(result => {
      setLoadding(false);
      if (result.code === '200') {
        callback(result.data);
      }
    }).
    catch(err => {
      throw new Error(err);
    });
};

const config = require('../../config');
const commonHelper = require('../../helper/common-helper');

const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
const setInfo = createAction('SET_INFO', setinfo => setinfo);
const setErrorMsg = createAction('SET_ERROR_MSG', error => error);

// commonHelper.setCookie('mid',"b5d13adbc9d8d6ce93ad9f8ea4cc");

const shopId = commonHelper.getUrlParam('shopId');

const logUrl = `${config.logAddressURL}?shopId=${shopId}`;

const individualviewAPI = `${config.individualviewAPI}?shopId=${shopId}`;
const individualupdateAPI = `${config.individualupdateAPI}?shopId=${shopId}`;
const logoutAPI = `${config.logoutAPI}`;
const mineIndexUrl = `${config.mineIndexURL}?shopId=${shopId}`;

exports.getInfo = (id) => (dispatch, getStates) => {
  if (!shopId) {
    dispatch(setErrorMsg('找不到门店号'));
    return;
  }
  fetch(`${individualviewAPI}`, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('请求数据失败'));
    }
    return res.json();
  }).
  then(BasicData => {
    // console.log(BasicData)
    if (BasicData.code !== '200') {
      dispatch(setErrorMsg(BasicData.msg));
      setTimeout(() => {
        if (BasicData.msg === '未登录') {
          window.location.href = `${logUrl}&returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        }
      }, 3000);
      return;
    }
    // console.log(BasicData.data);
    dispatch(setInfo(BasicData.data));
  }).
  catch(err => {
    console.info(err);
  });
};
exports.updateInfo = (name, sex, condition) => (dispatch, getStates) => {
  if (!shopId) {
    dispatch(setErrorMsg('找不到门店号'));
    return;
  } else if (!sex.toString()) {
    dispatch(setErrorMsg('请选择性别!!'));
    return;
  } else if (!name.replace(/(^\s+)|(\s+$)/g, '')) {
    dispatch(setErrorMsg('请输入姓名!!'));
    return;
  }
  if (condition === 1) { // 此时点击跳转到"我的" 页面
    window.location.href = mineIndexUrl;
    return;
  }
  fetch(`${individualupdateAPI}`, commonHelper.fetchPost({ sex, name:name.replace(/(^\s+)|(\s+$)/g, '') })).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('请求数据失败'));
    }
    return res.json();
  }).
  then(BasicData => {
    if (BasicData.code !== '200') {
      dispatch(setErrorMsg(BasicData.msg));
      setTimeout(() => {
        if (BasicData.msg === '未登录') {
          window.location.href = `${logUrl}&returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        }
      }, 3000);
      return;
    }
    dispatch(setErrorMsg('保存成功'));
    setTimeout(() => { window.location.href = mineIndexUrl; }, 3000);
  }).
  catch(err => {
    console.info(err);
  });
};
exports.logOff = () => (dispatch, getStates) => {
  fetch(`${logoutAPI}`, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('请求数据失败'));
    }
    return res.json();
  }).
  then(BasicData => {
    if (BasicData.code !== '200') {
      dispatch(setErrorMsg(BasicData.msg));
      setTimeout(() => {
        if (BasicData.msg === '未登录') {
          window.location.href = `${logUrl}&returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        }
      }, 3000);
      return;
    }
    if (BasicData.data.isLogout) {
      dispatch(setErrorMsg('注销成功，请重新登陆'));
      setTimeout(() => {
        window.location.href = logUrl;
      }, 3000);
    }
  }).
  catch(err => {
    console.info(err);
  });
};
exports.clearErrorMsg = () => (dispatch, getStates) =>
  dispatch(setErrorMsg(null));

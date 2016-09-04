const config = require('../../config');
const commonHelper = require('../../helper/common-helper');

const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
const setInfo = createAction('SET_INFO', setinfo => setinfo);
const setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setLoadMsg = createAction('SET_LOAD_MSG', loadinfo => loadinfo);
// commonHelper.setCookie('mid',"b5d13adbc9d8d6ce93ad9f8ea4cc");

const shopId = commonHelper.getUrlParam('shopId');

const logUrl = `${config.logAddressURL}?shopId=${shopId}`;

const individualviewAPI = `${config.individualviewAPI}?shopId=${shopId}`;
const individualupdateAPI = `${config.individualupdateAPI}?shopId=${shopId}`;
const logoutAPI = `${config.logoutAPI}?shopId=${shopId}`;
const mineIndexUrl = `${config.mineIndexURL}?shopId=${shopId}`;

exports.getInfo = (id) => (dispatch, getStates) => {
  dispatch(setLoadMsg({ status:true, word:'加载中' }));
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
  then(basicData => {
    dispatch(setLoadMsg({ status:false, word:'' }));
    if (basicData.code !== '200') {
      dispatch(setErrorMsg(basicData.msg));
      setTimeout(() => {
        if (basicData.msg === '未登录') {
          window.location.href = `${logUrl}&returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        }
      }, 3000);
      return;
    }
    // console.log(basicData.data);
    dispatch(setInfo(basicData.data));
    // 保存电话号码到sessionStorage
    window.sessionStorage.mobile = basicData.data.mobile;
  }).
  catch(err => {
    console.info(err);
  });
};
exports.updateInfo = (name, sex, condition) => (dispatch, getStates) => {
  if (condition === 1) { // 此时点击跳转到"我的" 页面
    window.location.href = mineIndexUrl;
    return;
  }
  if (!shopId) {
    dispatch(setErrorMsg('找不到门店号'));
    return;
  } else if (!sex.toString()) {
    dispatch(setErrorMsg('请选择性别!!'));
    return;
  } else if (!name.replace(/(^\s+)|(\s+$)/g, '')) {
    dispatch(setErrorMsg('请输入姓名!!'));
    return;
  } else if (/['"#$%&\^*]/.test(name)) {
    dispatch(setErrorMsg('姓名不能包含特殊字符!!'));
    return;
  }
  dispatch(setLoadMsg({ status:true, word:'保存中' }));
  fetch(`${individualupdateAPI}`, commonHelper.fetchPost({ sex, name:name.replace(/(^\s+)|(\s+$)/g, '') })).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('请求数据失败'));
    }
    return res.json();
  }).
  then(basicData => {
    dispatch(setLoadMsg({ status:false, word:'' }));
    if (basicData.code !== '200') {
      dispatch(setErrorMsg(basicData.msg));
      setTimeout(() => {
        if (basicData.msg === '未登录') {
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
  dispatch(setLoadMsg({ status:true, word:'注销中' }));
  fetch(`${logoutAPI}`, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('请求数据失败'));
    }
    return res.json();
  }).
  then(basicData => {
    dispatch(setLoadMsg({ status:false, word:'' }));
    if (basicData.code !== '200') {
      dispatch(setErrorMsg(basicData.msg));
      setTimeout(() => {
        if (basicData.msg === '未登录') {
          window.location.href = `${logUrl}&returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        }
      }, 3000);
      return;
    }
    if (basicData.data.logout) {
      dispatch(setErrorMsg('注销成功，请重新登陆'));
      setTimeout(() => {
        window.location.href = logUrl;
      }, 3000);
    } else {
      dispatch(setErrorMsg('注销失败'));
    }
  }).
  catch(err => {
    console.info(err);
  });
};
exports.clearErrorMsg = () => (dispatch, getStates) =>
  dispatch(setErrorMsg(null));

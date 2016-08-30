const config = require('../../config');
const commonHelper = require('../../helper/common-helper');

const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
const setInfo = createAction('SET_INFO', setinfo => setinfo);
const setErrorMsg = createAction('SET_ERROR_MSG', error => error);

// commonHelper.setCookie('mid',"b5d13adbc9d8d6ce93ad9f8ea4cc");

const shopId = commonHelper.getUrlParam('shopId');
const wl = window.location;

const logUrl = `${config.logAddressURL}`;
const notFound = `${config.notFoundUrl}`;

const individualviewAPI = `${config.individualviewAPI}`;
const individualupdateAPI = `${config.individualupdateAPI}`;
const logoffAPI = `${config.logoffAPI}`;

exports.getInfo = (id) => (dispatch, getStates) => {
  if (!shopId) {
    dispatch(setErrorMsg('找不到门店号'));
    return;
  }
  fetch(`${individualviewAPI}?shopId=${shopId}`).
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
          wl.href = `${logUrl}?shopId=${shopId}&returnUrl=${encodeURIComponent(wl.pathname + wl.search)}`;
        }
      }, 3000);
      return;
    }
    // console.log(BasicData.data);
    dispatch(setInfo(BasicData.data));
  }).
  catch(err => {
    dispatch(setErrorMsg('获取基本信息失败...'));
  });
};
exports.updateInfo = (nameT, sexT) => (dispatch, getStates) => {
  if (!shopId) {
    wl.href = notFound;
    return;
  } else if (!sexT.toString()) {
    dispatch(setErrorMsg('请选择性别!!'));
    return;
  } else if (!nameT.replace(/(^\s+)|(\s+$)/g, '')) {
    dispatch(setErrorMsg('请输入姓名!!'));
    return;
  }
  fetch(`${individualupdateAPI}?shopId=${shopId}`, commonHelper.fetchPost({ sex:sexT, name:nameT.replace(/(^\s+)|(\s+$)/g, '') })).
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
          wl.href = `${logUrl}?shopId=${shopId}&returnUrl=${encodeURIComponent(wl.pathname + wl.search)}`;
        }
      }, 3000);
      return;
    }
    dispatch(setErrorMsg('保存成功'));
    setTimeout(() => { window.location.reload(); }, 3000);
  }).
  catch(err => {
    dispatch(setErrorMsg('保存失败!!'));
    setTimeout(() => { window.location.reload(); }, 3000);
  });
};
exports.logOff = () => (dispatch, getStates) => {
  fetch(`${logoffAPI}`).
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
          wl.href = `${logUrl}?shopId=${shopId}&returnUrl=${encodeURIComponent(wl.pathname + wl.search)}`;
        }
      }, 3000);
      return;
    }
    if (BasicData.data.isLogout) {
      dispatch(setErrorMsg('注销成功，请重新登陆'));
      setTimeout(() => {
        wl.href = logUrl;
      }, 3000);
    }
  }).
  catch(err => {
    dispatch(setErrorMsg('注销失败!!'));
    setTimeout(() => { window.location.reload(); }, 3000);
  });
};
exports.clearErrorMsg = () => (dispatch, getStates) =>
  dispatch(setErrorMsg(null));

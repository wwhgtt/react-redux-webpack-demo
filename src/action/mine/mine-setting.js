const config = require('../../config');
const commonHelper = require('../../helper/common-helper');

const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
const setInfo = createAction('SET_INFO', setinfo => setinfo);
const setErrorMsg = createAction('SET_ERROR_MSG', error => error);

// commonHelper.setCookie('mid',"b5d13adbc9d8d6ce93ad9f8ea4cc");

const shopId = commonHelper.getUrlParam('shopId');
const mid = commonHelper.getCookie('mid');
const wl = window.location;

const logUrl = `${config.logAddressURL}`;
const notFound = `${config.notFoundUrl}`;

const individualviewAPI = `${config.individualviewAPI}`;
const individualupdateAPI = `${config.individualupdateAPI}`;

exports.getInfo = (id) => (dispatch, getStates) => {
  if (!shopId) {
    wl.href = notFound;
    return;
  }
  fetch(`${individualviewAPI}?shopId=${shopId}&mId=${mid}`).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('请求数据失败'));
    }
    return res.json();
  }).
  then(BasicData => {
    // console.log(BasicData)
    if (BasicData.msg) {
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
  fetch(`${individualupdateAPI}?shopId=${shopId}&mId=${mid}`, commonHelper.fetchPost({ sex:sexT, name:nameT.replace(/(^\s+)|(\s+$)/g, '') })).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('请求数据失败'));
    }
    return res.json();
  }).
  then(BasicData => {
    if (BasicData.msg) {
      dispatch(setErrorMsg(BasicData.msg));
      setTimeout(() => {
        if (BasicData.msg === '未登录') {
          wl.href = `${logUrl}?shopId=${shopId}&returnUrl=${encodeURIComponent(wl.pathname + wl.search)}`;
        }
      }, 3000);
      return;
    }
    dispatch(setErrorMsg('修改成功'));
    setTimeout(() => { window.location.reload(); }, 3000);
  }).
  catch(err => {
    dispatch(setErrorMsg('修改失败!!'));
    setTimeout(() => { window.location.reload(); }, 3000);
  });
};
exports.logOff = () => (dispatch, getStates) => {
  commonHelper.delCookie('mid'); // 删除mid cookie
  dispatch(setErrorMsg('注销成功，请重新登陆'));
  setTimeout(() => {
    window.location.href = logUrl;
  }, 3000);
};

exports.clearErrorMsg = () => (dispatch, getStates) =>
  dispatch(setErrorMsg(null));

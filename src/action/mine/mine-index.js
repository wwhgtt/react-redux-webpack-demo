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

const individualAPI = `${config.individualAPI}`;

exports.getInfo = (id) => (dispatch, getStates) => {
  if (!shopId) {
    wl.href = notFound;
    return;
  }
  fetch(`${individualAPI}?shopId=${shopId}&mId=${mid}`).
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
          window.location.href = `${logUrl}?shopId=${shopId}&returnUrl=${encodeURIComponent(wl.pathname + wl.search)}`;
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

exports.clearErrorMsg = () => (dispatch, getStates) => {
  dispatch(setErrorMsg(''));
};

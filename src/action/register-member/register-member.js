require('es6-promise');
require('isomorphic-fetch');
const createAction = require('redux-actions').createAction;
const config = require('../../config');
const helper = require('../../helper/common-helper.js');
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setLoadMsg = exports.setLoadMsg = createAction('SET_LOAD_MSG', loadinfo => loadinfo);
const setUserInfo = createAction('SET_USER_INFO', userInfo => userInfo);
const shopId = helper.getUrlParam('shopId');
const returnUrl = helper.getUrlParam('returnUrl') || '';
const activation = helper.getUrlParam('activation');
const getFetchPostParam = require('../../helper/common-helper').getFetchPostParam;

exports.getUserInfo = () => (dispatch, getStates) => {
  let getRegisterInfoURL = `${config.registerInfoAPI}?shopId=${shopId}`;
  if (activation === 'memberCardActivate') {
    getRegisterInfoURL = `${getRegisterInfoURL}&activation=memberCardActivate`;
  }

  fetch(getRegisterInfoURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('获取用户信息失败'));
    }

    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      dispatch(setUserInfo(res.data));
    } else {
      dispatch(setErrorMsg(res.msg));
    }
  });
};

exports.saveRegisterMember = (info) => (dispatch, getStates) => {
  dispatch(setLoadMsg({ status: true, word: '注册中，请稍后……' }));
  let fromBrand = 1;

  let displayUrl = `${config.mineIndexURL}?shopId=${shopId}`;
  if (returnUrl) {
    displayUrl = decodeURIComponent(returnUrl);
    const displayUrlPath = displayUrl.substring(0, displayUrl.indexOf('?'));
    if (/selectDish/.test(displayUrlPath)) {
      fromBrand = 0;
    }
  }

  let registerURL = `${config.registerAPI}?shopId=${shopId}&fromBrand=${fromBrand}`;
  if (activation === 'memberCardActivate') {
    registerURL = `${registerURL}&activation=memberCardActivate`;
  }

  fetch(registerURL, getFetchPostParam(info)).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('用户注册失败'));
      dispatch(setLoadMsg({ status:false, word: '' }));
    }

    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      dispatch(setLoadMsg({ status:false, word: '' }));
      dispatch(setErrorMsg('注册成功'));

      setTimeout(() => {
        location.href = displayUrl;
      }, 3000);
    } else if (res.code === '20015') {
      dispatch(setErrorMsg(res.msg));
      dispatch(setLoadMsg({ status:false, word: '' }));
      setTimeout(() => {
        location.href = displayUrl;
      }, 3000);
    } else {
      dispatch(setLoadMsg({ status:false, word: '' }));
      dispatch(setErrorMsg(res.msg));
    }
  });
};

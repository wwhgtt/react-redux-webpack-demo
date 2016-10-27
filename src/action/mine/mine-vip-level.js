const config = require('../../config');
const commonHelper = require('../../helper/common-helper');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
const setGrownLevelInfo = createAction('SET_GROWN_LEVEL_INFO', grownLevelInfo => grownLevelInfo);
const setUserInfo = createAction('SET_USER_INFO', userInfo => userInfo);
const setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setLoadMsg = createAction('SET_LOAD_MSG', loadInfo => loadInfo);
const shopId = commonHelper.getUrlParam('shopId');

const getUserInfo = exports.getUserInfo = () => (dispatch, getStates) => {
  if (!shopId) {
    dispatch(setErrorMsg('找不到门店号'));
    return;
  }
  fetch(`${config.individualAPI}?shopId=${shopId}`, config.requestOptions).
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
      return;
    }
    dispatch(setUserInfo(basicData.data));
  }).
  catch(err => {
    console.info(err);
  });
};

exports.getGrownLevelInfo = () => (dispatch, getStates) => {
  dispatch(setLoadMsg({ status:true, word:'加载中' }));
  if (!shopId) {
    dispatch(setErrorMsg('找不到门店号'));
    return;
  }
  fetch(`${config.grownLevelxAPI}?shopId=${shopId}`, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('请求数据失败'));
    }
    return res.json();
  }).
  then(basicData => {
    getUserInfo()(dispatch, getStates);
    if (basicData.code !== '200') {
      dispatch(setErrorMsg(basicData.msg));
      return;
    }
    dispatch(setGrownLevelInfo(basicData.data));
  }).
  catch(err => {
    console.info(err);
  });
};

exports.clearErrorMsg = () => (dispatch, getStates) => {
  dispatch(setErrorMsg(''));
};

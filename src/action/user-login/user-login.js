const config = require('../../config');
const createAction = require('redux-actions').createAction;
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
require('es6-promise');
require('isomorphic-fetch');
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setLoadingInfo = exports.setLoadingInfo = createAction('SET_LOADING_INFO', info => info);

exports.login = (info) => (dispatch, getState) => {
  const shopId = getUrlParam('shopId');
  if (!shopId) {
    dispatch(setErrorMsg('门店编码不能为空'));
    return false;
  }

  dispatch(setLoadingInfo({ ing: true, text: '系统处理中...' }));
  const returnUrl = getUrlParam('returnUrl');
  const url = info.isWeixin ?
    `${config.userLoginWX}?shopId=${shopId}&returnUrl=${returnUrl || ''}` :
    `${config.userLogin}?shopId=${shopId}&mobile=${info.phoneNum}&code=${info.code}`;
  return fetch(url, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('登录失败'));
        dispatch(setLoadingInfo({ ing: false }));
      }
      return res.json();
    }).
    then(result => {
      dispatch(setLoadingInfo({ ing: false }));
      if (result.code !== '200') {
        dispatch(setErrorMsg(result.msg));
        return;
      }
      if (returnUrl) {
        location.href = decodeURIComponent(returnUrl);
      }
    }).
    catch(err => {
      console.log(err);
    });
};

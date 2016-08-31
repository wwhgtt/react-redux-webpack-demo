const config = require('../../config');
const createAction = require('redux-actions').createAction;
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
require('es6-promise');
require('isomorphic-fetch');
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);

exports.login = (info) => (dispatch, getState) => {
  const shopId = getUrlParam('shopId');
  if (!shopId) {
    dispatch(setErrorMsg('门店编码不能为空'));
    return false;
  }

  const url = info.isWeixin ?
    `${config.userLoginWX}?shopId=${shopId}` :
    `${config.userLogin}?shopId=${shopId}&mobile=${info.phoneNum}&code=${info.code}`;
  return fetch(url, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('登录失败'));
      }
      return res.json();
    }).
    then(result => {
      let returnUrl = getUrlParam('returnUrl');
      if (result.code !== '200') {
        dispatch(setErrorMsg(result.msg));
        return;
      }
      if (returnUrl) {
        returnUrl = decodeURIComponent(returnUrl);
        location.href = returnUrl;
      }
    }).
    catch(err => {
      console.log(err);
    });
};

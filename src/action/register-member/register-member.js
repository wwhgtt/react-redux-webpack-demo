import { createAction } from 'redux-actions';
const config = require('../../config');
// const helper = require('../../helper/common-helper.js');
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setUserInfo = createAction('SET_USER_INFO', userInfo => userInfo);
// const shopId = helper.getUrlParam('shopId');

exports.getUserInfo = () => (dispatch) => {
  // const getRegisterInfoURL = `${config.registerInfoAPI}?shopId=${shopId}`;
  fetch(config.registerInfoAPI).
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

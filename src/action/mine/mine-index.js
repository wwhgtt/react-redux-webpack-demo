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

const logUrl = `${config.logAddressURL}`;

const individualAPI = `${config.individualAPI}`;

exports.getInfo = (id) => (dispatch, getStates) => {
  dispatch(setLoadMsg({ status:true, word:'加载中' }));
  if (!shopId) {
    dispatch(setErrorMsg('找不到门店号'));
    return;
  }
  fetch(`${individualAPI}?shopId=${shopId}`, config.requestOptions).
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
          window.location.href = `${logUrl}?shopId=${shopId}&returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`;
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

exports.clearErrorMsg = () => (dispatch, getStates) => {
  dispatch(setErrorMsg(''));
};

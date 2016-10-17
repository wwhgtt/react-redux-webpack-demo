require('es6-promise');
require('isomorphic-fetch');
const createAction = require('redux-actions').createAction;
const config = require('../../config');
const commonHelper = require('../../helper/common-helper.js');

// 提示信息
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
// 时间戳
const setTimestamp = exports.setTimestamp = createAction('SET_TIMESTAMP', timestamp => timestamp);
// 加载时提示信息
const setLoadMsg = exports.setLoadMsg = createAction('SET_LOAD_MSG', loadinfo => loadinfo);
// hash
exports.setChildView = createAction('SET_CHILDVIEW', viewHash => viewHash);


const shopId = commonHelper.getUrlParam('shopId');
// 发送验证码参数
const getSendCodeParamStr = require('../../helper/register-helper.js').getSendCodeParamStr;


exports.sendCode = phoneNum => (dispatch, getStates) => {
  const codeObj = Object.assign({}, { shopId, mobile: phoneNum, timestamp: new Date().getTime() });
  const paramStr = getSendCodeParamStr(codeObj);
  const sendCodeURl = `${config.sendCodeAPI}?${paramStr}`;
  fetch(sendCodeURl, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('验证码发送失败'));
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      dispatch(setErrorMsg('验证码发送成功注意查收'));
      dispatch(setTimestamp(res.data.timeStamp));
    } else {
      dispatch(setErrorMsg(res.msg));
    }
  });
};

exports.checkCode = (phoneInfo, userInfo) => (dispatch, getStates) => {
  dispatch(setLoadMsg({ status: true, word: '验证中……' }));
  const timestamp = getStates().timestamp || new Date().getTime();
  const checkCodeURL = `${config.checkCodeAvaliableAPI}?shopId=${shopId}&mobile=${phoneInfo.phoneNum}&code=${phoneInfo.code}&timeStamp=${timestamp}`;

  fetch(checkCodeURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('手机验证失败'));
      dispatch(setLoadMsg({ status:false, word: '' }));
    }
    return res.json();
  }).then(res => {
    if (res.code === '200') {
      dispatch(setLoadMsg({ status:false, word: '' }));
    } else {
      dispatch(setErrorMsg(res.msg));
      dispatch(setLoadMsg({ status:false, word: '' }));
    }
  });
};

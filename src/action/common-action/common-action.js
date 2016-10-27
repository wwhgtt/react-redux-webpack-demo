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

// 将url参数整合成字符串
const getUrlParams = commonHelper.getUrlParams;

// 发送验证码
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
// &mobile=${phoneInfo.phoneNum}&code=${phoneInfo.code}

// 校验手机绑定验证码
exports.checkBindCode = (phoneInfo, vipCallBack, successCallBack, boundCallBack) => (dispatch, getStates) => {
  dispatch(setLoadMsg({ status: true, word: '验证中……' }));
  const timestamp = getStates().timestamp || new Date().getTime();
  const paramStr = getUrlParams(phoneInfo);
  const validBindMobileURL =
  `${config.validBindMobileAPI}?shopId=${shopId}&timeStamp=${timestamp}&${paramStr}`;

  fetch(validBindMobileURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('手机验证失败'));
      dispatch(setLoadMsg({ status:false, word: '' }));
    }
    return res.json();
  }).then(res => {
    if (res.code === '200') {
      if (res.data.vip) {
        // 是会员
        vipCallBack();
      } else {
        // 验证成功
        successCallBack();
      }
      dispatch(setLoadMsg({ status:false, word: '' }));
    } else if (res.code === '11005') {
      // 该手机已于其他微信号绑定
      boundCallBack();
      dispatch(setLoadMsg({ status:false, word: '' }));
    } else {
      dispatch(setErrorMsg(res.msg));
      dispatch(setLoadMsg({ status:false, word: '' }));
    }
  });
};

// 绑定手机
exports.bindPhone = (phoneInfo, successCallBack) => (dispatch, getStates) => {
  const phoneNum = phoneInfo.phoneNum;
  const bindPhoneURL = `${config.bindPhoneAPI}?shopId=${shopId}&mobile=${phoneNum}`;

  fetch(bindPhoneURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setLoadMsg({ status: false, word: '' }));
      dispatch(setErrorMsg('绑定手机失败'));
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      successCallBack();
    } else {
      dispatch(setLoadMsg({ status: false, word: '' }));
      dispatch(setErrorMsg(res.msg));
    }
  });
};

// 绑定微信
exports.bindWX = (phoneInfo, successCallBack) => (dispatch, getStates) => {
  const bindWXURL = `${config.bindWXAPI}?shopId=${shopId}&mobile=${phoneInfo.phoneNum}`;
  fetch(bindWXURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('绑定微信失败'));
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      successCallBack();
    } else {
      dispatch(setErrorMsg(res.msg));
    }
  });
};

// 用户退出
exports.logout = (successCallBack, faildCallBack) => (dispatch, getStates) => {
  const logoutURL = `${config.logoutAPI}?shopId=${shopId}`;
  fetch(logoutURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      faildCallBack();
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      successCallBack();
    } else {
      faildCallBack();
    }
  });
};

require('es6-promise');
require('isomorphic-fetch');
const createAction = require('redux-actions').createAction;
const config = require('../../config');
const commonHelper = require('../../helper/common-helper.js');

exports.setChildView = createAction('SET_CHILDVIEW', viewHash => viewHash);
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setLoadMsg = exports.setLoadMsg = createAction('SET_LOAD_MSG', loadinfo => loadinfo);

const formateObjToParamStr = commonHelper.formateObjToParamStr;
const shopId = commonHelper.getUrlParam('shopId');

// 校验手机绑定验证码
exports.checkBindCodeActive = (phoneInfo, vipCallBack, successCallBack, boundCallBack) => (dispatch, getStates) => {
  dispatch(setLoadMsg({ status: true, word: '验证中……' }));
  const timestamp = getStates().timestamp || new Date().getTime();
  const paramStr = formateObjToParamStr(phoneInfo);
  const validBindMobileURL =
  `${config.validBindMobileActiveAPI}?shopId=${shopId}&timeStamp=${timestamp}&${paramStr}`;

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

const config = require('../../config');
const createAction = require('redux-actions').createAction;
const getUrlParam = require('../../helper/dish-helper.js').getUrlParam;
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setOrderInLineProps = createAction('SET_ORDER_INLINE_PROPS', props => props);
exports.setCustomerProps = createAction('SET_CUSTOMER_PROPS', props => props);
exports.setOrderProps = createAction('SET_ORDER_PROPS', (evt, option) => option);
const setPhoneValidateProps = exports.setPhoneValidateProps = createAction('SET_PHONE_VALIDATE_PROPS', bool => bool);
const setTimeStamp = createAction('SET_TIMESTAMP', timestamp => timestamp);
const getSendCodeParamStr = require('../../helper/register-helper.js').getSendCodeParamStr;
require('es6-promise');
require('isomorphic-fetch');
const shopId = getUrlParam('shopId');

exports.fetchOrderInLineProps = () => (dispatch, getState) =>
fetch(`${config.getOrderInLineAPI}?shopId=${shopId}`, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('获取排队信息失败...'));
    }
    return res.json();
  }).
  then(result => {
    if (result.data.orderSyn) {
      location.href = `/queue/success?shopId=${shopId}&orderSyn=${result.data.orderSyn}`;
    } else {
      dispatch(setOrderInLineProps(result.data));
    }
    // else if (!result.data.mobile) {
    //   location.href = `http://${location.host}/user/bindMobile?shopId=${shopId}&returnUrl=${encodeURIComponent(location.href)}`;
    // }
  }).
  catch(err => {
    console.log(err);
  });
exports.clearErrorMsg = () => (dispatch, getState) =>
    dispatch(setErrorMsg(null));

const submitOrder = exports.submitOrder = () => (dispatch, getState) => {
  const state = getState();
  if (!state.customerProps.name || !state.customerProps.mobile || state.customerProps.sex === null) {
    dispatch(setErrorMsg('请先完善排队信息...'));
    return;
  }
  let mobile = state.customerProps.mobile.toString();
  if (mobile.indexOf('4') === 0 && mobile.length === 9) {
    mobile = '0' + mobile;
  }
  if (!(/^1(3|4|5|7|8)\d{9}$/.test(mobile))) {
    dispatch(setErrorMsg('手机号码有误，请重填'));
    return;
  }
  const params = '?shopId=' + shopId
    + '&name=' + state.customerProps.name
    + '&sex=' + state.customerProps.sex
    + '&mobile=' + mobile
    + '&peopleCount=' + state.dinePersonCount;
  fetch(`${config.submitOrderInLineAPI}${params}`, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('提交排队信息失败...'));
      }
      return res.json();
    })
    .then(result => {
      if (result.code.toString() === '200') {
        // dispatch(setErrorMsg('提交排队信息成功...'));
        location.href = `/queue/success?shopId=${shopId}&orderSyn=${result.data.orderSyn}`;
      } else if (result.code.toString() === '20013') {
        dispatch(setPhoneValidateProps(true));
      } else {
        dispatch(setErrorMsg(result.msg));
      }
    })
    .catch(err => {
      console.log(err);
    });
};
exports.fetchVericationCode = (phoneNum) => (dispatch, getState) => {
  const obj = Object.assign({}, { shopId, mobile: phoneNum, timestamp: new Date().getTime() });
  const paramStr = getSendCodeParamStr(obj);
  const url = `${config.sendCodeAPI}?${paramStr}`;
  return fetch(url, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('验证码获取失败'));
      }
      return res.json();
    }).
    then(result => {
      if (result.code !== '200') {
        dispatch(setErrorMsg(result.msg));
        return;
      }
      dispatch(setTimeStamp(result.data.timeStamp));
    }).
    catch(err => {
      console.log(err);
    });
};
exports.checkCodeAvaliable = (data) => (dispatch, getState) => {
  const timestamp = getState().timeStamp || new Date().getTime();
  fetch(
    `${config.checkCodeAvaliableAPI}?mobile=${data.phoneNum}&code=${data.code}&shopId=${shopId}&timeStamp=${timestamp}`,
    config.requestOptions
  )
  .then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('校验验证码信息失败...'));
    }
    return res.json();
  })
  .then(result => {
    if (result.code.toString() === '200') {
      submitOrder()(dispatch, getState);
    } else {
      dispatch(setErrorMsg(result.msg), setPhoneValidateProps(true));
    }
  })
  .catch(err => {
    console.log(err);
  });
};

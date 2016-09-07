const config = require('../../config');
const createAction = require('redux-actions').createAction;
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setOrderInLineProps = createAction('SET_ORDER_INLINE_PROPS', props => props);
exports.setCustomerProps = createAction('SET_CUSTOMER_PROPS', props => props);
exports.setOrderProps = createAction('SET_ORDER_PROPS', (evt, option) => option);
const setPhoneValidateProps = exports.setPhoneValidateProps = createAction('SET_PHONE_VALIDATE_PROPS', bool => bool);
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
    if (result.data.orderId) {
      dispatch(setErrorMsg('已成功排队，无需再次排队...'));
      location.href = `/queue/success?shopId=${shopId}&orderId=${result.data.orderId}`;
    } else {
      dispatch(setOrderInLineProps(result.data));
    }
  }).
  catch(err => {
    console.log(err);
  });
exports.clearErrorMsg = () => (dispatch, getState) =>
    dispatch(setErrorMsg(null));

const submitOrder = exports.submitOrder = () => (dispatch, getState) => {
  const state = getState();
  const code = state.phoneValidateCode ? `&code=${state.phoneValidateCode}` : '';
  if (!state.customerProps.name || !state.customerProps.mobile || state.customerProps.sex === null) {
    dispatch(setErrorMsg('请先完善排队信息...'));
    return;
  }
  let mobile = state.customerProps.mobile.toString();
  if (mobile.indexOf('4') === 0 && mobile.length === 9) {
    mobile = '0' + mobile;
  }
  const params = '?shopId=' + shopId
    + '&name=' + state.customerProps.name
    + '&sex=' + state.customerProps.sex
    + '&mobile=' + mobile
    + '&peopleCount=' + state.dinePersonCount
    + code;
  fetch(`${config.submitOrderInLineAPI}${params}`, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('提交排队信息失败...'));
      }
      return res.json();
    })
    .then(result => {
      if (result.code.toString() === '200') {
        dispatch(setErrorMsg('提交排队信息成功...'));
        location.href = `/queue/success?shopId=${shopId}&orderId=${result.data.orderId}`;
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
    }).
    catch(err => {
      console.log(err);
    });
};
exports.checkCodeAvaliable = (data) => (dispatch, getState) =>
  fetch(`${config.checkCodeAvaliableAPI}?mobile=${data.phoneNum}&code=${data.code}&shopId=${shopId}`, config.requestOptions)
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

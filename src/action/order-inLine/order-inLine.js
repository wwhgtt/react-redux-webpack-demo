const config = require('../../config');
const createAction = require('redux-actions').createAction;
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setOrderInLineProps = createAction('SET_ORDER_INLINE_PROPS', props => props);
exports.setCustomerProps = createAction('SET_CUSTOMER_PROPS', props => props);
exports.setOrderProps = createAction('SET_ORDER_PROPS', (evt, option) => option);
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
    dispatch(setOrderInLineProps(result.data));
  }).
  catch(err => {
    console.log(err);
  });
exports.clearErrorMsg = () => (dispatch, getState) =>
    dispatch(setErrorMsg(null));

exports.placeOrder = () => (dispatch, getState) => {
  // name,mobile,sex,peopleCount
  const state = getState();
  const params = '?shopId=' + shopId
    + '&name=' + state.customerProps.name
    + '&sex=' + state.customerProps.sex
    + '&mobile=' + state.customerProps.mobile
    + '&peopleCount=' + state.dinePersonCount;
  fetch(`${config.submitOrderInLineAPI}${params}`, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('提交排队信息失败...'));
      }
      return res.json();
    }).
      then(result => {
        dispatch(setErrorMsg('提交排队信息成功...'));
      }).
      catch(err => {
        console.log(err);
      });
};

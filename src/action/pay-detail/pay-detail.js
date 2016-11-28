require('es6-promise');
require('isomorphic-fetch');
const config = require('../../config');
const createAction = require('redux-actions').createAction;

const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setPayProps = createAction('SET_PAY_PROPS', props => props);

const getUrlParam = require('../../helper/common-helper.js').getUrlParam;
const shopId = getUrlParam('shopId');

exports.fetchPayDetail = () => (dispatch, getState) =>
  fetch(`${config.getPayDetailAPI}?shopId=${shopId}&orderType=${getUrlParam('orderType')}&orderId=${getUrlParam('orderId')}`, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取支付信息失败'));
        return false;
      }
      return res.json();
    }).
    then(res => {
      if (String(res.code) === '200') {
        dispatch(setPayProps(res.data));
      } else {
        dispatch(setErrorMsg('获取支付信息失败'));
      }
    });

const config = require('../../config');
const createAction = require('redux-actions').createAction;
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setOrderInLineProps = createAction('SET_ORDER_INLINE_PROPS', props => props);
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

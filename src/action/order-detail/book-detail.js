require('es6-promise');
require('isomorphic-fetch');
const config = require('../../config');
const createAction = require('redux-actions').createAction;
const helper = require('../../helper/common-helper.js');
const setBookDetail = createAction('SET_BOOK_DETAIL', bookDetail => bookDetail);

const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);

const shopId = helper.getUrlParam('shopId');
const orderId = helper.getUrlParam('orderId');

exports.getBookDetail = () => (dispatch, getStates) => {
  const getBookDetailURL = `${config.getBookDetailAPI}?shopId=${shopId}&orderId=${orderId}`;
  fetch(getBookDetailURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('预订信息获取失败'));
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      dispatch(setBookDetail(res.data));
    } else {
      dispatch(setErrorMsg('预订信息获取失败'));
    }
  });
};

require('es6-promise');
require('isomorphic-fetch');
const config = require('../../config');
const createAction = require('redux-actions').createAction;
const helper = require('../../helper/common-helper.js');
const setBookDetail = createAction('SET_BOOK_DETAIL', bookDetail => bookDetail);
const setBookInfo = createAction('SET_BOOK_INFO', bookInfo => bookInfo);
const setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setLoadMsg = createAction('SET_LOAD_MSG', loadInfo => loadInfo);
const shopId = helper.getUrlParam('shopId');
const orderId = helper.getUrlParam('orderId');

exports.getBookDetail = () => (dispatch, getStates) => {
  dispatch(setLoadMsg({ status:true, word:'加载中' }));
  const getBookDetailURL = `${config.getBookDetailAPI}?shopId=${shopId}&orderId=${orderId}`;
  return fetch(getBookDetailURL, config.requestOptions).
    then(res => {
      dispatch(setLoadMsg({ status:false, word:'' }));
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


exports.getBookInfo = () => (dispatch, getState) => {
  if (!shopId) {
    dispatch(setErrorMsg('找不到门店号'));
    return;
  }
  fetch(`${config.prepareMyPreOrderAPI}?shopId=${shopId}&orderId=${orderId}`, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('获取预点菜信息失败'));
    }
    return res.json();
  }).
  then(res => {
    dispatch(setLoadMsg({ status:false, word:'' }));
    if (res.code === '200') {
      dispatch(setBookInfo(res.data));
    } else {
      dispatch(setErrorMsg(res.msg));
    }
  });
};

exports.clearErrorMsg = () => (dispatch, getStates) => {
  dispatch(setErrorMsg(''));
};

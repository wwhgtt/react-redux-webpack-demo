require('es6-promise');
require('isomorphic-fetch');
const config = require('../../config');
const createAction = require('redux-actions').createAction;
const helper = require('../../helper/common-helper.js');

const setOrderList = createAction('SET_ORDER_LIST', orderList => orderList);
const setTakeOutList = createAction('SET_TAKE_OUT_LIST', takeOutList => takeOutList);
const setBookList = createAction('SET_BOOK_LIST', bookList => bookList);
const setQueueList = createAction('SET_QUEUE_LIST', queueList => queueList);

exports.setChildView = createAction('SET_CHILD_VIEW', childView => childView);
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
const setLoadStatus = createAction('SET_LOAD_STATUS', loadStatus => loadStatus);

const shopId = helper.getUrlParam('shopId');

// 堂食订单列表
exports.getOrderList = (pageNum) => (dispatch, getStates) => {
  dispatch(setLoadStatus(true));
  const orderListURL = `${config.orderListAPI}?shopId=${shopId}&pageNum=${pageNum}`;
  fetch(orderListURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('订单列表获取失败'));
      dispatch(setLoadStatus(false));
    }
    return res.json();
  }).
  then(res => {
    dispatch(setLoadStatus(false));
    if (res.code === '200') {
      dispatch(setOrderList(res.data));
    } else {
      dispatch(setErrorMsg('订单列表获取失败'));
    }
  });
};

// 外卖订单列表
exports.getTakeOutList = (pageNum) => (dispatch, getStates) => {
  dispatch(setLoadStatus(true));
  const takeOutListURL = `${config.takeOutListAPI}?shopId=${shopId}&pageNum=${pageNum}`;
  fetch(takeOutListURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('订单列表获取失败'));
      dispatch(setLoadStatus(false));
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      dispatch(setTakeOutList(res.data.list));
    } else {
      dispatch(setErrorMsg('订单列表获取失败'));
    }
    dispatch(setLoadStatus(false));
  });
};

// 预订订单列表
exports.getBookList = (pageNum) => (dispatch, getStates) => {
  dispatch(setLoadStatus(true));
  const bookListURL = `${config.bookListAPI}?shopId=${shopId}&pageNum=${pageNum}`;
  fetch(bookListURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('订单列表获取失败'));
      dispatch(setLoadStatus(false));
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      dispatch(setBookList(res.data.list));
    } else {
      dispatch(setErrorMsg('订单列表获取失败'));
    }
    dispatch(setLoadStatus(false));
  });
};

// 排队订单列表
exports.getQueueList = (pageNum) => (dispatch, getStates) => {
  dispatch(setLoadStatus(true));
  const queueListURL = `${config.queueListAPI}?shopId=${shopId}&pageNum=${pageNum}`;
  fetch(queueListURL, config.requestOptions).
  then(res => {
    if (!res.ok) {
      dispatch(setErrorMsg('订单列表获取失败'));
      dispatch(setLoadStatus(false));
    }
    return res.json();
  }).
  then(res => {
    if (res.code === '200') {
      dispatch(setQueueList(res.data.list));
    } else {
      dispatch(setErrorMsg('订单列表获取失败'));
    }
    dispatch(setLoadStatus(false));
  });
};

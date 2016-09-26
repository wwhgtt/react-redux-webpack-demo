const config = require('../../config');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');

const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
const storeDishesLocalStorage = require('../../helper/dish-hepler.js').storeDishesLocalStorage;
const clearDishesLocalStorage = require('../../helper/dish-hepler.js').clearDishesLocalStorage;
const shopId = getUrlParam('shopId');
const _setOrderDish = createAction('ORDER_DISH', (dishData, increment) => [dishData, increment]);
const initOrderInfo = createAction('INIT_ORDER_INFO', (evt, option) => option);
const setMenuData = createAction('SET_MENU_DATA', option => option);
const gotoDishMenuPage = exports.gotoDishMenuPage = () => {
  location.href = `/orderall/dishMenu4Dinner?type=${'TS'}&shopId=${shopId}`;
};

const setOrderInfo = exports.setOrderInfo = createAction('SET_ORDER_INFO', (evt, option) => option);
exports.setChildView = createAction('SET_CHILDVIEW', viewHash => viewHash);
exports.selectTable = createAction('SELECT_TABLE', option => option);

exports.fetchOrderInfo = (setErrorMsg) => (dispatch, getState) =>
  fetch(`${config.orderDineInAPi}?shopId=${shopId}`, config.requestOptions)
    .then(res => {
      if (!res.ok) {
        setErrorMsg('获取信息失败...');
      }
      return res.json();
    })
    .then(result => {
      dispatch(initOrderInfo(null, result.data));
    })
    .catch(err => {
      throw new Error(err);
    });

exports.fetchShopSetting = (setErrorMsg) => (dispatch, getState) => {
  fetch(`${config.getOrderTableTypeAPI}?shopId=${shopId}`, config.requestOptions)
    .then(res => {
      if (!res.ok) {
        setErrorMsg('获取信息失败...');
      }
      return res.json();
    })
    .then(result => {
      dispatch(setOrderInfo(null, { shopSetting: result.data || {} }));
    })
    .catch(err => {
      throw new Error(err);
    });
};

exports.fetchWXAuthInfo = (setErrorMsg) => (dispatch, getState) => {
  const url = encodeURIComponent(location.href);
  fetch(`${config.getWXAuthInfo}?shopId=${shopId}&reqUrl=${url}`, config.requestOptions)
    .then(res => {
      if (!res.ok) {
        setErrorMsg('获取信息失败...');
      }
      return res.json();
    })
    .then(result => {
      dispatch(setOrderInfo(null, { wxAuthInfo: result.data || {} }));
    })
    .catch(err => {
      throw new Error(err);
    });
};

exports.initOrderTable = (callback) => (dispatch, getState) => {
  const tableId = sessionStorage.getItem('tableKey') || sessionStorage.getItem('tableId');
  const tableInfo = { tableId };
  dispatch(setOrderInfo(null, tableInfo));
  if (callback) {
    callback(tableInfo);
  }
};

exports.fetchLastOrderedDishes = () => (dispatch, getState) => {
  const lastOrderedDishes = localStorage.getItem('lastOrderedDishes');
  if (!lastOrderedDishes) {
    gotoDishMenuPage();
    return;
  }

  const orderedDishes = JSON.parse(lastOrderedDishes) || {};
  dispatch(setMenuData({ dishList:  orderedDishes.dishes || [] }));
};

exports.setOrderDish = (dishData, increment) => (dispatch, getStates) => {
  dispatch(_setOrderDish(dishData, increment));
  storeDishesLocalStorage(getStates().dishMenu.dishesData, dishes => dishes);
};

exports.removeAllOrders = (orders) => (dispatch, getStates) => {
  dispatch(setMenuData({ dishList:  [] }));
  clearDishesLocalStorage();
  gotoDishMenuPage();
};

exports.submitOrder = (data, setLoading, setErrorMsg) => (dispatch, getState) => {
  const requestOptions = Object.assign({}, config.requestOptions, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  setLoading({ text: '系统处理中...', ing: true });
  return fetch(`${config.submitTSOrderCartAPI}?shopId=${shopId}`, requestOptions)
    .then(res => {
      setLoading({ ing: false });
      if (!res.ok) {
        setErrorMsg('下单失败');
      }
      return res.json();
    })
    .then(result => {
      if (result.code === '200') {
        clearDishesLocalStorage();
        location.href = `${config.tradeDetailUncheckURL}?type=${'TS'}&shopId=${shopId}&orderId=${result.data.orderId}`;
        return;
      }
      setErrorMsg(result.msg);
    })
    .catch(err => {
      throw new Error(err);
    });
};

exports.fetchTableIdFromNewVersionQRCode = (url, setLoading, callback) => (dispatch, getState) => {
  setLoading({ text: '系统处理中...', ing: true });
  const encodedUrl = encodeURIComponent(url);
  return fetch(`${config.getTableIdFromQRCode}?url=${encodedUrl}&shopId=${shopId}`, config.requestOptions)
    .then(res => {
      setLoading({ ing: false });
      return res.json();
    })
    .then(result => {
      callback(result);
    })
    .catch(err => {
      throw new Error(err);
    });
};

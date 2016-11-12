require('es6-promise');
require('isomorphic-fetch');

const config = require('../../config');
const createAction = require('redux-actions').createAction;
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
const storeDishesLocalStorage = require('../../helper/dish-hepler.js').storeDishesLocalStorage;
const clearDishesLocalStorage = require('../../helper/dish-hepler.js').clearDishesLocalStorage;
const getDishesCount = require('../../helper/dish-hepler').getDishesCount;
const orderDinnerCartHelper = require('../../helper/order-dinner-cart-helper.js');
const shopId = getUrlParam('shopId');
const _setOrderDish = createAction('ORDER_DISH', (dishData, increment) => [dishData, increment]);
const initOrderInfo = createAction('INIT_ORDER_INFO', (evt, option) => option);
const setMenuData = createAction('SET_MENU_DATA', option => option);

const getTableInfoFromStorage = () => orderDinnerCartHelper.getTableInfoInSessionStorage(shopId) || {};

const gotoExceptionPage = code => {
  const codeUrls = {
    90006: config.exceptionDishURL,
    90014: config.exceptionDishCurrentURL,
    90015: config.exceptionDishCurrentURL,
    90016: config.exceptionDishURL,
  };
  const url = codeUrls[code];
  if (!url) {
    return;
  }

  location.href = `${url}?shopId=${shopId}`;
};

const appendUrlParamsWithTableInfo = (url, data) => {
  const { tableId, tableKey } = getTableInfoFromStorage();
  let result = url;
  if (data && data.tableId) {
    return `${result}&tableId=${data.tableId}`;
  }
  if (tableId) {
    result += `&tableId=${tableId}`;
  }
  if (tableKey) {
    result += `&tableKey=${tableKey}`;
  }
  return result;
};

const gotoDishMenuPage = () => {
  const url = appendUrlParamsWithTableInfo(`/orderall/dishMenu4Dinner?type=${'TS'}&shopId=${shopId}`);
  location.href = url;
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
      if (result.code === 'NOT_LOGIN') {
        location.href = `${config.logAddressURL}?shopId=${shopId}&returnUrl=${encodeURIComponent(location.href)}`;
        return;
      }
      dispatch(initOrderInfo(null, result.data));
    })
    .catch(err => {
      throw new Error(err);
    });

exports.fetchShopSetting = (setErrorMsg) => (dispatch, getState) =>
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

exports.fetchWXAuthInfo = (setErrorMsg) => (dispatch, getState) => {
  const url = encodeURIComponent(location.href);
  fetch(`${config.getWXAuthInfoAPI}?shopId=${shopId}&reqUrl=${url}`, config.requestOptions)
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

exports.fetchMainOrderInfo = (tableId, tableKey, setErrorMsg) => (dispatch, getState) => {
  const url = appendUrlParamsWithTableInfo(`${config.getMainOrderAPI}?shopId=${shopId}`, null);
  fetch(url, config.requestOptions)
    .then(res => {
      if (!res.ok) {
        setErrorMsg('获取信息失败...');
      }
      return res.json();
    })
    .then(result => {
      if (result.code === '200') {
        const data = Object.assign({}, result.data);
        data.mainOrderId = data.tradeId;
        dispatch(setOrderInfo(null, data));
        return;
      }

      setErrorMsg(result.msg);
      setTimeout(() => {
        gotoExceptionPage(result.code);
      }, 3000);
    })
    .catch(err => {
      throw new Error(err);
    });
};

exports.initOrderTable = (callback) => (dispatch, getState) => {
  const tableInfo = getTableInfoFromStorage();
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
  const dishesData = getStates().dishMenu.dishesDataDuplicate;
  const count = getDishesCount(dishesData);
  storeDishesLocalStorage(dishesData, getStates().orderTSCart, dishes => dishes);
  if (count === 0) {
    clearDishesLocalStorage();
    gotoDishMenuPage();
  }
};

exports.removeAllOrders = (orders) => (dispatch, getStates) => {
  dispatch(setMenuData({ dishList:  [] }));
  clearDishesLocalStorage();
  gotoDishMenuPage();
};

exports.submitOrder = (tableKey, data, setLoading, setErrorMsg) => (dispatch, getState) => {
  const requestOptions = Object.assign({}, config.requestOptions, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  let url = `${config.submitTSOrderCartAPI}?shopId=${shopId}`;
  if (tableKey) {
    url += `&tableKey=${tableKey}`;
  }
  setLoading({ text: '系统处理中...', ing: true });
  return fetch(url, requestOptions)
    .then(res => {
      setLoading({ ing: false });
      if (!res.ok) {
        setErrorMsg('下单失败');
      }
      return res.json();
    })
    .then(result => {
      if (result.code === '200') {
        if (data.tableId) {
          orderDinnerCartHelper.setTableInfoInSessionStorage(shopId, { tableId: data.tableId });
        }
        clearDishesLocalStorage();
        const tradeDetailUncheckUrl =
          appendUrlParamsWithTableInfo(`${config.tradeDetailUncheckURL}?type=TS&shopId=${shopId}&orderId=${result.data.orderId}`, data);
        location.href = tradeDetailUncheckUrl;
        return;
      }
      setErrorMsg(result.msg);
      setTimeout(() => {
        gotoExceptionPage(result.code);
      }, 3000);
    })
    .catch(err => {
      throw new Error(err);
    });
};

exports.fetchTableIdFromNewVersionQRCode = (url, setLoading, callback) => (dispatch, getState) => {
  setLoading({ text: '系统处理中...', ing: true });
  const encodedUrl = encodeURIComponent(url);
  return fetch(`${config.getTableIdFromQRCodeAPI}?url=${encodedUrl}&shopId=${shopId}`, config.requestOptions)
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

exports.gotoDishMenuPage = () => (dispatch, getState) => {
  gotoDishMenuPage();
};

const config = require('../../config');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
const helper = require('../../helper/dish-hepler');
const commonHelper = require('../../helper/common-helper');
const setMenuData = createAction('SET_MENU_DATA', menuData => menuData);
const _orderDish = createAction('ORDER_DISH', (dishData, action) => [dishData, action]);
const _removeAllOrders = createAction('REMOVE_ALL_ORDERS', orders => orders);
const setDiscountToOrder = createAction('SET_DISCOUNT_TO_ORDER', discount => discount);
const setErrorMsg = exports.setErrorMsg = createAction('SET_ERROR_MSG', error => error);
exports.showDishDetail = createAction('SHOW_DISH_DETAIL', dishData => dishData);
exports.showDishDesc = createAction('SHOW_DISH_DESC', dishData => dishData);
const setCallMsg = createAction('SET_CALL_MSG', callInfo => callInfo);
const setCanCall = createAction('SET_CAN_CALL', canCall => canCall);
const setTimerStatus = createAction('SET_TIMER_STATUS', timerStatus => timerStatus);
const setServiceStatus = createAction('SET_SERVICE_STATUS', serviceStatus => serviceStatus);

exports.activeDishType = createAction('ACTIVE_DISH_TYPE', (evt, dishTypeId) => {
  if (evt && /dish-type-item/.test(evt.target.className)) {
    window.__activeTypeByTap__ = true;
  } else {
    window.__activeTypeByTap__ = false;
  }
  return dishTypeId;
});
const shopId = helper.getUrlParam('shopId');
let url = `${config.orderallMenuAPI}?shopId=${shopId}`;

exports.fetchMenuData = () => (dispatch, getStates) =>
  fetch(url, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取订单信息失败...'));
      }
      return res.json();
    }).
    then(menuData => {
      dispatch(setMenuData(helper.restoreDishesLocalStorage(menuData.data)));
    }).
    catch(err => {
      dispatch(setErrorMsg('加载订单信息失败...'));
    });

exports.orderDish = (dishData, action) => (dispatch, getStates) => {
  dispatch(_orderDish(dishData, action));
  helper.storeDishesLocalStorage(getStates().dishesData);
};

exports.removeAllOrders = (orders) => (dispatch, getStates) => {
  dispatch(_removeAllOrders(orders));
  helper.clearDishesLocalStorage();
};

exports.confirmOrder = () => (dispatch, getStates) => {
  const dishesData = getStates().dishesData;
  const orderedData = helper.getOrderedDishes(dishesData);
  const dishBoxChargeInfo = getStates().dishBoxChargeInfo;
  helper.deleteOldDishCookie();
  helper.setDishCookie(dishesData, orderedData);
  localStorage.setItem('dishBoxPrice', helper.getDishBoxprice(orderedData, dishBoxChargeInfo));
  //  堂食情况下需要考虑是否有tableId的情况
  const tableId = helper.getUrlParam('tableId');
  if (tableId) {
    location.href =
      `/orderall/dishBox?type=${helper.getUrlParam('type')}&shopId=${helper.getUrlParam('shopId')}&tableId=${tableId}`;
  } else {
    location.href =
      `/orderall/dishBox?type=${helper.getUrlParam('type')}&shopId=${helper.getUrlParam('shopId')}`;
  }
};
exports.fetchOrderDiscountInfo = () => (dispatch, getState) =>
  fetch(config.orderDiscountInfoAPI + '?shopId=' + helper.getUrlParam('shopId'), config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取会员价信息失败...'));
      }
      return res.json();
    }).
    then(discount => {
      if (discount.code.toString() !== '200') {
        if (discount.msg !== '未登录') {
          dispatch(setErrorMsg(discount.msg));
        }
      }
      dispatch(setDiscountToOrder(discount.data));
    }).
    catch(err => {
      console.log(err);
    });

exports.clearErrorMsg = () => (dispatch, getState) =>
  dispatch(setErrorMsg(null));

// call 服务铃
exports.callBell = (timer) => (dispatch, getStates) => {
  dispatch(setCanCall(false));
  dispatch(setCallMsg({ info:'正在发送...', callStatus:false }));
  fetch(`${config.getServiceStatusAPI}?shopId=${helper.getUrlParam('shopId')}`, config.requestOptions). // config.requestOptions
  then(res => {
    if (!res.ok) {
      dispatch(setCallMsg({ info:'非常抱歉，发送失败了', callStatus:false }));
    }
    return res.json();
  }).
  then(basicData => {
    if (basicData.code === '200') {
      dispatch(setCallMsg({ info:'客官稍等，服务员马上就来', callStatus:true }));
      dispatch(setTimerStatus({ timerStatus:true }));
      commonHelper.interValSetting(timer, () => {
        dispatch(setTimerStatus({ timerStatus:false }));
      });
    } else {
      dispatch(setCallMsg({ info:'非常抱歉，发送失败了', callStatus:false }));
    }
    dispatch(setCanCall(true));
  }).
  catch(err => {
    console.info(err);
  });
};

// 根据tableID获取基本信息（正常下单，加菜，异常）
const fetchTableStatus = exports.fetchTableStatus = (tableId) => (dispatch, getState) =>
  fetch(`${config.getShopStatusAPI}?shopId=${helper.getUrlParam('shopId')}&tableId=${tableId}`, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取会员价信息失败...'));
      }
      return res.json();
    }).
    then(baseInfo => {
      if (baseInfo.msg === '异常') {
        location.href = `${config.error1URL}`; // 此处判断跳转到异常页面的地址 error1URL error2URL error3URL error4URL
      }
    }).
    catch(err => {
      console.log(err);
    });
// 根据key值获取tableId
exports.fetchTableId = (key, tableId) => (dispatch, getState) => {
  if (tableId) {
    fetchTableStatus(tableId)(dispatch, getState);
    return;
  }
  fetch(`${config.getTableIdAPI}?shopId=${helper.getUrlParam('shopId')}&key=${key}`, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取tableId失败...'));
      }
      return res.json();
    }).
    then(response => {
      fetchTableStatus(response.data.tableId)(dispatch, getState);
    }).
    catch(err => {
      console.log(err);
    });
};
// 不带key获取基本信息
exports.fetchStatus = () => (dispatch, getState) =>
  fetch(`${config.getServiceStatusAPI}?shopId=${helper.getUrlParam('shopId')}`, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取会员价信息失败...'));
      }
      return res.json();
    }).
    then(baseInfo => {
      if (baseInfo.code !== '200') {
        if (baseInfo.msg === '未登录') {
          // 正常下单，加菜
          dispatch(setServiceStatus({ data:baseInfo.data, isLogin:false }));
        } else {
          dispatch(setErrorMsg(baseInfo.msg));
          dispatch(setServiceStatus({ data:baseInfo.data, isLogin:true }));
        }
      } else {
        dispatch(setServiceStatus({ data:baseInfo.data, isLogin:true }));
      }
    }).
    catch(err => {
      console.log(err);
    });
exports.clearBell = (msg) => (dispatch, getStates) => {
  dispatch(setCallMsg({ info:msg, callStatus:false }));
};

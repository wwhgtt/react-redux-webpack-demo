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
const setCanCall = createAction('SET_CAN_CALL', callAble => callAble);
const setTimerStatus = createAction('SET_TIMER_STATUS', timerStatus => timerStatus);
const setServiceStatus = createAction('SET_SERVICE_STATUS', serviceStatus => serviceStatus);
const setIsShowButton = createAction('SET_IS_SHOW_BUTTON', isShowButton => isShowButton);

exports.activeDishType = createAction('ACTIVE_DISH_TYPE', (evt, dishTypeId) => {
  if (evt && /dish-type-item/.test(evt.target.className)) {
    window.__activeTypeByTap__ = true;
  } else {
    window.__activeTypeByTap__ = false;
  }
  return dishTypeId;
});
const shopId = helper.getUrlParam('shopId');
const url = `${config.orderallMenuAPI}?shopId=${shopId}`;

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
  helper.storeDishesLocalStorage(getStates().dishMenuReducer.dishesData);
};

exports.removeAllOrders = (orders) => (dispatch, getStates) => {
  dispatch(_removeAllOrders(orders));
  helper.clearDishesLocalStorage();
};

exports.confirmOrder = () => (dispatch, getStates) => {
  const dishesData = getStates().dishMenuReducer.dishesData;
  const orderedData = helper.getOrderedDishes(dishesData);
  const dishBoxChargeInfo = getStates().dishMenuReducer.dishBoxChargeInfo;
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

const removeBasicSession = (name) => {
  sessionStorage.removeItem(name);
};

const errorLocation = (errorCode) => {
  switch (errorCode) {
    case '90006' : location.href = `${config.exceptionLinkURL}?shopId=${shopId}`; break; // 请重新扫描二维码,链接已失效
    // case '90008' : location.href = `${config.exceptionDishURL}?shopId=${shopId}`; break; // 该桌台有多个未支付的正餐订单
    // case '90012' : location.href = `${config.exceptionDishURL}?shopId=${shopId}`; break; // 该用户在该门店下有多个正餐加菜订单
    // case '90013' : location.href = `${config.exceptionDishURL}?shopId=${shopId}`; break; // 该用户在该门店下有多个正餐订单
    case '90014' : location.href = `${config.exceptionDishCurrentURL}?shopId=${shopId}`; break; // 该桌台待清台或锁定中，请稍等
    case '90015' : location.href = `${config.exceptionDishCurrentURL}?shopId=${shopId}`; break; // 桌台不存在
    case '90016' : location.href = `${config.exceptionDishURL}?shopId=${shopId}`; break; // 当前用户在该桌台有未处理的订单
    default : break;
  }
};

// call 服务铃
exports.callBell = (timer) => (dispatch, getStates) => {
  dispatch(setCanCall(false));
  dispatch(setCallMsg({ info:'正在发送...', callStatus:false }));
  const orderId = JSON.parse(sessionStorage.serviceStatus).orderId || '';

  fetch(`${config.callServiceAPI}?shopId=${commonHelper.getUrlParam('shopId')}&orderId=${orderId}`).
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
      if (basicData.code === '1501') { // 已经呼叫过服务员了
        dispatch(setCallMsg({ info:basicData.msg, callStatus:true }));
        dispatch(setTimerStatus({ timerStatus:true }));
        commonHelper.interValSetting(timer, () => {
          dispatch(setTimerStatus({ timerStatus:false }));
        });
        dispatch(setCanCall(true));
        return;
      }
      dispatch(setCallMsg({ info:'非常抱歉，发送失败了', callStatus:false }));
    }
    dispatch(setCanCall(true));
  }).
  catch(err => {
    dispatch(setCallMsg({ info:'网络出错', callStatus:false }));
    dispatch(setCanCall(true));
    console.info(err);
  });
};
// 根据tableId获取桌台基本信息
const fetchTableInfo = exports.fetchTableInfo = (tableParam) => (dispatch, getState) =>
  fetch(`${config.getTableInfoAPI}?shopId=${helper.getUrlParam('shopId')}&${tableParam}`, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取桌台基本信息失败...'));
      }
      return res.json();
    }).
    then(tableInfo => {
      if (tableInfo.code !== '200') {
        if (tableInfo.code !== 'NOT_LOGIN') {
          errorLocation(tableInfo.code); // 获取tableInfo错误地址跳转
          dispatch(setErrorMsg(tableInfo.msg));
        }
      }
      sessionStorage.tableInfo = JSON.stringify(tableInfo.data || {});
    }).
    catch(err => {
      console.log(err);
    });

// 根据tableId获取基本信息
const fetchServiceStatus = exports.fetchServiceStatus = (tableParam) => (dispatch, getState) =>
  fetch(`${config.getServiceStatusAPI}?shopId=${helper.getUrlParam('shopId')}&${tableParam}`, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取快捷菜单信息失败...'));
      }
      return res.json();
    }).
    then(serviceStatus => {
      if (serviceStatus.code !== '200') {
        if (serviceStatus.code === 'NOT_LOGIN') {
          const fakeServiceStatus = { enableCallService: false, enableOrder: false, enablePay : false };
          dispatch(setServiceStatus({ data:serviceStatus.data || fakeServiceStatus, isLogin:false }));
        } else {
          errorLocation(serviceStatus.code);
          dispatch(setErrorMsg(serviceStatus.msg));
          dispatch(setServiceStatus({ data:serviceStatus.data || {}, isLogin:true }));
        }
      } else {
        dispatch(setServiceStatus({ data:serviceStatus.data || {}, isLogin:true }));
      }
      // 保存ServiceStatus
      sessionStorage.serviceStatus = JSON.stringify(serviceStatus.data || {});
    }).
    catch(err => {
      console.log(err);
    });

// 根据isShowButton获取快捷菜单按钮是否显示
const fetchIsShowButton = exports.fetchIsShowButton = () => (dispatch, getState) =>
  fetch(`${config.getIsShowButtonAPI}?shopId=${helper.getUrlParam('shopId')}`, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取快捷菜单是否显示失败...'));
      }
      return res.json();
    }).
    then(isShowButton => {
      if (isShowButton.code === '200') {
        dispatch(setIsShowButton(isShowButton.data.isShow));
      }
    }).
    catch(err => {
      console.log(err);
    });

// 取到tableId 或者 根据key值获取tableId
exports.fetchTableId = (tableKey, tableId) => (dispatch, getState) => {
  removeBasicSession('tableInfo');
  removeBasicSession('serviceStatus');
  removeBasicSession('tableId');
  removeBasicSession('tableKey');
  fetchIsShowButton('')(dispatch, getState);
  // 没有tableId或者tableKey的情况
  if (!tableKey && !tableId) {
    fetchServiceStatus('')(dispatch, getState);
  } else if (tableKey) {
    fetchTableInfo(`tableKey=${tableKey}`)(dispatch, getState);
    fetchServiceStatus(`tableKey=${tableKey}`)(dispatch, getState);
  } else {
    fetchTableInfo(`tableId=${tableId}`)(dispatch, getState);
    fetchServiceStatus(`tableId=${tableId}`)(dispatch, getState);
  }
  // 保存tableId和tableKey到sessionStorage
  sessionStorage.tableKey = tableKey || '';
  sessionStorage.tableId = tableId || '';

  return;
};

exports.clearBell = (msg) => (dispatch, getStates) => {
  dispatch(setCallMsg({ info:msg, callStatus:false }));
};

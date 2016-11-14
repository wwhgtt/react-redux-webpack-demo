const config = require('../../config');
const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
const helper = require('../../helper/dish-hepler');
const cartHelper = require('../../helper/order-dinner-cart-helper');
const commonHelper = require('../../helper/common-helper');
const setMenuData = createAction('SET_MENU_DATA', menuData => menuData);
const _orderDish = createAction('ORDER_DISH', (dishData, action) => [dishData, action]);
const _removeAllOrders = createAction('REMOVE_ALL_ORDERS', orders => orders);
const setDiscountToOrder = createAction('SET_DISCOUNT_TO_ORDER', discount => discount);
const setNormalDiscount = createAction('SET_NORMAL_DISCOUNT', discount => discount);
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
  helper.storeDishesLocalStorage(getStates().dishMenuReducer.dishesDataDuplicate, getStates().dishMenuReducer.shopInfo);
};

exports.removeAllOrders = (orders) => (dispatch, getStates) => {
  dispatch(_removeAllOrders(orders));
  helper.clearDishesLocalStorage();
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

exports.showErrMsgFunc = (msg) => (dispatch, getState) =>
  dispatch(setErrorMsg(msg));

exports.clearErrorMsg = () => (dispatch, getState) =>
  dispatch(setErrorMsg(null));

const removeBasicSession = (name) => {
  sessionStorage.removeItem(name);
};

const errorLocation = (errorCode) => {
  switch (errorCode) {
    case '90009' : // 请重新扫描二维码,链接已失效
      cartHelper.clearTableInfoInSessionStorage();
      location.href = `${config.exceptionLinkURL}?shopId=${shopId}`;
      break;
    case '90010' : // 该桌台有多个未支付的正餐订单
      cartHelper.clearTableInfoInSessionStorage();
      location.href = `${config.exceptionDishCurrentURL}?shopId=${shopId}`;
      break;
    case '90012' : // 该用户在该门店下有多个正餐加菜订单
      cartHelper.clearTableInfoInSessionStorage();
      location.href = `${config.exceptionDishURL}?shopId=${shopId}`;
      break;
    case '90013' : // 该用户在该门店下有多个正餐订单
      cartHelper.clearTableInfoInSessionStorage();
      location.href = `${config.exceptionDishURL}?shopId=${shopId}`;
      break;
    case '90014' : // 该桌台待清台或锁定中，请稍等
      cartHelper.clearTableInfoInSessionStorage();
      location.href = `${config.exceptionDishCurrentURL}?shopId=${shopId}`;
      break;
    case '90015' : // 桌台不存在
      cartHelper.clearTableInfoInSessionStorage();
      location.href = `${config.exceptionDishCurrentURL}?shopId=${shopId}`;
      break;
    case '90016' : // 当前用户在该桌台有未处理的订单
      cartHelper.clearTableInfoInSessionStorage();
      location.href = `${config.exceptionDishURL}?shopId=${shopId}`;
      break;
    default : break;
  }
};

// call 服务铃
exports.callBell = (timer) => (dispatch, getStates) => {
  dispatch(setCanCall(false));
  dispatch(setCallMsg({ info:'正在发送...', callStatus:false }));
  const orderId = sessionStorage.orderId || '';

  fetch(`${config.callServiceAPI}?shopId=${commonHelper.getUrlParam('shopId')}&orderId=${orderId}`).
  then(res => {
    if (!res.ok) {
      dispatch(setCallMsg({ info:'非常抱歉，发送失败了', callStatus:false }));
    }
    return res.json();
  }).
  then(basicData => {
    if (basicData.code === '200') {
      dispatch(setTimerStatus({ timerStatus:true }));
      commonHelper.interValSetting(timer, () => {
        dispatch(setTimerStatus({ timerStatus:false }));
      });
      if (basicData.data.status.toString() === '1501') { // 已经呼叫过服务员了
        dispatch(setCallMsg({ info:basicData.data.message, callStatus:true }));
        dispatch(setCanCall(true));
        return;
      }
      dispatch(setCallMsg({ info:'客官稍等，服务员马上就来', callStatus:true }));
    } else {
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
          dispatch(setErrorMsg(tableInfo.msg));
          errorLocation(tableInfo.code); // 获取tableInfo错误地址跳转
        }
      }
    }).
    catch(err => {
      console.log(err);
    });

// 根据tableId获取基本信息(带桌台)
const fetchServiceStatusHaveTable = exports.fetchServiceStatusHaveTable = (tableParam) => (dispatch, getState) =>
  fetch(`${config.getServiceStatusHaveTableAPI}?shopId=${helper.getUrlParam('shopId')}&${tableParam}`, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取快捷菜单信息失败...'));
      }
      return res.json();
    }).
    then(serviceStatus => {
      if (serviceStatus.code !== '200') {
        dispatch(setErrorMsg(serviceStatus.msg));
        errorLocation(serviceStatus.code);
      }
      dispatch(setServiceStatus({ data:serviceStatus.data || {}, isLogin:true }));
      // 保存ServiceStatus
      sessionStorage.orderId = (serviceStatus.data || {}).orderId;
    }).
    catch(err => {
      console.log(err);
    });

// 根据tableId获取基本信息(不带桌台)
const fetchServiceStatusNoTable = exports.fetchServiceStatusNoTable = () => (dispatch, getState) =>
  fetch(`${config.getServiceStatusNoTableAPI}?shopId=${helper.getUrlParam('shopId')}`, config.requestOptions).
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
          dispatch(setErrorMsg(serviceStatus.msg));
          dispatch(setServiceStatus({ data:serviceStatus.data || {}, isLogin:true }));
        }
      } else {
        cartHelper.setTableInfoInSessionStorage(shopId, { tableId: (serviceStatus.data || {}).tableId });
        dispatch(setServiceStatus({ data:serviceStatus.data || {}, isLogin:true }));
      }
      // 保存ServiceStatus
      sessionStorage.orderId = (serviceStatus.data || {}).orderId;
    }).
    catch(err => {
      console.log(err);
    });

// 根据isShowButton获取快捷菜单按钮是否显示

const fetchIsShowButton = exports.fetchIsShowButton = (tableKey, tableId) => (dispatch, getState) =>
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
        if (isShowButton.data.isShow) {
          // 没有tableId或者tableKey的情况
          if (!tableKey && !tableId) {
            fetchServiceStatusNoTable()(dispatch, getState);
          } else if (tableKey) {
            fetchServiceStatusHaveTable(`tableKey=${tableKey}`)(dispatch, getState);
          } else {
            fetchServiceStatusHaveTable(`tableId=${tableId}`)(dispatch, getState);
          }
        } else {
          dispatch(setServiceStatus({ data:{}, isLogin:true }));
        }
      }
    }).
    catch(err => {
      console.log(err);
    });

// 取到tableId 或者 根据key值获取tableId
exports.fetchTableId = (tableKey, tableId) => (dispatch, getState) => {
  removeBasicSession('orderId');

  localStorage.removeItem('dishBoxPrice');
  fetchIsShowButton(tableKey, tableId)(dispatch, getState);

  // tableInfo
  if (tableKey) {
    fetchTableInfo(`tableKey=${tableKey}`)(dispatch, getState);
  } else if (tableId) {
    fetchTableInfo(`tableId=${tableId}`)(dispatch, getState);
  }
  return;
};

exports.fetchDishMarketInfos = () => (dispatch, getState) =>
  fetch(`${config.getDishMarketInfosAPI}?shopId=${helper.getUrlParam('shopId')}`, config.requestOptions).
    then(res => {
      if (!res.ok) {
        dispatch(setErrorMsg('获取信息失败...'));
      }
      return res.json();
    }).
    then(discount => {
      if (discount.code !== '200') {
        if (discount.msg !== '未登录') {
          dispatch(setErrorMsg(discount.msg));
        }
      }
      dispatch(setNormalDiscount(discount.data));
    }).
    catch(err => {
      console.log(err);
    });

exports.clearBell = (msg) => (dispatch, getStates) => {
  dispatch(setCallMsg({ info:msg, callStatus:false }));
};

exports.saveTableParam = (tableInfo) => (dispatch, getStates) => {
  cartHelper.setTableInfoInSessionStorage(shopId, tableInfo);
};

